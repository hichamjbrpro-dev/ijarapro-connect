import { useState } from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { mockProperties } from '@/data/mockData';
import { formatCurrency, propertyTypeLabel } from '@/utils/formatters';
import { Property } from '@/types';

const cities = ['تطوان', 'الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'فاس', 'أكادير', 'مكناس', 'وجدة'];

const PropertyCard = ({ property }: { property: Property }) => {
  const occupancy = property.units_count ? ((property.occupied_count || 0) / property.units_count) * 100 : 0;

  return (
    <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden hover:shadow-elevated transition-shadow duration-150">
      <div className="h-36 bg-primary-50 flex items-center justify-center">
        <Building2 className="w-12 h-12 text-primary/40" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground">{property.name}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary font-medium">
            {propertyTypeLabel[property.type]}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span>{property.city}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span>{property.units_count} وحدة</span>
          <span>•</span>
          <span>{property.occupied_count} مشغولة</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-success rounded-full"
            style={{ width: `${occupancy}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          نسبة الإشغال: <span className="font-latin">{occupancy.toFixed(0)}%</span>
        </p>
      </div>
    </div>
  );
};

const PropertiesPage = () => {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = filterCity === 'all'
    ? mockProperties
    : mockProperties.filter((p) => p.city === filterCity);

  return (
    <div className="animate-fade-in">
      <PageHeader title="العقارات" subtitle={`${mockProperties.length} عقار`}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عقار
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة عقار جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="اسم العقار" className="h-10 text-right" />
              <Select>
                <SelectTrigger className="h-10"><SelectValue placeholder="نوع العقار" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(propertyTypeLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-10"><SelectValue placeholder="المدينة" /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="العنوان" className="h-10 text-right" />
              <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground" onClick={() => setDialogOpen(false)}>
                حفظ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filter */}
      <div className="mb-6">
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-48 h-10">
            <SelectValue placeholder="جميع المدن" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="أضف عقارك الأول"
          subtitle="ابدأ بإضافة عقاراتك لإدارتها بكل سهولة"
          actionLabel="إضافة عقار"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
