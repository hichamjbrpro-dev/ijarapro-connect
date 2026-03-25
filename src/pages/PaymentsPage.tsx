import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { mockPayments, mockTenants, mockUnits } from '@/data/mockData';
import { formatCurrency, formatMonth } from '@/utils/formatters';
import type { PaymentStatus } from '@/types';

const PaymentsPage = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState('2026-03');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  const monthPayments = mockPayments.filter((p) => p.month === currentMonth);
  const filtered = statusFilter === 'all' ? monthPayments : monthPayments.filter((p) => p.status === statusFilter);

  const totalDue = monthPayments.reduce((s, p) => s + p.amount_due, 0);
  const totalPaid = monthPayments.reduce((s, p) => s + p.amount_paid, 0);

  const prevMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m - 2);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };
  const nextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const filters: { label: string; value: PaymentStatus | 'all' }[] = [
    { label: t.filter_all, value: 'all' },
    { label: t.filter_paid, value: 'paid' },
    { label: t.filter_unpaid, value: 'unpaid' },
    { label: t.filter_partial, value: 'partial' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.payments_title} />

      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <span className="text-lg font-semibold min-w-[160px] text-center">{formatMonth(currentMonth)}</span>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg p-4 shadow-card border border-border text-center">
          <p className="text-xs text-muted-foreground">{t.due}</p>
          <p className="text-lg font-bold font-latin mt-1">{formatCurrency(totalDue)}</p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-card border border-border text-center">
          <p className="text-xs text-muted-foreground">{t.collected}</p>
          <p className="text-lg font-bold font-latin text-success mt-1">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-card border border-border text-center">
          <p className="text-xs text-muted-foreground">{t.remaining}</p>
          <p className="text-lg font-bold font-latin text-destructive mt-1">{formatCurrency(totalDue - totalPaid)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === f.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">{t.unit_col}</TableHead>
                <TableHead className="text-right">{t.tenant_col}</TableHead>
                <TableHead className="text-right">{t.due}</TableHead>
                <TableHead className="text-right">{t.total_paid}</TableHead>
                <TableHead className="text-right">{t.status}</TableHead>
                <TableHead className="text-right">{t.date_col}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const tenant = mockTenants.find((t) => t.id === p.tenant_id);
                const unit = mockUnits.find((u) => u.id === p.unit_id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-latin">{unit?.unit_number || '—'}</TableCell>
                    <TableCell>{tenant?.full_name || '—'}</TableCell>
                    <TableCell className="font-latin">{formatCurrency(p.amount_due)}</TableCell>
                    <TableCell className="font-latin">{formatCurrency(p.amount_paid)}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-muted-foreground font-latin">{p.payment_date || '—'}</TableCell>
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

export default PaymentsPage;
