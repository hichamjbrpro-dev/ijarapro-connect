import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/shared/PageHeader';
import { mockTenants, mockUnits } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import StatusBadge from '@/components/shared/StatusBadge';

const TenantsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = mockTenants.filter((t) =>
    t.full_name.includes(search) || t.cin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="المستأجرون" subtitle={`${mockTenants.length} مستأجر`}>
        <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مستأجر
        </Button>
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
                    <TableCell className="font-latin text-muted-foreground">{tenant.cin}</TableCell>
                    <TableCell className="font-latin text-muted-foreground" dir="ltr">{tenant.phone}</TableCell>
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
