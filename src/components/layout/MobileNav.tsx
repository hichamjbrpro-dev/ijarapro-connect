import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, CreditCard, Bell } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const navKeys = [
  { icon: LayoutDashboard, key: 'nav_dashboard' as const, path: '/' },
  { icon: Building2, key: 'nav_properties' as const, path: '/properties' },
  { icon: Users, key: 'nav_tenants' as const, path: '/tenants' },
  { icon: CreditCard, key: 'nav_payments' as const, path: '/payments' },
  { icon: Bell, key: 'nav_notifications' as const, path: '/notifications' },
];

const MobileNav = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around md:hidden z-50">
      {navKeys.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 text-[10px] min-w-[56px] py-1 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{t[item.key]}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
