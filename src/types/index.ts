export type PropertyType = 'apartment_building' | 'house' | 'shop' | 'floor';
export type UnitStatus = 'occupied' | 'vacant' | 'maintenance';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  type: PropertyType;
  city: string;
  address: string;
  photo_url?: string;
  units_count?: number;
  occupied_count?: number;
  created_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  floor?: number;
  area_sqm?: number;
  monthly_rent: number;
  type: 'apartment' | 'shop' | 'studio' | 'floor';
  status: UnitStatus;
  tenant?: Tenant;
}

export interface Tenant {
  id: string;
  owner_id: string;
  unit_id: string;
  full_name: string;
  cin: string;
  phone: string;
  email?: string;
  move_in_date: string;
}

export interface Payment {
  id: string;
  unit_id: string;
  tenant_id: string;
  month: string;
  amount_due: number;
  amount_paid: number;
  status: PaymentStatus;
  payment_date?: string;
  receipt_sent: boolean;
}

export interface Contract {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date: string;
  file_url?: string;
  days_remaining?: number;
}

export interface Notification {
  id: string;
  owner_id: string;
  type: 'rent_due' | 'overdue' | 'contract_expiring' | 'payment_received';
  message: string;
  message_fr?: string;
  is_read: boolean;
  created_at: string;
}
