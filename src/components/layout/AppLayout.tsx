import { Outlet } from 'react-router-dom';
import AppSidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useUIStore } from '@/store/uiStore';

const AppLayout = () => {
  const { sidebarOpen, language } = useUIStore();

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AppSidebar />
      <div
        className={`transition-all duration-200 ${
          sidebarOpen ? 'md:mr-60' : 'md:mr-16'
        }`}
      >
        <TopBar />
        <main className="p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AppLayout;
