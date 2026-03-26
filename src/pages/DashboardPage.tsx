import { Building2, Home, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { useProperties, usePayments, useNotifications, useMonthlyIncome, useTenants } from '@/hooks/useSupabaseData';
import { formatCurrency } from '@/utils/formatters';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { data: properties = [] } = useProperties();
  const { data: payments = [] } = usePayments();
  const { data: notifications = [] } = useNotifications();
  const { data: tenants = [] } = useTenants();
  const { data: monthlyIncome = [] } = useMonthlyIncome();

  const totalUnits = properties.reduce((s, p) => s + (p.units_count || 0), 0);
  const occupiedUnits = properties.reduce((s, p) => s + (p.occupied_count || 0), 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncomeVal = payments
    .filter((p) => p.month === currentMonth && p.status !== 'unpaid')
    .reduce((s, p) => s + p.amount_paid, 0);
  const overduePayments = payments.filter((p) => p.status === 'unpaid').length;

  const kpis = [
    { label: t.kpi_total_properties, value: properties.length, icon: Building2, color: 'text-primary' },
    { label: t.kpi_total_units, value: totalUnits, icon: Home, color: 'text-primary' },
    { label: t.kpi_tenants, value: tenants.length, icon: Users, color: 'text-primary' },
    { label: t.kpi_monthly_income, value: formatCurrency(monthlyIncomeVal), icon: TrendingUp, color: 'text-success' },
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
            style={{ width: `${totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-card rounded-lg p-5 shadow-card border border-border">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold">{t.monthly_income_chart}</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyIncome} barCategoryGap="20%">
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} width={40} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t.income_label]}
                contentStyle={{ borderRadius: 10, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13, direction: 'rtl' }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
              />
              <Bar dataKey="income" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]} maxBarSize={48} animationDuration={800} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-card rounded-lg p-4 shadow-card border border-border">
          <h3 className="text-sm font-semibold mb-4">{t.recent_alerts}</h3>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  notif.type === 'overdue' ? 'bg-destructive' :
                  notif.type === 'contract_expiring' ? 'bg-warning' :
                  notif.type === 'payment_received' ? 'bg-success' : 'bg-primary'
                }`} />
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
            {payments.filter((p) => p.status === 'unpaid').slice(0, 10).map((p) => {
              const tenant = tenants.find((tn) => tn.id === p.tenant_id);
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
