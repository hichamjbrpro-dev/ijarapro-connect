import { useState, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Search, ArrowUpDown, ArrowUp, ArrowDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { mockPayments, mockTenants, mockUnits, mockProperties } from '@/data/mockData';
import { formatCurrency, formatMonth } from '@/utils/formatters';
import type { PaymentStatus } from '@/types';

// Pre-build lookup maps once
const tenantMap = new Map(mockTenants.map(t => [t.id, t]));
const unitMap = new Map(mockUnits.map(u => [u.id, u]));

type SortKey = 'unit' | 'tenant' | 'due' | 'paid' | 'status' | 'date';
type SortDir = 'asc' | 'desc' | null;

const PaymentsPage = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState('2026-03');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const monthPayments = useMemo(
    () => mockPayments.filter(p => p.month === currentMonth),
    [currentMonth]
  );

  const filtered = useMemo(() => {
    let result = monthPayments;

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(p => {
        const tenant = tenantMap.get(p.tenant_id);
        const unit = unitMap.get(p.unit_id);
        return (
          tenant?.full_name.toLowerCase().includes(q) ||
          unit?.unit_number.toLowerCase().includes(q)
        );
      });
    }

    if (propertyFilter !== 'all') {
      result = result.filter(p => {
        const unit = unitMap.get(p.unit_id);
        return unit?.property_id === propertyFilter;
      });
    }

    return result;
  }, [monthPayments, statusFilter, searchQuery, propertyFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'unit':
          cmp = (unitMap.get(a.unit_id)?.unit_number || '').localeCompare(unitMap.get(b.unit_id)?.unit_number || '');
          break;
        case 'tenant':
          cmp = (tenantMap.get(a.tenant_id)?.full_name || '').localeCompare(tenantMap.get(b.tenant_id)?.full_name || '');
          break;
        case 'due':
          cmp = a.amount_due - b.amount_due;
          break;
        case 'paid':
          cmp = a.amount_paid - b.amount_paid;
          break;
        case 'status': {
          const order = { paid: 0, partial: 1, unpaid: 2 };
          cmp = order[a.status] - order[b.status];
          break;
        }
        case 'date':
          cmp = (a.payment_date || '').localeCompare(b.payment_date || '');
          break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const { totalDue, totalPaid } = useMemo(() => {
    let due = 0, paid = 0;
    for (const p of monthPayments) {
      due += p.amount_due;
      paid += p.amount_paid;
    }
    return { totalDue: due, totalPaid: paid };
  }, [monthPayments]);

  const prevMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const [y, m] = prev.split('-').map(Number);
      const d = new Date(y, m - 2);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const [y, m] = prev.split('-').map(Number);
      const d = new Date(y, m);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
  }, []);

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc');
        return key;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column || !sortDir) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const filters: { label: string; value: PaymentStatus | 'all' }[] = useMemo(() => [
    { label: t.filter_all, value: 'all' },
    { label: t.filter_paid, value: 'paid' },
    { label: t.filter_unpaid, value: 'unpaid' },
    { label: t.filter_partial, value: 'partial' },
  ], [t]);

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

      {/* Search + Property filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.search_payments}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <select
            value={propertyFilter}
            onChange={e => setPropertyFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-foreground border-none outline-none cursor-pointer"
          >
            <option value="all">{t.all_properties}</option>
            {mockProperties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status filter */}
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
                {([
                  ['unit', t.unit_col],
                  ['tenant', t.tenant_col],
                  ['due', t.due],
                  ['paid', t.total_paid],
                  ['status', t.status],
                  ['date', t.date_col],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <TableHead
                    key={key}
                    className="text-right cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon column={key} />
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t.search_payments}
                  </TableCell>
                </TableRow>
              ) : sorted.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-latin">{unitMap.get(p.unit_id)?.unit_number || '—'}</TableCell>
                  <TableCell>{tenantMap.get(p.tenant_id)?.full_name || '—'}</TableCell>
                  <TableCell className="font-latin">{formatCurrency(p.amount_due)}</TableCell>
                  <TableCell className="font-latin">{formatCurrency(p.amount_paid)}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-muted-foreground font-latin">{p.payment_date || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
