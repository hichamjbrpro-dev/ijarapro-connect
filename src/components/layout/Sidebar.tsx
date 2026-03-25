import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, CreditCard, FileText, Bell,
  LogOut, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { mockNotifications } from '@/data/mockData';

const navItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/' },
  { icon: Building2, label: 'العقارات', path: '/properties' },
  { icon: Users, label: 'المستأجرون', path: '/tenants' },
  { icon: CreditCard, label: 'المدفوعات', path: '/payments' },
  { icon: FileText, label: 'العقود', path: '/contracts' },
  { icon: Bell, label: 'التنبيهات', path: '/notifications' },
];

const AppSidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const unreadCount = mockNotifications.filter((n) => !n.is_read).length;

  return (
    <aside
      className={`fixed top-0 right-0 h-full bg-card border-l border-border z-40 flex flex-col transition-all duration-200 ${
        sidebarOpen ? 'w-60' : 'w-16'
      } hidden md:flex`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">
            <span className="text-primary">إيجارا</span>
            <span className="text-accent font-latin"> Pro</span>
          </h1>
        ) : (
          <span className="text-xl font-bold text-accent font-latin">P</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 relative ${
                isActive
                  ? 'bg-primary-50 text-primary border-r-[3px] border-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {item.path === '/notifications' && unreadCount > 0 && (
                <span className="absolute left-3 top-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-latin">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-border p-3">
        {sidebarOpen && user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate font-latin">{user.email}</p>
            </div>
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
