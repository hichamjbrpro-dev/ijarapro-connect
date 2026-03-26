import { useState, useRef } from 'react';
import { FileText, Download, Upload, Plus, Pencil, Trash2, Search, Check, ChevronsUpDown, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { mockContracts, mockTenants, mockUnits, mockProperties } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Contract } from '@/types';

const ContractsPage = () => {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; url: string }[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // New contract form state
  const [newTenantId, setNewTenantId] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Extract unique years sorted ascending
  const uniqueYears = [...new Set(contracts.flatMap(c => {
    const startYear = new Date(c.start_date).getFullYear();
    const endYear = new Date(c.end_date).getFullYear();
    return [startYear, endYear];
  }))].sort((a, b) => a - b);
  const [tenantPopoverOpen, setTenantPopoverOpen] = useState(false);

  // Tenants without contracts
  const tenantsWithContracts = new Set(contracts.map(c => c.tenant_id));
  const tenantsWithoutContracts = mockTenants.filter(t => !tenantsWithContracts.has(t.id));

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
      [selectedContractId]: [...(prev[selectedContractId] || []), { name: file.name, url }]
    }));

    toast.success(t.upload_contract + ' ✓');
    setUploadDialogOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (contractId: string) => {
    const files = uploadedFiles[contractId];
    if (files && files.length > 0) {
      files.forEach(f => {
        const a = document.createElement('a');
        a.href = f.url;
        a.download = f.name;
        a.click();
      });
    } else {
      toast.info(t.download + ': ' + t.upload_contract);
    }
  };

  const calcDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleAddContract = () => {
    if (!newTenantId || !newStartDate || !newEndDate) {
      toast.error(t.select_tenant);
      return;
    }

    const tenant = mockTenants.find(tn => tn.id === newTenantId);
    if (!tenant) return;

    const days = calcDaysRemaining(newEndDate);
    const newContract: Contract = {
      id: `c-${Date.now()}`,
      tenant_id: newTenantId,
      unit_id: tenant.unit_id,
      start_date: newStartDate,
      end_date: newEndDate,
      days_remaining: days,
    };

    setContracts(prev => [...prev, newContract]);

    if (newFiles.length > 0) {
      const fileEntries = newFiles.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
      setUploadedFiles(prev => ({
        ...prev,
        [newContract.id]: fileEntries
      }));
    }

    toast.success(t.add_contract + ' ✓');
    setAddDialogOpen(false);
    setNewTenantId('');
    setNewStartDate('');
    setNewEndDate('');
    setNewFiles([]);
    if (addFileInputRef.current) addFileInputRef.current.value = '';
  };

  const handleEditClick = (contract: Contract) => {
    setEditingContract(contract);
    setNewStartDate(contract.start_date);
    setNewEndDate(contract.end_date);
    setEditDialogOpen(true);
  };

  const handleEditContract = () => {
    if (!editingContract || !newStartDate || !newEndDate) return;
    const days = calcDaysRemaining(newEndDate);
    setContracts(prev => prev.map(c =>
      c.id === editingContract.id
        ? { ...c, start_date: newStartDate, end_date: newEndDate, days_remaining: days }
        : c
    ));
    toast.success(t.edit_contract + ' ✓');
    setEditDialogOpen(false);
    setEditingContract(null);
    setNewStartDate('');
    setNewEndDate('');
  };

  const handleDeleteContract = (contractId: string) => {
    if (!confirm(t.confirm_delete_contract)) return;
    setContracts(prev => prev.filter(c => c.id !== contractId));
    const { [contractId]: _, ...rest } = uploadedFiles;
    setUploadedFiles(rest);
    toast.success(t.delete_contract + ' ✓');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.contracts_title} subtitle={t.contracts_count(contracts.length)}>
        <Button onClick={() => setAddDialogOpen(true)} size="sm" disabled={tenantsWithoutContracts.length === 0}>
          <Plus className="w-4 h-4 ml-1" />
          {t.add_contract}
        </Button>
      </PageHeader>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.search_name_cin}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex gap-2">
          {([
            ['all', t.filter_all],
            ['active', t.status_active],
            ['expiring', t.status_expiring],
            ['expired', t.status_expired],
          ] as const).map(([key, label]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant={propertyFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPropertyFilter('all')}
          className="text-xs"
        >
          {t.filter_all}
        </Button>
        {mockProperties.map(p => (
          <Button
            key={p.id}
            variant={propertyFilter === p.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPropertyFilter(p.id)}
            className="text-xs"
          >
            {p.name}
          </Button>
        ))}
      </div>
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">{t.filter_year}:</span>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-foreground border-none outline-none cursor-pointer"
          >
            <option value="all">{t.all_years}</option>
            {uniqueYears.map(year => (
              <option key={year} value={String(year)}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      {(() => {
        const filtered = contracts.filter(contract => {
          if (statusFilter !== 'all') {
            const d = contract.days_remaining;
            if (statusFilter === 'expired' && (d === undefined || d >= 0)) return false;
            if (statusFilter === 'expiring' && (d === undefined || d < 0 || d > 30)) return false;
            if (statusFilter === 'active' && (d === undefined || d <= 30)) return false;
          }
          if (searchQuery.trim()) {
            const tenant = mockTenants.find(tn => tn.id === contract.tenant_id);
            const q = searchQuery.trim().toLowerCase();
            if (!tenant?.full_name.toLowerCase().includes(q)) return false;
          }
          if (propertyFilter !== 'all') {
            const unit = mockUnits.find(u => u.id === contract.unit_id);
            if (unit?.property_id !== propertyFilter) return false;
          }
          if (yearFilter !== 'all') {
            const y = parseInt(yearFilter);
            const startY = new Date(contract.start_date).getFullYear();
            const endY = new Date(contract.end_date).getFullYear();
            if (y < startY || y > endY) return false;
          }
          return true;
        });

        // Group by property
        const grouped = new Map<string, typeof filtered>();
        filtered.forEach(contract => {
          const unit = mockUnits.find(u => u.id === contract.unit_id);
          const propId = unit?.property_id || 'unknown';
          if (!grouped.has(propId)) grouped.set(propId, []);
          grouped.get(propId)!.push(contract);
        });

        return Array.from(grouped.entries()).map(([propId, propContracts]) => {
          const property = mockProperties.find(p => p.id === propId);
          return (
            <div key={propId} className="mb-6">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <h2 className="text-base font-bold text-foreground">{property?.name || propId}</h2>
                <span className="text-xs text-muted-foreground">({propContracts.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {propContracts.map((contract) => {
                  const tenant = mockTenants.find((tn) => tn.id === contract.tenant_id);
                  const unit = mockUnits.find((u) => u.id === contract.unit_id);
                  const files = uploadedFiles[contract.id] || [];
                  const hasFile = files.length > 0;
                  return (
                    <div
                      key={contract.id}
                      className={`bg-card rounded-lg shadow-card border border-border border-r-4 p-5 overflow-hidden ${getStatusColor(contract.days_remaining)}`}
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
                        <div className="mt-3 space-y-1">
                          {files.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded px-2 py-1">
                              <FileText className="w-3 h-3 shrink-0" />
                              <span className="truncate flex-1">{f.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 text-xs min-w-0 truncate" onClick={() => handleDownload(contract.id)}>
                          <Download className="w-3 h-3 shrink-0 ml-1" />
                          <span className="truncate">{t.download}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs min-w-0 truncate" onClick={() => handleUploadClick(contract.id)}>
                          <Upload className="w-3 h-3 shrink-0 ml-1" />
                          <span className="truncate">{t.upload_contract}</span>
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs min-w-0 truncate" onClick={() => handleEditClick(contract)}>
                          <Pencil className="w-3 h-3 shrink-0 ml-1" />
                          <span className="truncate">{t.edit_contract}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs min-w-0 truncate text-destructive hover:bg-destructive/10" onClick={() => handleDeleteContract(contract.id)}>
                          <Trash2 className="w-3 h-3 shrink-0 ml-1" />
                          <span className="truncate">{t.delete_contract}</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        });
      })()}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.upload_contract}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
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

      {/* Add Contract Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.add_new_contract}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.select_tenant}</Label>
              <Popover open={tenantPopoverOpen} onOpenChange={setTenantPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {newTenantId
                      ? (() => {
                          const tn = mockTenants.find(t => t.id === newTenantId);
                          const u = mockUnits.find(u => u.id === tn?.unit_id);
                          return `${tn?.full_name} — ${t.unit} ${u?.unit_number}`;
                        })()
                      : t.select_tenant}
                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t.search_name_cin} />
                    <CommandList>
                      <CommandEmpty>{t.no_tenants_without_contract}</CommandEmpty>
                      <CommandGroup>
                        {tenantsWithoutContracts.map(tenant => {
                          const unit = mockUnits.find(u => u.id === tenant.unit_id);
                          return (
                            <CommandItem
                              key={tenant.id}
                              value={tenant.full_name}
                              onSelect={() => {
                                setNewTenantId(tenant.id);
                                setTenantPopoverOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", newTenantId === tenant.id ? "opacity-100" : "opacity-0")} />
                              {tenant.full_name} — {t.unit} {unit?.unit_number}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.start_date}</Label>
                <Input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.end_date}</Label>
                <Input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.upload_contract} (max 2)</Label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">
                  {newFiles.length > 0 ? `${newFiles.length} ملف` : 'PDF, JPG, PNG — Max 10MB'}
                </span>
                <input
                  ref={addFileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files || []).slice(0, 2);
                    if (files.length > 0) setNewFiles(files);
                  }}
                />
              </label>
              {newFiles.length > 0 && (
                <div className="space-y-1">
                  {newFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded px-2 py-1">
                      <FileText className="w-3 h-3 shrink-0" />
                      <span className="truncate flex-1">{f.name}</span>
                      <button type="button" className="text-destructive hover:text-destructive/80" onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button className="w-full" onClick={handleAddContract}>
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contract Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.edit_contract}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingContract && (
              <div className="text-sm text-muted-foreground">
                {mockTenants.find(tn => tn.id === editingContract.tenant_id)?.full_name}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t.start_date}</Label>
                <Input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.end_date}</Label>
                <Input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} />
              </div>
            </div>
            <Button className="w-full" onClick={handleEditContract}>
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractsPage;
