import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  language: 'ar' | 'fr';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: 'ar' | 'fr') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  language: 'ar',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLanguage: (language) => set({ language }),
}));
