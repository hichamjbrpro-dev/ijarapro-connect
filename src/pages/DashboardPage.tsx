import { Building2, Home, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { mockProperties, mockPayments, mockNotifications, mockMonthlyIncome, mockTenants } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const DashboardPage = () => {
  const { t } = useTranslation();
  const totalUnits = mockProperties.reduce((s, p) => s + (p.units_count || 0), 0);
  const occupiedUnits = mockProperties.reduce((s, p) => s + (p.occupied_count || 0), 0);
  const monthlyIncome = mockPayments
    .filter((p) => p.month === '2025-03' && p.status !== 'unpaid')
    .reduce((s, p) => s + p.amount_paid, 0);
  const overduePayments = mockPayments.filter((p) => p.status === 'unpaid').length;

  const kpis = [
    { label: t.kpi_total_properties, value: mockProperties.length, icon: Building2, color: 'text-primary' },
    { label: t.kpi_total_units, value: totalUnits, icon: Home, color: 'text-primary' },
    { label: t.kpi_tenants, value: mockTenants.length, icon: Users, color: 'text-primary' },
    { label: t.kpi_monthly_income, value: formatCurrency(monthlyIncome), icon: TrendingUp, color: 'text-success' },
    { label: t.kpi_overdue, value: overduePayments, icon: AlertCircle, color: 'text-destructive' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.dashboard_title} subtitle={t.dashboard_subtitle} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-lg p-4 shadow-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground font-latin">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg p-4 shadow-card border border-border mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t.occupancy_rate}</span>
          <span className="text-sm font-latin text-muted-foreground">
            {occupiedUnits}/{totalUnits}
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all duration-500"
            style={{ width: `${(occupiedUnits / totalUnits) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-card rounded-lg p-4 shadow-card border border-border">
          <h3 className="text-sm font-semibold mb-4">{t.monthly_income_chart}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockMonthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t.income_label]}
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="income" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-card rounded-lg p-4 shadow-card border border-border">
          <h3 className="text-sm font-semibold mb-4">{t.recent_alerts}</h3>
          <div className="space-y-3">
            {mockNotifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 text-sm">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    notif.type === 'overdue' ? 'bg-destructive' :
                    notif.type === 'contract_expiring' ? 'bg-warning' :
                    notif.type === 'payment_received' ? 'bg-success' : 'bg-primary'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground leading-relaxed">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-latin">
                    {new Date(notif.created_at).toLocaleDateString('ar-MA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {overduePayments > 0 && (
        <div className="bg-card rounded-lg p-4 shadow-card border border-border border-r-4 border-r-destructive">
          <h3 className="text-sm font-semibold text-destructive mb-3">{t.overdue_rents}</h3>
          <div className="space-y-2">
            {mockPayments.filter((p) => p.status === 'unpaid').map((p) => {
              const tenant = mockTenants.find((t) => t.id === p.tenant_id);
              return (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{tenant?.full_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-latin text-muted-foreground">{formatCurrency(p.amount_due)}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
