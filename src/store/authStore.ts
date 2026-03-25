import { create } from 'zustand';

interface AuthState {
  user: { id: string; email: string; name: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: { id: string; email: string; name: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: '1', email: 'demo@ijarapro.ma', name: 'أحمد بنعلي' },
  token: 'demo-token',
  isAuthenticated: true,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
