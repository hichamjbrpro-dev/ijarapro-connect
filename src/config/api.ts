const BASE = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export const API = {
  auth: {
    login: `${BASE}/auth/login`,
    register: `${BASE}/auth/register`,
    logout: `${BASE}/auth/logout`,
  },
  properties: `${BASE}/properties`,
  units: `${BASE}/units`,
  tenants: `${BASE}/tenants`,
  payments: `${BASE}/payments`,
  contracts: `${BASE}/contracts`,
  notifications: `${BASE}/notifications`,
  receipts: `${BASE}/receipts`,
};

export const fetchAPI = async (
  url: string,
  options: RequestInit = {},
  token?: string
) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
