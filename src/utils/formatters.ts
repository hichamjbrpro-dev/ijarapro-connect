export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-MA')} د.م`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatMonth = (month: string): string => {
  const [year, m] = month.split('-');
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long' });
};

export const propertyTypeLabel: Record<string, string> = {
  apartment_building: 'عمارة سكنية',
  house: 'منزل',
  shop: 'محل تجاري',
  floor: 'طابق',
};

export const unitTypeLabel: Record<string, string> = {
  apartment: 'شقة',
  shop: 'محل',
  studio: 'ستوديو',
  floor: 'طابق',
};

export const statusLabel: Record<string, string> = {
  paid: 'مدفوع',
  unpaid: 'متأخر',
  partial: 'جزئي',
  occupied: 'مشغولة',
  vacant: 'فارغة',
  maintenance: 'صيانة',
};
