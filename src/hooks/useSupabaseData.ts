import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property, Unit, Tenant, Payment, Contract, Notification } from '@/types';

export const useProperties = () =>
  useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*').order('created_at');
      if (error) throw error;
      return data as Property[];
    },
  });

export const useUnits = () =>
  useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase.from('units').select('*').order('created_at');
      if (error) throw error;
      return data as Unit[];
    },
  });

export const useTenants = () =>
  useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*').order('created_at');
      if (error) throw error;
      return data as Tenant[];
    },
  });

export const usePayments = () =>
  useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*').order('created_at');
      if (error) throw error;
      return data as Payment[];
    },
  });

export const useContracts = () =>
  useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contracts').select('*').order('created_at');
      if (error) throw error;
      return (data || []).map(c => ({
        ...c,
        days_remaining: Math.ceil((new Date(c.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      })) as Contract[];
    },
  });

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Notification[];
    },
  });

export const useMonthlyIncome = () =>
  useQuery({
    queryKey: ['monthly-income'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('month, amount_paid, status');
      if (error) throw error;
      const monthMap = new Map<string, number>();
      (data || []).forEach(p => {
        if (p.status !== 'unpaid') {
          const current = monthMap.get(p.month) || 0;
          monthMap.set(p.month, current + Number(p.amount_paid));
        }
      });
      const months = [...monthMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, income]) => ({ month, income }));
      return months;
    },
  });
