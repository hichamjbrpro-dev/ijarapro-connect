import { Property, Tenant, Payment, Contract, Notification, Unit } from '@/types';

export const mockProperties: Property[] = [
  {
    id: 'p1', owner_id: '1', name: 'إقامة يسرى', type: 'apartment_building',
    city: 'تطوان', address: 'شارع زيو - عبد الله الشفشاوني، خندق الزربوح',
    units_count: 3, occupied_count: 3, created_at: '2024-01-01',
  },
  {
    id: 'p2', owner_id: '1', name: 'الدكاكين - قيصارية إقامة أمل', type: 'shop',
    city: 'تطوان', address: 'شارع عبد الله الشفشاوني، خندق الزربوح',
    units_count: 11, occupied_count: 11, created_at: '2024-01-01',
  },
  {
    id: 'p3', owner_id: '1', name: 'عمارة السيد الطاهري 03', type: 'apartment_building',
    city: 'تطوان', address: 'حرف B، شارع عبد الله الشفشاوني',
    units_count: 8, occupied_count: 8, created_at: '2024-01-01',
  },
  {
    id: 'p4', owner_id: '1', name: 'إقامة أمل A', type: 'apartment_building',
    city: 'تطوان', address: 'شارع عبد الله الشفشاوني، خندق الزربوح',
    units_count: 20, occupied_count: 20, created_at: '2024-01-01',
  },
  {
    id: 'p5', owner_id: '1', name: 'عمارة القاضي عياض', type: 'apartment_building',
    city: 'تطوان', address: 'شارع خالد بن الواليد',
    units_count: 8, occupied_count: 8, created_at: '2024-01-01',
  },
  {
    id: 'p6', owner_id: '1', name: 'مسجد السنة', type: 'shop',
    city: 'تطوان', address: 'طريق طنجة كلم 05',
    units_count: 7, occupied_count: 7, created_at: '2024-01-01',
  },
];

export const mockUnits: Unit[] = [
  // إقامة يسرى
  { id: 'u1', property_id: 'p1', unit_number: 'مراب', monthly_rent: 4500, type: 'shop', status: 'occupied' },
  { id: 'u2', property_id: 'p1', unit_number: 'متجر 1', monthly_rent: 4000, type: 'shop', status: 'occupied' },
  { id: 'u3', property_id: 'p1', unit_number: 'متجر 2', monthly_rent: 3500, type: 'shop', status: 'occupied' },

  // الدكاكين - قيصارية إقامة أمل
  { id: 'u4', property_id: 'p2', unit_number: '2', monthly_rent: 700, type: 'shop', status: 'occupied' },
  { id: 'u5', property_id: 'p2', unit_number: '3', monthly_rent: 700, type: 'shop', status: 'occupied' },
  { id: 'u6', property_id: 'p2', unit_number: '4', monthly_rent: 600, type: 'shop', status: 'occupied' },
  { id: 'u7', property_id: 'p2', unit_number: '5', monthly_rent: 500, type: 'shop', status: 'occupied' },
  { id: 'u8', property_id: 'p2', unit_number: '6', monthly_rent: 700, type: 'shop', status: 'occupied' },
  { id: 'u9', property_id: 'p2', unit_number: '7', monthly_rent: 500, type: 'shop', status: 'occupied' },
  { id: 'u10', property_id: 'p2', unit_number: '8', monthly_rent: 700, type: 'shop', status: 'occupied' },
  { id: 'u11', property_id: 'p2', unit_number: '9', monthly_rent: 600, type: 'shop', status: 'occupied' },
  { id: 'u12', property_id: 'p2', unit_number: '10', monthly_rent: 1200, type: 'shop', status: 'occupied' },
  { id: 'u13', property_id: 'p2', unit_number: 'دكان', monthly_rent: 700, type: 'shop', status: 'occupied' },
  { id: 'u14', property_id: 'p2', unit_number: 'المتجر الكبير', monthly_rent: 3800, type: 'shop', status: 'occupied' },

  // عمارة السيد الطاهري 03
  { id: 'u15', property_id: 'p3', unit_number: '2', floor: 1, monthly_rent: 1200, type: 'apartment', status: 'occupied' },
  { id: 'u16', property_id: 'p3', unit_number: '3', floor: 2, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u17', property_id: 'p3', unit_number: '4', floor: 2, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u18', property_id: 'p3', unit_number: '5', floor: 3, monthly_rent: 1600, type: 'apartment', status: 'occupied' },
  { id: 'u19', property_id: 'p3', unit_number: '6', floor: 3, monthly_rent: 1600, type: 'apartment', status: 'occupied' },
  { id: 'u20', property_id: 'p3', unit_number: '7', floor: 4, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u21', property_id: 'p3', unit_number: '8', floor: 4, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u22', property_id: 'p3', unit_number: '9', floor: 5, monthly_rent: 1300, type: 'apartment', status: 'occupied' },

  // إقامة أمل A
  { id: 'u23', property_id: 'p4', unit_number: '1', floor: 1, monthly_rent: 1500, type: 'apartment', status: 'occupied' },
  { id: 'u24', property_id: 'p4', unit_number: '2', floor: 1, monthly_rent: 1000, type: 'apartment', status: 'occupied' },
  { id: 'u25', property_id: 'p4', unit_number: '3', floor: 1, monthly_rent: 1000, type: 'apartment', status: 'occupied' },
  { id: 'u26', property_id: 'p4', unit_number: '4', floor: 1, monthly_rent: 1500, type: 'apartment', status: 'occupied' },
  { id: 'u27', property_id: 'p4', unit_number: '6', floor: 1, monthly_rent: 1600, type: 'apartment', status: 'occupied' },
  { id: 'u28', property_id: 'p4', unit_number: '7', floor: 2, monthly_rent: 1600, type: 'apartment', status: 'occupied' },
  { id: 'u29', property_id: 'p4', unit_number: '8', floor: 2, monthly_rent: 1100, type: 'apartment', status: 'occupied' },
  { id: 'u30', property_id: 'p4', unit_number: '9', floor: 2, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u31', property_id: 'p4', unit_number: '11', floor: 2, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u32', property_id: 'p4', unit_number: '13', floor: 3, monthly_rent: 1400, type: 'apartment', status: 'occupied' },
  { id: 'u33', property_id: 'p4', unit_number: '15', floor: 3, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u34', property_id: 'p4', unit_number: '17', floor: 3, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u35', property_id: 'p4', unit_number: '19', floor: 4, monthly_rent: 1400, type: 'apartment', status: 'occupied' },
  { id: 'u36', property_id: 'p4', unit_number: '20', floor: 4, monthly_rent: 1100, type: 'apartment', status: 'occupied' },
  { id: 'u37', property_id: 'p4', unit_number: '21', floor: 4, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u38', property_id: 'p4', unit_number: '22', floor: 4, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u39', property_id: 'p4', unit_number: '23', floor: 4, monthly_rent: 1000, type: 'apartment', status: 'occupied' },
  { id: 'u40', property_id: 'p4', unit_number: '24', floor: 4, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u41', property_id: 'p4', unit_number: '25', floor: 5, monthly_rent: 1300, type: 'apartment', status: 'occupied' },
  { id: 'u42', property_id: 'p4', unit_number: '26', floor: 5, monthly_rent: 1000, type: 'apartment', status: 'occupied' },

  // عمارة القاضي عياض
  { id: 'u43', property_id: 'p5', unit_number: '1', floor: 1, monthly_rent: 840, type: 'apartment', status: 'occupied' },
  { id: 'u44', property_id: 'p5', unit_number: '8', floor: 2, monthly_rent: 865.10, type: 'apartment', status: 'occupied' },
  { id: 'u45', property_id: 'p5', unit_number: '9', floor: 3, monthly_rent: 800, type: 'apartment', status: 'occupied' },
  { id: 'u46', property_id: 'p5', unit_number: '12', floor: 3, monthly_rent: 605, type: 'apartment', status: 'occupied' },
  { id: 'u47', property_id: 'p5', unit_number: '16', floor: 4, monthly_rent: 784.08, type: 'apartment', status: 'occupied' },
  { id: 'u48', property_id: 'p5', unit_number: '17', floor: 5, monthly_rent: 1100, type: 'apartment', status: 'occupied' },
  { id: 'u49', property_id: 'p5', unit_number: '19', floor: 5, monthly_rent: 1500, type: 'apartment', status: 'occupied' },
  { id: 'u50', property_id: 'p5', unit_number: 'كراج طوكيو', monthly_rent: 3327.50, type: 'shop', status: 'occupied' },

  // مسجد السنة
  { id: 'u51', property_id: 'p6', unit_number: '1', monthly_rent: 600, type: 'shop', status: 'occupied' },
  { id: 'u52', property_id: 'p6', unit_number: '2', monthly_rent: 605, type: 'shop', status: 'occupied' },
  { id: 'u53', property_id: 'p6', unit_number: '8', monthly_rent: 550, type: 'shop', status: 'occupied' },
  { id: 'u54', property_id: 'p6', unit_number: '9', monthly_rent: 495, type: 'shop', status: 'occupied' },
  { id: 'u55', property_id: 'p6', unit_number: '10', monthly_rent: 605, type: 'shop', status: 'occupied' },
  { id: 'u56', property_id: 'p6', unit_number: '01-A', monthly_rent: 700, type: 'shop', status: 'occupied' },
  { id: 'u57', property_id: 'p6', unit_number: '05-06-07', monthly_rent: 2000, type: 'shop', status: 'occupied' },
];

export const mockTenants: Tenant[] = [
  // إقامة يسرى
  { id: 't1', owner_id: '1', unit_id: 'u1', full_name: 'زروق خالد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't2', owner_id: '1', unit_id: 'u2', full_name: 'السعدي محمد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't3', owner_id: '1', unit_id: 'u3', full_name: 'ازميزم عبد الخالق', cin: '', phone: '', move_in_date: '2024-01-01' },

  // الدكاكين
  { id: 't4', owner_id: '1', unit_id: 'u4', full_name: 'أخريف سعيد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't5', owner_id: '1', unit_id: 'u5', full_name: 'حمزة الراوي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't6', owner_id: '1', unit_id: 'u6', full_name: 'البراج مريم', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't7', owner_id: '1', unit_id: 'u7', full_name: 'فوزية الزجلي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't8', owner_id: '1', unit_id: 'u8', full_name: 'يسري البجاتي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't9', owner_id: '1', unit_id: 'u9', full_name: 'الشرقاوي حسناء', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't10', owner_id: '1', unit_id: 'u10', full_name: 'ابتسام ابن الأحمر', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't11', owner_id: '1', unit_id: 'u11', full_name: 'هشام الزرهوني', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't12', owner_id: '1', unit_id: 'u12', full_name: 'بن امغار بو شعيب', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't13', owner_id: '1', unit_id: 'u13', full_name: 'بولعيش حسن', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't14', owner_id: '1', unit_id: 'u14', full_name: 'المسعودي محمد', cin: '', phone: '', move_in_date: '2024-01-01' },

  // عمارة السيد الطاهري 03
  { id: 't15', owner_id: '1', unit_id: 'u15', full_name: 'بولعيش حسن', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't16', owner_id: '1', unit_id: 'u16', full_name: 'الغازي أحمد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't17', owner_id: '1', unit_id: 'u17', full_name: 'بوفلجة نبيل', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't18', owner_id: '1', unit_id: 'u18', full_name: 'البقالي محمد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't19', owner_id: '1', unit_id: 'u19', full_name: 'حفيظة صدقي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't20', owner_id: '1', unit_id: 'u20', full_name: 'نصيرة الخمليشي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't21', owner_id: '1', unit_id: 'u21', full_name: 'نور الدين العنابي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't22', owner_id: '1', unit_id: 'u22', full_name: 'سعيد مؤيد', cin: '', phone: '', move_in_date: '2024-01-01' },

  // إقامة أمل A
  { id: 't23', owner_id: '1', unit_id: 'u23', full_name: 'عيسى أسلداى', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't24', owner_id: '1', unit_id: 'u24', full_name: 'أمغار عبد المجيد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't25', owner_id: '1', unit_id: 'u25', full_name: 'الحمري مراد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't26', owner_id: '1', unit_id: 'u26', full_name: 'سعيد الجزولي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't27', owner_id: '1', unit_id: 'u27', full_name: 'المهم عبد اللطيف', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't28', owner_id: '1', unit_id: 'u28', full_name: 'محمد علي الجباري', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't29', owner_id: '1', unit_id: 'u29', full_name: 'محمد الصبحي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't30', owner_id: '1', unit_id: 'u30', full_name: 'كوثر حمصى', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't31', owner_id: '1', unit_id: 'u31', full_name: 'التاجر عبد السلام', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't32', owner_id: '1', unit_id: 'u32', full_name: 'صفاء العبدلاوى', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't33', owner_id: '1', unit_id: 'u33', full_name: 'عبد الغفور بودة', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't34', owner_id: '1', unit_id: 'u34', full_name: 'المصطفى حافة', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't35', owner_id: '1', unit_id: 'u35', full_name: 'حفيظة المزياني', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't36', owner_id: '1', unit_id: 'u36', full_name: 'حمزة يونيف', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't37', owner_id: '1', unit_id: 'u37', full_name: 'الهندا عبد الرحمان', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't38', owner_id: '1', unit_id: 'u38', full_name: 'العوني الدروسي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't39', owner_id: '1', unit_id: 'u39', full_name: 'عليوي المصطفى', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't40', owner_id: '1', unit_id: 'u40', full_name: 'أولاد مونا كريم', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't41', owner_id: '1', unit_id: 'u41', full_name: 'عبد الرحمان بنكروم', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't42', owner_id: '1', unit_id: 'u42', full_name: 'المنطقى رشيد', cin: '', phone: '', move_in_date: '2024-01-01' },

  // عمارة القاضي عياض
  { id: 't43', owner_id: '1', unit_id: 'u43', full_name: 'بنحمو الريفي عبد النبي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't44', owner_id: '1', unit_id: 'u44', full_name: 'شوبكى عمر', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't45', owner_id: '1', unit_id: 'u45', full_name: 'العزيزى محمد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't46', owner_id: '1', unit_id: 'u46', full_name: 'أحمد بن عياد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't47', owner_id: '1', unit_id: 'u47', full_name: 'بلكباش محمد', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't48', owner_id: '1', unit_id: 'u48', full_name: 'فريندى الطيب', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't49', owner_id: '1', unit_id: 'u49', full_name: 'معاد البقالي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't50', owner_id: '1', unit_id: 'u50', full_name: 'أو الحاج حسن', cin: '', phone: '', move_in_date: '2024-01-01' },

  // مسجد السنة
  { id: 't51', owner_id: '1', unit_id: 'u51', full_name: 'السيفر عبد اللطف', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't52', owner_id: '1', unit_id: 'u52', full_name: 'الحدوشي أشرف', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't53', owner_id: '1', unit_id: 'u53', full_name: 'الأنسة ايمان الخطابي', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't54', owner_id: '1', unit_id: 'u54', full_name: 'الخمال مصطفى', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't55', owner_id: '1', unit_id: 'u55', full_name: 'الخمال مصطفى', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't56', owner_id: '1', unit_id: 'u56', full_name: 'السيفر عبد اللطف', cin: '', phone: '', move_in_date: '2024-01-01' },
  { id: 't57', owner_id: '1', unit_id: 'u57', full_name: 'الأنسة ايمان الخطابي', cin: '', phone: '', move_in_date: '2024-01-01' },
];

// Generate payments for current month (March 2025) - all marked as unpaid initially
export const mockPayments: Payment[] = mockTenants.map((tenant, i) => {
  const unit = mockUnits.find(u => u.id === tenant.unit_id);
  return {
    id: `pay-${i + 1}`,
    unit_id: tenant.unit_id,
    tenant_id: tenant.id,
    month: '2026-03',
    amount_due: unit?.monthly_rent || 0,
    amount_paid: 0,
    status: 'unpaid' as const,
    receipt_sent: false,
  };
});

export const mockContracts: Contract[] = [
  { id: 'c1', tenant_id: 't1', unit_id: 'u1', start_date: '2024-01-01', end_date: '2026-12-31', days_remaining: 281, rent_amount: 3500 },
  { id: 'c2', tenant_id: 't2', unit_id: 'u2', start_date: '2024-01-01', end_date: '2026-06-30', days_remaining: 97, rent_amount: 2800 },
  { id: 'c3', tenant_id: 't3', unit_id: 'u3', start_date: '2023-06-01', end_date: '2026-05-31', days_remaining: 67, rent_amount: 4000 },
  { id: 'c4', tenant_id: 't4', unit_id: 'u4', start_date: '2024-03-01', end_date: '2027-02-28', days_remaining: 340, rent_amount: 5000 },
  { id: 'c5', tenant_id: 't5', unit_id: 'u5', start_date: '2024-01-01', end_date: '2026-04-15', days_remaining: 21, rent_amount: 3000 },
  { id: 'c6', tenant_id: 't12', unit_id: 'u12', start_date: '2023-01-01', end_date: '2026-03-01', days_remaining: -24, rent_amount: 2500 },
  { id: 'c7', tenant_id: 't14', unit_id: 'u14', start_date: '2024-06-01', end_date: '2027-05-31', days_remaining: 432, rent_amount: 6000 },
  { id: 'c8', tenant_id: 't15', unit_id: 'u15', start_date: '2024-01-01', end_date: '2026-12-31', days_remaining: 281, rent_amount: 3500 },
  { id: 'c9', tenant_id: 't23', unit_id: 'u23', start_date: '2024-01-01', end_date: '2026-03-31', days_remaining: 6, rent_amount: 4500 },
  { id: 'c10', tenant_id: 't43', unit_id: 'u43', start_date: '2023-06-01', end_date: '2026-02-28', days_remaining: -25, rent_amount: 3200 },
  { id: 'c11', tenant_id: 't50', unit_id: 'u50', start_date: '2024-01-01', end_date: '2027-01-01', days_remaining: 282, rent_amount: 5500 },
  { id: 'c12', tenant_id: 't51', unit_id: 'u51', start_date: '2024-06-01', end_date: '2026-08-31', days_remaining: 159, rent_amount: 2000 },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', owner_id: '1', type: 'rent_due', message: 'تذكير: موعد تحصيل إيجارات شهر مارس 2026', is_read: false, created_at: '2026-03-01T08:00:00' },
  { id: 'n2', owner_id: '1', type: 'overdue', message: 'لديك 57 إيجار غير محصّل هذا الشهر', is_read: false, created_at: '2026-03-25T10:00:00' },
];

export const mockMonthlyIncome = [
  { month: 'أكتوبر', income: 82947 },
  { month: 'نوفمبر', income: 82947 },
  { month: 'ديسمبر', income: 80000 },
  { month: 'يناير', income: 82947 },
  { month: 'فبراير', income: 82947 },
  { month: 'مارس', income: 0 },
];
