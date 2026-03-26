import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Upload, X, FileText, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { useTenants, useUnits, useProperties, useContracts } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { Tenant } from '@/types';

const TenantsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: tenants = [], isLoading } = useTenants();
  const { data: units = [] } = useUnits();
  const { data: properties = [] } = useProperties();
  const { data: contracts = [] } = useContracts();
  const [search, setSearch] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ full_name: '', cin: '', phone: '', email: '', unit_id: '' });

  const filtered = tenants.filter((tenant) =>
    tenant.full_name.includes(search) || (tenant.cin || '').toLowerCase().includes(search.toLowerCase())
  );

  const vacantUnits = units.filter((u) => u.status === 'vacant');

  const clearFile = () => { setAttachedFile(null); setFilePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) { toast.error(t.file_type_error); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error(t.file_size_error); return; }
    setAttachedFile(file);
    setFilePreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  };

  const openAddSheet = () => { setEditingTenant(null); setFormData({ full_name: '', cin: '', phone: '', email: '', unit_id: '' }); clearFile(); setSheetOpen(true); };

  const openEditSheet = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({ full_name: tenant.full_name, cin: tenant.cin || '', phone: tenant.phone || '', email: tenant.email || '', unit_id: tenant.unit_id });
    clearFile(); setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.cin) { toast.error(t.fill_required); return; }
    if (editingTenant) {
      const { error } = await supabase.from('tenants').update({
        full_name: formData.full_name, cin: formData.cin, phone: formData.phone,
        email: formData.email || null, unit_id: formData.unit_id || null,
      }).eq('id', editingTenant.id);
      if (error) { toast.error(error.message); return; }
      toast.success(t.tenant_updated(formData.full_name));
    } else {
      const { error } = await supabase.from('tenants').insert({
        full_name: formData.full_name, cin: formData.cin, phone: formData.phone,
        email: formData.email || null, unit_id: formData.unit_id || null,
      });
      if (error) { toast.error(error.message); return; }
      toast.success(t.tenant_added(formData.full_name));
    }
    queryClient.invalidateQueries({ queryKey: ['tenants'] });
    setFormData({ full_name: '', cin: '', phone: '', email: '', unit_id: '' });
    setEditingTenant(null); setSheetOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingTenant) return;
    const { error } = await supabase.from('tenants').delete().eq('id', deletingTenant.id);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ['tenants'] });
    toast.success(t.tenant_deleted(deletingTenant.full_name));
    setDeletingTenant(null);
  };

  const getUnitLabel = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return '';
    const prop = properties.find((p) => p.id === unit.property_id);
    return `${prop?.name} - ${t.unit} ${unit.unit_number}`;
  };

  const availableUnits = editingTenant
    ? [...vacantUnits, ...units.filter((u) => u.id === editingTenant.unit_id)]
    : vacantUnits;

  if (isLoading) return <div className="animate-fade-in p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.tenants_title} subtitle={t.tenants_count(tenants.length)}>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground" onClick={openAddSheet}>
              <Plus className="w-4 h-4 ml-2" />{t.add_tenant}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader><SheetTitle className="text-right">{editingTenant ? t.edit_tenant : t.add_new_tenant}</SheetTitle></SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-right block">{t.full_name} *</Label>
                <Input placeholder={t.enter_full_name} value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="h-10 text-right" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">{t.cin_number} *</Label>
                <Input placeholder={t.cin_example} value={formData.cin} onChange={(e) => setFormData({ ...formData, cin: e.target.value })} className="h-10 text-right font-latin" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">{t.phone}</Label>
                <Input placeholder="+212600000000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-10 font-latin" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">{t.email}</Label>
                <Input placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-10 font-latin" dir="ltr" type="email" />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">{t.unit}</Label>
                {availableUnits.length > 0 ? (
                  <Select value={formData.unit_id} onValueChange={(v) => setFormData({ ...formData, unit_id: v })}>
                    <SelectTrigger className="h-10"><SelectValue placeholder={t.select_unit} /></SelectTrigger>
                    <SelectContent>{availableUnits.map((u) => <SelectItem key={u.id} value={u.id}>{getUnitLabel(u.id)}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted rounded-md p-3">{t.no_vacant_units}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-right block">{t.document_upload}</Label>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFileChange} className="hidden" />
                {!attachedFile ? (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8" /><span className="text-sm">{t.upload_hint}</span><span className="text-xs">{t.upload_size_hint}</span>
                  </button>
                ) : (
                  <div className="border border-border rounded-lg p-3 flex items-center gap-3 bg-muted/50">
                    {filePreview ? <img src={filePreview} alt={t.preview_alt} className="w-12 h-12 rounded object-cover shrink-0" /> : (
                      <div className="w-12 h-12 rounded bg-destructive/10 flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-destructive" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{attachedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(attachedFile.size / 1024).toFixed(0)} {t.file_size_kb}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={clearFile}><X className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground mt-4" onClick={handleSave}>
                {editingTenant ? t.save_changes : t.save_tenant}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder={t.search_name_cin} value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pr-10 text-right" />
      </div>

      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">{t.full_name}</TableHead>
                <TableHead className="text-right">{t.cin_number}</TableHead>
                <TableHead className="text-right">{t.phone}</TableHead>
                <TableHead className="text-right">{t.property}</TableHead>
                <TableHead className="text-right">{t.unit}</TableHead>
                <TableHead className="text-right">{t.move_in_date}</TableHead>
                <TableHead className="text-center w-[100px]">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => {
                const unit = units.find((u) => u.id === tenant.unit_id);
                const property = unit ? properties.find((p) => p.id === unit.property_id) : null;
                return (
                  <TableRow key={tenant.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/tenants/${tenant.id}`)}>
                    <TableCell className="font-medium text-primary hover:underline">{tenant.full_name}</TableCell>
                    <TableCell className="font-latin text-muted-foreground">{tenant.cin || '—'}</TableCell>
                    <TableCell className="font-latin text-muted-foreground" dir="ltr">{tenant.phone || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{property?.name || '—'}</TableCell>
                    <TableCell>{unit?.unit_number || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tenant.move_in_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {!contracts.some(c => c.tenant_id === tenant.id) && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-success" title={t.add_contract} onClick={(e) => { e.stopPropagation(); navigate('/contracts'); }}>
                            <FilePlus className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); openEditSheet(tenant); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeletingTenant(tenant); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deletingTenant} onOpenChange={(open) => !open && setDeletingTenant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">{t.confirm_delete}</AlertDialogTitle>
            <AlertDialogDescription className="text-right">{deletingTenant ? t.confirm_delete_msg(deletingTenant.full_name) : ''}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TenantsPage;
