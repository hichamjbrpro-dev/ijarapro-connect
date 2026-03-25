import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import { mockTenants, mockUnits, mockProperties } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';

const TenantsPage = () => {
  const [search, setSearch] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    full_name: '',
    cin: '',
    phone: '',
    email: '',
    unit_id: '',
  });

  const filtered = mockTenants.filter((t) =>
    t.full_name.includes(search) || t.cin.toLowerCase().includes(search.toLowerCase())
  );

  const vacantUnits = mockUnits.filter((u) => u.status === 'vacant');

  const handleSave = () => {
    if (!newTenant.full_name || !newTenant.cin) {
      toast.error('يرجى ملء الاسم الكامل ورقم CIN');
      return;
    }
    toast.success(`تمت إضافة المستأجر "${newTenant.full_name}" بنجاح`);
    setNewTenant({ full_name: '', cin: '', phone: '', email: '', unit_id: '' });
    setSheetOpen(false);
  };

  const getUnitLabel = (unitId: string) => {
    const unit = mockUnits.find((u) => u.id === unitId);
    if (!unit) return '';
    const prop = mockProperties.find((p) => p.id === unit.property_id);
    return `${prop?.name} - وحدة ${unit.unit_number}`;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="المستأجرون" subtitle={`${mockTenants.length} مستأجر`}>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مستأجر
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-right">إضافة مستأجر جديد</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-right block">الاسم الكامل *</Label>
                <Input
                  placeholder="أدخل الاسم الكامل"
                  value={newTenant.full_name}
                  onChange={(e) => setNewTenant({ ...newTenant, full_name: e.target.value })}
                  className="h-10 text-right"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">رقم CIN *</Label>
                <Input
                  placeholder="مثال: BK123456"
                  value={newTenant.cin}
                  onChange={(e) => setNewTenant({ ...newTenant, cin: e.target.value })}
                  className="h-10 text-right font-latin"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">الهاتف</Label>
                <Input
                  placeholder="+212600000000"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  className="h-10 font-latin"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">البريد الإلكتروني</Label>
                <Input
                  placeholder="email@example.com"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  className="h-10 font-latin"
                  dir="ltr"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-right block">الوحدة</Label>
                {vacantUnits.length > 0 ? (
                  <Select value={newTenant.unit_id} onValueChange={(v) => setNewTenant({ ...newTenant, unit_id: v })}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="اختر وحدة شاغرة" />
                    </SelectTrigger>
                    <SelectContent>
                      {vacantUnits.map((u) => (
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
                حفظ المستأجر
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => {
                const unit = mockUnits.find((u) => u.id === tenant.unit_id);
                return (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.full_name}</TableCell>
                    <TableCell className="font-latin text-muted-foreground">{tenant.cin || '—'}</TableCell>
                    <TableCell className="font-latin text-muted-foreground" dir="ltr">{tenant.phone || '—'}</TableCell>
                    <TableCell>{unit?.unit_number || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tenant.move_in_date)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TenantsPage;
