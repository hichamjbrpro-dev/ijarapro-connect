import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, CreditCard, Bell } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'الرئيسية', path: '/' },
  { icon: Building2, label: 'العقارات', path: '/properties' },
  { icon: Users, label: 'المستأجرون', path: '/tenants' },
  { icon: CreditCard, label: 'المدفوعات', path: '/payments' },
  { icon: Bell, label: 'التنبيهات', path: '/notifications' },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around md:hidden z-50">
      {items.map((item) => {
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
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
