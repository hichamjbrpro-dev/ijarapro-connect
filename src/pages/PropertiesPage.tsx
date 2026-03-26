import { useState, useMemo } from 'react';
import { Building2, Plus, MapPin, Check, ChevronsUpDown, PlusCircle, Pencil, Trash2, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { useProperties } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Property, PropertyType } from '@/types';

interface FormUnit {
  unit_number: string;
  type: 'apartment' | 'shop' | 'studio' | 'floor';
  floor: string;
  area_sqm: string;
  monthly_rent: string;
}

const emptyUnit = (): FormUnit => ({ unit_number: '', type: 'apartment', floor: '', area_sqm: '', monthly_rent: '' });

const propertyTypeKeys: Record<string, 'property_type_apartment_building' | 'property_type_house' | 'property_type_shop' | 'property_type_floor'> = {
  apartment_building: 'property_type_apartment_building',
  house: 'property_type_house',
  shop: 'property_type_shop',
  floor: 'property_type_floor',
};

const unitTypeKeys: Record<string, 'unit_type_apartment' | 'unit_type_shop' | 'unit_type_studio' | 'unit_type_floor'> = {
  apartment: 'unit_type_apartment',
  shop: 'unit_type_shop',
  studio: 'unit_type_studio',
  floor: 'unit_type_floor',
};

const PropertyCard = ({ property, onEdit, onDelete }: { property: Property; onEdit: (p: Property) => void; onDelete: (p: Property) => void }) => {
  const { t } = useTranslation();
  const occupancy = property.units_count ? ((property.occupied_count || 0) / property.units_count) * 100 : 0;
  const typeKey = propertyTypeKeys[property.type];

  return (
    <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden hover:shadow-elevated transition-shadow duration-150 group relative">
      <div className="h-36 bg-primary-50 flex items-center justify-center relative">
        <Building2 className="w-12 h-12 text-primary/40" />
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit(property)}>
                <Pencil className="h-4 w-4 ml-2" />
                {t.edit_property}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(property)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 ml-2" />
                {t.delete_property}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground">{property.name}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary font-medium">
            {typeKey ? t[typeKey] : property.type}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span>{property.city}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span>{property.units_count} {t.units}</span>
          <span>•</span>
          <span>{property.occupied_count} {t.occupied}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-success rounded-full" style={{ width: `${occupancy}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground">
          {t.occupancy_label}: <span className="font-latin">{occupancy.toFixed(0)}%</span>
        </p>
      </div>
    </div>
  );
};

const PropertiesPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: properties = [], isLoading } = useProperties();
  const [filterCity, setFilterCity] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [customCities, setCustomCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formUnits, setFormUnits] = useState<FormUnit[]>([]);

  const allCities = useMemo(() => [...t.cities, ...customCities], [t.cities, customCities]);

  const filtered = filterCity === 'all' ? properties : properties.filter((p) => p.city === filterCity);

  const resetForm = () => {
    setFormName(''); setFormType(''); setSelectedCity(''); setFormAddress('');
    setEditingProperty(null); setFormUnits([]);
  };

  const openAddDialog = () => { resetForm(); setDialogOpen(true); };

  const openEditDialog = async (property: Property) => {
    setEditingProperty(property); setFormName(property.name); setFormType(property.type);
    setSelectedCity(property.city); setFormAddress(property.address);
    // Load existing units for this property
    const { data: existingUnits } = await supabase.from('units').select('*').eq('property_id', property.id);
    if (existingUnits && existingUnits.length > 0) {
      setFormUnits(existingUnits.map(u => ({
        unit_number: u.unit_number,
        type: u.type as FormUnit['type'],
        floor: u.floor?.toString() || '',
        area_sqm: u.area_sqm?.toString() || '',
        monthly_rent: u.monthly_rent?.toString() || '',
      })));
    } else {
      setFormUnits([]);
    }
    setDialogOpen(true);
  };

  const addUnit = () => setFormUnits(prev => [...prev, emptyUnit()]);
  const removeUnit = (idx: number) => setFormUnits(prev => prev.filter((_, i) => i !== idx));
  const updateUnit = (idx: number, field: keyof FormUnit, value: string) => {
    setFormUnits(prev => prev.map((u, i) => i === idx ? { ...u, [field]: value } : u));
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    let propertyId = editingProperty?.id;

    if (editingProperty) {
      const { error } = await supabase.from('properties').update({
        name: formName, type: (formType || editingProperty.type) as PropertyType,
        city: selectedCity || editingProperty.city, address: formAddress,
        units_count: formUnits.length || editingProperty.units_count,
      }).eq('id', editingProperty.id);
      if (error) { toast.error(error.message); return; }
      // Delete old units and re-insert
      await supabase.from('units').delete().eq('property_id', editingProperty.id);
    } else {
      const { data, error } = await supabase.from('properties').insert({
        name: formName, type: (formType || 'apartment_building') as PropertyType,
        city: selectedCity || '', address: formAddress,
        units_count: formUnits.length,
      }).select('id').single();
      if (error) { toast.error(error.message); return; }
      propertyId = data.id;
    }

    // Insert units
    if (formUnits.length > 0 && propertyId) {
      const unitsToInsert = formUnits.filter(u => u.unit_number.trim()).map(u => ({
        property_id: propertyId!,
        unit_number: u.unit_number,
        type: u.type,
        floor: u.floor ? parseInt(u.floor) : null,
        area_sqm: u.area_sqm ? parseFloat(u.area_sqm) : null,
        monthly_rent: u.monthly_rent ? parseFloat(u.monthly_rent) : 0,
        status: 'vacant' as const,
      }));
      if (unitsToInsert.length > 0) {
        const { error } = await supabase.from('units').insert(unitsToInsert);
        if (error) { toast.error(error.message); return; }
      }
    }

    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['units'] });
    setDialogOpen(false); resetForm();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('units').delete().eq('property_id', deleteTarget.id);
    const { error } = await supabase.from('properties').delete().eq('id', deleteTarget.id);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['units'] });
    setDeleteTarget(null);
  };

  if (isLoading) return <div className="animate-fade-in p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.properties_title} subtitle={t.properties_count(properties.length)}>
        <Button className="bg-primary hover:bg-primary-light text-primary-foreground" onClick={openAddDialog}>
          <Plus className="w-4 h-4 ml-2" />
          {t.add_property}
        </Button>
      </PageHeader>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProperty ? t.edit_property : t.add_new_property}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder={t.property_name} className="h-10 text-right" value={formName} onChange={e => setFormName(e.target.value)} />
            <Select value={formType} onValueChange={setFormType}>
              <SelectTrigger className="h-10"><SelectValue placeholder={t.property_type} /></SelectTrigger>
              <SelectContent>
                {Object.entries(propertyTypeKeys).map(([k, tKey]) => (
                  <SelectItem key={k} value={k}>{t[tKey]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={cityPopoverOpen} className="w-full h-10 justify-between text-right font-normal">
                  {selectedCity || <span className="text-muted-foreground">{t.city}</span>}
                  <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={t.city} value={citySearch} onValueChange={setCitySearch} />
                  <CommandList>
                    <CommandEmpty className="p-0">
                      {citySearch.trim() && (
                        <button className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-primary hover:bg-accent cursor-pointer" onClick={() => {
                          const newCity = citySearch.trim(); setCustomCities(prev => [...prev, newCity]);
                          setSelectedCity(newCity); setCitySearch(''); setCityPopoverOpen(false);
                        }}>
                          <PlusCircle className="h-4 w-4" />
                          إضافة "{citySearch.trim()}"
                        </button>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {allCities.map((city) => (
                        <CommandItem key={city} value={city} onSelect={() => { setSelectedCity(city); setCityPopoverOpen(false); }}>
                          <Check className={cn("mr-2 h-4 w-4", selectedCity === city ? "opacity-100" : "opacity-0")} />
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input placeholder={t.address} className="h-10 text-right" value={formAddress} onChange={e => setFormAddress(e.target.value)} />

            {/* Units Section */}
            <Separator />
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">{t.units_section}</h4>
              <Button type="button" variant="outline" size="sm" onClick={addUnit}>
                <Plus className="w-3 h-3 ml-1" />
                {t.add_unit}
              </Button>
            </div>

            {formUnits.map((unit, idx) => (
              <div key={idx} className="border border-border rounded-lg p-3 space-y-3 relative bg-muted/30">
                <Button
                  type="button" variant="ghost" size="icon"
                  className="absolute top-1 left-1 h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => removeUnit(idx)}
                >
                  <X className="w-3 h-3" />
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder={t.unit_number_label}
                    className="h-9 text-right text-sm"
                    value={unit.unit_number}
                    onChange={e => updateUnit(idx, 'unit_number', e.target.value)}
                  />
                  <Select value={unit.type} onValueChange={v => updateUnit(idx, 'type', v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t.unit_type_label} /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitTypeKeys).map(([k, tKey]) => (
                        <SelectItem key={k} value={k}>{t[tKey]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder={t.unit_floor}
                    className="h-9 text-right text-sm"
                    type="number"
                    value={unit.floor}
                    onChange={e => updateUnit(idx, 'floor', e.target.value)}
                  />
                  <Input
                    placeholder={t.unit_area}
                    className="h-9 text-right text-sm"
                    type="number"
                    value={unit.area_sqm}
                    onChange={e => updateUnit(idx, 'area_sqm', e.target.value)}
                  />
                  <Input
                    placeholder={t.unit_rent}
                    className="h-9 text-right text-sm"
                    type="number"
                    value={unit.monthly_rent}
                    onChange={e => updateUnit(idx, 'monthly_rent', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground" onClick={handleSave}>
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.delete_property_confirm}</AlertDialogTitle>
            <AlertDialogDescription>{t.delete_property_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-6">
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-48 h-10"><SelectValue placeholder={t.all_cities} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all_cities}</SelectItem>
            {allCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.empty_add_first} subtitle={t.empty_add_subtitle} actionLabel={t.add_property} onAction={openAddDialog} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => <PropertyCard key={p.id} property={p} onEdit={openEditDialog} onDelete={setDeleteTarget} />)}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
