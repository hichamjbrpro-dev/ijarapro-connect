import { Property, Tenant, Payment, Contract, Notification, Unit } from '@/types';

export const mockProperties: Property[] = [
  {
    id: '1', owner_id: '1', name: 'إقامة النخيل', type: 'apartment_building',
    city: 'الدار البيضاء', address: 'شارع محمد الخامس، رقم 45',
    units_count: 12, occupied_count: 10, created_at: '2024-01-15',
  },
  {
    id: '2', owner_id: '1', name: 'فيلا الياسمين', type: 'house',
    city: 'الرباط', address: 'حي الرياض، زنقة 12',
    units_count: 1, occupied_count: 1, created_at: '2024-03-20',
  },
  {
    id: '3', owner_id: '1', name: 'محلات السلام', type: 'shop',
    city: 'مراكش', address: 'المدينة القديمة، درب 7',
    units_count: 6, occupied_count: 4, created_at: '2024-06-10',
  },
  {
    id: '4', owner_id: '1', name: 'عمارة الأمل', type: 'apartment_building',
    city: 'طنجة', address: 'شارع الحرية، رقم 22',
    units_count: 8, occupied_count: 5, created_at: '2024-08-01',
  },
];

export const mockUnits: Unit[] = [
  { id: 'u1', property_id: '1', unit_number: 'A1', floor: 1, area_sqm: 85, monthly_rent: 3500, type: 'apartment', status: 'occupied' },
  { id: 'u2', property_id: '1', unit_number: 'A2', floor: 1, area_sqm: 90, monthly_rent: 3800, type: 'apartment', status: 'occupied' },
  { id: 'u3', property_id: '1', unit_number: 'B1', floor: 2, area_sqm: 75, monthly_rent: 3200, type: 'apartment', status: 'vacant' },
  { id: 'u4', property_id: '1', unit_number: 'B2', floor: 2, area_sqm: 80, monthly_rent: 3400, type: 'apartment', status: 'occupied' },
  { id: 'u5', property_id: '3', unit_number: 'M1', monthly_rent: 5000, type: 'shop', status: 'occupied' },
  { id: 'u6', property_id: '3', unit_number: 'M2', monthly_rent: 4500, type: 'shop', status: 'vacant' },
];

export const mockTenants: Tenant[] = [
  { id: 't1', owner_id: '1', unit_id: 'u1', full_name: 'محمد العلوي', cin: 'BK123456', phone: '+212661234567', move_in_date: '2024-02-01' },
  { id: 't2', owner_id: '1', unit_id: 'u2', full_name: 'فاطمة الزهراء', cin: 'BE789012', phone: '+212662345678', email: 'fatima@email.com', move_in_date: '2024-04-15' },
  { id: 't3', owner_id: '1', unit_id: 'u4', full_name: 'يوسف بنكيران', cin: 'BH345678', phone: '+212663456789', move_in_date: '2024-05-01' },
  { id: 't4', owner_id: '1', unit_id: 'u5', full_name: 'خالد المنصوري', cin: 'BA901234', phone: '+212664567890', move_in_date: '2024-07-01' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', unit_id: 'u1', tenant_id: 't1', month: '2025-03', amount_due: 3500, amount_paid: 3500, status: 'paid', payment_date: '2025-03-01', receipt_sent: true },
  { id: 'p2', unit_id: 'u2', tenant_id: 't2', month: '2025-03', amount_due: 3800, amount_paid: 0, status: 'unpaid', receipt_sent: false },
  { id: 'p3', unit_id: 'u4', tenant_id: 't3', month: '2025-03', amount_due: 3400, amount_paid: 2000, status: 'partial', payment_date: '2025-03-10', receipt_sent: false },
  { id: 'p4', unit_id: 'u5', tenant_id: 't4', month: '2025-03', amount_due: 5000, amount_paid: 5000, status: 'paid', payment_date: '2025-03-05', receipt_sent: true },
  { id: 'p5', unit_id: 'u1', tenant_id: 't1', month: '2025-02', amount_due: 3500, amount_paid: 3500, status: 'paid', payment_date: '2025-02-01', receipt_sent: true },
  { id: 'p6', unit_id: 'u2', tenant_id: 't2', month: '2025-02', amount_due: 3800, amount_paid: 3800, status: 'paid', payment_date: '2025-02-03', receipt_sent: true },
];

export const mockContracts: Contract[] = [
  { id: 'c1', tenant_id: 't1', unit_id: 'u1', start_date: '2024-02-01', end_date: '2025-02-01', days_remaining: -52 },
  { id: 'c2', tenant_id: 't2', unit_id: 'u2', start_date: '2024-04-15', end_date: '2025-04-15', days_remaining: 21 },
  { id: 'c3', tenant_id: 't3', unit_id: 'u4', start_date: '2024-05-01', end_date: '2026-05-01', days_remaining: 402 },
  { id: 'c4', tenant_id: 't4', unit_id: 'u5', start_date: '2024-07-01', end_date: '2025-12-31', days_remaining: 281 },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', owner_id: '1', type: 'overdue', message: 'إيجار فاطمة الزهراء (وحدة A2) متأخر منذ 25 يوم', is_read: false, created_at: '2025-03-25T10:00:00' },
  { id: 'n2', owner_id: '1', type: 'contract_expiring', message: 'عقد فاطمة الزهراء ينتهي خلال 21 يوم', is_read: false, created_at: '2025-03-24T09:00:00' },
  { id: 'n3', owner_id: '1', type: 'payment_received', message: 'تم استلام دفعة 5,000 د.م من خالد المنصوري', is_read: true, created_at: '2025-03-05T14:30:00' },
  { id: 'n4', owner_id: '1', type: 'rent_due', message: 'تذكير: موعد تحصيل إيجارات شهر أبريل يقترب', is_read: false, created_at: '2025-03-23T08:00:00' },
];

export const mockMonthlyIncome = [
  { month: 'أكتوبر', income: 42000 },
  { month: 'نوفمبر', income: 45000 },
  { month: 'ديسمبر', income: 38000 },
  { month: 'يناير', income: 48000 },
  { month: 'فبراير', income: 46500 },
  { month: 'مارس', income: 35700 },
];
