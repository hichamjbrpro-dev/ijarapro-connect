import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Phone, Mail, CreditCard, Home, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { mockTenants, mockUnits, mockProperties, mockPayments, mockContracts } from '@/data/mockData';
import { formatDate, formatCurrency } from '@/utils/formatters';

const TenantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tenant = mockTenants.find((tn) => tn.id === id);
  const unit = tenant ? mockUnits.find((u) => u.id === tenant.unit_id) : null;
  const property = unit ? mockProperties.find((p) => p.id === unit.property_id) : null;
  const payments = mockPayments.filter((p) => p.tenant_id === id);
  const contracts = mockContracts.filter((c) => c.tenant_id === id);

  if (!tenant) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground text-lg mb-4">{t.tenant_not_found}</p>
        <Button variant="outline" onClick={() => navigate('/tenants')}>
          <ArrowRight className="w-4 h-4 ml-2" />
          {t.back_to_tenants}
        </Button>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const totalDue = payments.reduce((sum, p) => sum + p.amount_due, 0);
  const totalUnpaid = totalDue - totalPaid;

  const unitTypeMap: Record<string, string> = {
    apartment: t.unit_type_apartment,
    shop: t.unit_type_shop,
    studio: t.unit_type_studio,
    floor: t.unit_type_floor,
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenants')} className="shrink-0">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tenant.full_name}</h1>
          <p className="text-sm text-muted-foreground">
            {property?.name} — {t.unit} {unit?.unit_number}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.monthly_rent}</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(unit?.monthly_rent || 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.total_paid}</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.total_unpaid}</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(totalUnpaid)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" dir="rtl">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="info" className="gap-2">
            <User className="w-4 h-4" />
            {t.personal_info}
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" />
            {t.nav_payments}
          </TabsTrigger>
          <TabsTrigger value="contract" className="gap-2">
            <FileText className="w-4 h-4" />
            {t.contract}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.personal_info}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoRow icon={<User className="w-4 h-4" />} label={t.full_name} value={tenant.full_name} />
                <InfoRow icon={<CreditCard className="w-4 h-4" />} label={t.cin_number} value={tenant.cin || '—'} dir="ltr" />
                <InfoRow icon={<Phone className="w-4 h-4" />} label={t.phone} value={tenant.phone || '—'} dir="ltr" />
                <InfoRow icon={<Mail className="w-4 h-4" />} label={t.email} value={tenant.email || '—'} dir="ltr" />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label={t.move_in_date} value={formatDate(tenant.move_in_date)} />
                <InfoRow icon={<Home className="w-4 h-4" />} label={t.property} value={property?.name || '—'} />
                <InfoRow icon={<Home className="w-4 h-4" />} label={t.unit} value={unit?.unit_number || '—'} />
                <InfoRow icon={<Home className="w-4 h-4" />} label={t.unit_type} value={unit?.type ? (unitTypeMap[unit.type] || unit.type) : '—'} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.payment_history}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t.month_col}</TableHead>
                        <TableHead className="text-right">{t.amount_due}</TableHead>
                        <TableHead className="text-right">{t.amount_paid}</TableHead>
                        <TableHead className="text-right">{t.status}</TableHead>
                        <TableHead className="text-right">{t.payment_date}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-latin">{payment.month}</TableCell>
                          <TableCell>{formatCurrency(payment.amount_due)}</TableCell>
                          <TableCell>{formatCurrency(payment.amount_paid)}</TableCell>
                          <TableCell><StatusBadge status={payment.status} /></TableCell>
                          <TableCell className="text-muted-foreground">{payment.payment_date ? formatDate(payment.payment_date) : '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">{t.no_payments}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.contracts}</CardTitle>
            </CardHeader>
            <CardContent>
              {contracts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t.start_date}</TableHead>
                        <TableHead className="text-right">{t.end_date}</TableHead>
                        <TableHead className="text-right">{t.days_remaining}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>{formatDate(contract.start_date)}</TableCell>
                          <TableCell>{formatDate(contract.end_date)}</TableCell>
                          <TableCell>
                            {contract.days_remaining !== undefined ? (
                              <Badge variant={contract.days_remaining < 30 ? 'destructive' : 'secondary'}>
                                {contract.days_remaining} {t.day}
                              </Badge>
                            ) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">{t.no_contracts}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const InfoRow = ({ icon, label, value, dir }: { icon: React.ReactNode; label: string; value: string; dir?: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium text-foreground ${dir === 'ltr' ? 'font-latin' : ''}`} dir={dir}>{value}</p>
    </div>
  </div>
);

export default TenantDetailPage;
