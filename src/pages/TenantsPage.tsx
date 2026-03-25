import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Upload, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import PageHeader from '@/components/shared/PageHeader';
import { mockTenants, mockUnits, mockProperties } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { Tenant } from '@/types';

const TenantsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    cin: '',
    phone: '',
    email: '',
    unit_id: '',
  });

  const filtered = tenants.filter((t) =>
    t.full_name.includes(search) || t.cin.toLowerCase().includes(search.toLowerCase())
  );

  const vacantUnits = mockUnits.filter((u) => u.status === 'vacant');

  const clearFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('يرجى اختيار صورة (JPG, PNG, WebP) أو ملف PDF');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم الملف يجب أن لا يتجاوز 10 ميغابايت');
      return;
    }
    setAttachedFile(file);
    if (file.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const openAddSheet = () => {
    setEditingTenant(null);
    setFormData({ full_name: '', cin: '', phone: '', email: '', unit_id: '' });
    clearFile();
    setSheetOpen(true);
  };

  const openEditSheet = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      full_name: tenant.full_name,
      cin: tenant.cin,
      phone: tenant.phone,
      email: tenant.email || '',
      unit_id: tenant.unit_id,
    });
    clearFile();
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.full_name || !formData.cin) {
      toast.error('يرجى ملء الاسم الكامل ورقم CIN');
      return;
    }

    if (editingTenant) {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === editingTenant.id
            ? { ...t, ...formData }
            : t
        )
      );
      toast.success(`تم تعديل بيانات "${formData.full_name}" بنجاح`);
    } else {
      const newTenant: Tenant = {
        id: `t-new-${Date.now()}`,
        owner_id: '1',
        ...formData,
        move_in_date: new Date().toISOString().split('T')[0],
      };
      setTenants((prev) => [...prev, newTenant]);
      toast.success(`تمت إضافة المستأجر "${formData.full_name}" بنجاح`);
    }

    setFormData({ full_name: '', cin: '', phone: '', email: '', unit_id: '' });
    setEditingTenant(null);
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!deletingTenant) return;
    setTenants((prev) => prev.filter((t) => t.id !== deletingTenant.id));
    toast.success(`تم حذف المستأجر "${deletingTenant.full_name}" بنجاح`);
    setDeletingTenant(null);
  };

  const getUnitLabel = (unitId: string) => {
    const unit = mockUnits.find((u) => u.id === unitId);
    if (!unit) return '';
    const prop = mockProperties.find((p) => p.id === unit.property_id);
    return `${prop?.name} - وحدة ${unit.unit_number}`;
  };

  const availableUnits = editingTenant
    ? [...vacantUnits, ...mockUnits.filter((u) => u.id === editingTenant.unit_id)]
    : vacantUnits;

  return (
    <div className="animate-fade-in">
      <PageHeader title="المستأجرون" subtitle={`${tenants.length} مستأجر`}>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground" onClick={openAddSheet}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة مستأجر
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-right">
                {editingTenant ? 'تعديل بيانات المستأجر' : 'إضافة مستأجر جديد'}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-right block">الاسم الكامل *</Label>
                <Input
                  placeholder="أدخل الاسم الكامل"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="h-10 text-right"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">رقم CIN *</Label>
                <Input
                  placeholder="مثال: BK123456"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  className="h-10 text-right font-latin"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">الهاتف</Label>
                <Input
                  placeholder="+212600000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 font-latin"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">البريد الإلكتروني</Label>
                <Input
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 font-latin"
                  dir="ltr"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">الوحدة</Label>
                {availableUnits.length > 0 ? (
                  <Select value={formData.unit_id} onValueChange={(v) => setFormData({ ...formData, unit_id: v })}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="اختر وحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {getUnitLabel(u.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted rounded-md p-3">
                    لا توجد وحدات شاغرة حالياً
                  </p>
                )}
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary-light text-primary-foreground mt-4"
                onClick={handleSave}
              >
                {editingTenant ? 'حفظ التعديلات' : 'حفظ المستأجر'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="البحث بالاسم أو رقم CIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pr-10 text-right"
        />
      </div>

      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم الكامل</TableHead>
                <TableHead className="text-right">رقم CIN</TableHead>
                <TableHead className="text-right">الهاتف</TableHead>
                <TableHead className="text-right">الوحدة</TableHead>
                <TableHead className="text-right">تاريخ الدخول</TableHead>
                <TableHead className="text-center w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => {
                const unit = mockUnits.find((u) => u.id === tenant.unit_id);
                return (
                  <TableRow key={tenant.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/tenants/${tenant.id}`)}>
                    <TableCell className="font-medium text-primary hover:underline">{tenant.full_name}</TableCell>
                    <TableCell className="font-latin text-muted-foreground">{tenant.cin || '—'}</TableCell>
                    <TableCell className="font-latin text-muted-foreground" dir="ltr">{tenant.phone || '—'}</TableCell>
                    <TableCell>{unit?.unit_number || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tenant.move_in_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => openEditSheet(tenant)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingTenant(tenant)}
                        >
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
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف المستأجر "{deletingTenant?.full_name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TenantsPage;
