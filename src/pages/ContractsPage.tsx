import { FileText, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { mockContracts, mockTenants, mockUnits } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';

const ContractsPage = () => {
  const getStatusColor = (days: number | undefined) => {
    if (days === undefined) return 'border-border';
    if (days < 0) return 'border-r-destructive';
    if (days <= 30) return 'border-r-warning';
    return 'border-r-success';
  };

  const getStatusLabel = (days: number | undefined) => {
    if (days === undefined) return '';
    if (days < 0) return 'منتهي';
    if (days <= 30) return '⚠ ينتهي قريباً';
    return 'ساري';
  };

  const getStatusBadgeColor = (days: number | undefined) => {
    if (days === undefined) return 'bg-muted text-muted-foreground';
    if (days < 0) return 'bg-destructive/15 text-destructive';
    if (days <= 30) return 'bg-warning/15 text-warning';
    return 'bg-success/15 text-success';
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="العقود" subtitle={`${mockContracts.length} عقد`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockContracts.map((contract) => {
          const tenant = mockTenants.find((t) => t.id === contract.tenant_id);
          const unit = mockUnits.find((u) => u.id === contract.unit_id);
          return (
            <div
              key={contract.id}
              className={`bg-card rounded-lg shadow-card border border-border border-r-4 p-5 ${getStatusColor(contract.days_remaining)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{tenant?.full_name}</p>
                    <p className="text-xs text-muted-foreground">وحدة {unit?.unit_number}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(contract.days_remaining)}`}>
                  {getStatusLabel(contract.days_remaining)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاريخ البداية</span>
                  <span className="font-latin">{formatDate(contract.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاريخ النهاية</span>
                  <span className="font-latin">{formatDate(contract.end_date)}</span>
                </div>
                {contract.days_remaining !== undefined && contract.days_remaining >= 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الأيام المتبقية</span>
                    <span className="font-latin font-semibold">{contract.days_remaining} يوم</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Download className="w-3 h-3 ml-1" />
                  تحميل
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Upload className="w-3 h-3 ml-1" />
                  رفع عقد
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractsPage;
