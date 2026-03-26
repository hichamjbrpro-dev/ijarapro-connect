import { useState, useMemo } from 'react';
import { Building2, Plus, MapPin, Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { mockProperties } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { Property } from '@/types';

const propertyTypeKeys: Record<string, 'property_type_apartment_building' | 'property_type_house' | 'property_type_shop' | 'property_type_floor'> = {
  apartment_building: 'property_type_apartment_building',
  house: 'property_type_house',
  shop: 'property_type_shop',
  floor: 'property_type_floor',
};

const PropertyCard = ({ property }: { property: Property }) => {
  const { t } = useTranslation();
  const occupancy = property.units_count ? ((property.occupied_count || 0) / property.units_count) * 100 : 0;
  const typeKey = propertyTypeKeys[property.type];

  return (
    <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden hover:shadow-elevated transition-shadow duration-150">
      <div className="h-36 bg-primary-50 flex items-center justify-center">
        <Building2 className="w-12 h-12 text-primary/40" />
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
  const [filterCity, setFilterCity] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = filterCity === 'all'
    ? mockProperties
    : mockProperties.filter((p) => p.city === filterCity);

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.properties_title} subtitle={t.properties_count(mockProperties.length)}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <Plus className="w-4 h-4 ml-2" />
              {t.add_property}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.add_new_property}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder={t.property_name} className="h-10 text-right" />
              <Select>
                <SelectTrigger className="h-10"><SelectValue placeholder={t.property_type} /></SelectTrigger>
                <SelectContent>
                  {Object.entries(propertyTypeKeys).map(([k, tKey]) => (
                    <SelectItem key={k} value={k}>{t[tKey]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-10"><SelectValue placeholder={t.city} /></SelectTrigger>
                <SelectContent>
                  {t.cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder={t.address} className="h-10 text-right" />
              <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground" onClick={() => setDialogOpen(false)}>
                {t.save}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="mb-6">
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-48 h-10">
            <SelectValue placeholder={t.all_cities} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all_cities}</SelectItem>
            {t.cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t.empty_add_first}
          subtitle={t.empty_add_subtitle}
          actionLabel={t.add_property}
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
