import { Bell, Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { mockNotifications } from '@/data/mockData';

const TopBar = () => {
  const { toggleSidebar, language, setLanguage } = useUIStore();
  const { user } = useAuthStore();
  const unreadCount = mockNotifications.filter((n) => !n.is_read).length;

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <button onClick={toggleSidebar} className="md:hidden text-foreground">
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-4 mr-auto relative z-10">
        {/* Language toggle */}
        <div className="flex items-center bg-muted rounded-full p-0.5 text-xs">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLanguage('ar'); }}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer select-none ${
              language === 'ar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            AR
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLanguage('fr'); }}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer select-none ${
              language === 'fr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            FR
          </button>
        </div>

        {/* Notification bell */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-latin">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        {user && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {(user.user_metadata?.full_name || user.email || '?').charAt(0)}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
