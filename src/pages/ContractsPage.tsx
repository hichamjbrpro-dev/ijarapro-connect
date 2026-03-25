import { useState, useRef } from 'react';
import { FileText, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { mockContracts, mockTenants, mockUnits } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ContractsPage = () => {
  const { t } = useTranslation();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; url: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (days: number | undefined) => {
    if (days === undefined) return 'border-border';
    if (days < 0) return 'border-r-destructive';
    if (days <= 30) return 'border-r-warning';
    return 'border-r-success';
  };

  const getStatusLabel = (days: number | undefined) => {
    if (days === undefined) return '';
    if (days < 0) return t.status_expired;
    if (days <= 30) return t.status_expiring;
    return t.status_active;
  };

  const getStatusBadgeColor = (days: number | undefined) => {
    if (days === undefined) return 'bg-muted text-muted-foreground';
    if (days < 0) return 'bg-destructive/15 text-destructive';
    if (days <= 30) return 'bg-warning/15 text-warning';
    return 'bg-success/15 text-success';
  };

  const handleUploadClick = (contractId: string) => {
    setSelectedContractId(contractId);
    setUploadDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContractId) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t.upload_contract + ': PDF, JPG, PNG');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('10MB max');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFiles(prev => ({
      ...prev,
      [selectedContractId]: { name: file.name, url }
    }));

    toast.success(t.upload_contract + ' ✓');
    setUploadDialogOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (contractId: string) => {
    const uploaded = uploadedFiles[contractId];
    if (uploaded) {
      const a = document.createElement('a');
      a.href = uploaded.url;
      a.download = uploaded.name;
      a.click();
    } else {
      toast.info(t.download + ': ' + t.upload_contract);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.contracts_title} subtitle={t.contracts_count(mockContracts.length)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockContracts.map((contract) => {
          const tenant = mockTenants.find((tn) => tn.id === contract.tenant_id);
          const unit = mockUnits.find((u) => u.id === contract.unit_id);
          const hasFile = !!uploadedFiles[contract.id];
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
                    <p className="text-xs text-muted-foreground">{t.unit} {unit?.unit_number}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(contract.days_remaining)}`}>
                  {getStatusLabel(contract.days_remaining)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.start_date}</span>
                  <span className="font-latin">{formatDate(contract.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.end_date}</span>
                  <span className="font-latin">{formatDate(contract.end_date)}</span>
                </div>
                {contract.days_remaining !== undefined && contract.days_remaining >= 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.days_remaining}</span>
                    <span className="font-latin font-semibold">{contract.days_remaining} {t.day}</span>
                  </div>
                )}
              </div>

              {hasFile && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded px-2 py-1">
                  <FileText className="w-3 h-3" />
                  <span className="truncate flex-1">{uploadedFiles[contract.id].name}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleDownload(contract.id)}>
                  <Download className="w-3 h-3 ml-1" />
                  {t.download}
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleUploadClick(contract.id)}>
                  <Upload className="w-3 h-3 ml-1" />
                  {t.upload_contract}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.upload_contract}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">PDF, JPG, PNG</span>
              <span className="text-xs text-muted-foreground mt-1">Max 10MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractsPage;
