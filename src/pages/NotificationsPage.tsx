import { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, Bell as BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { mockNotifications } from '@/data/mockData';
import type { Notification } from '@/types';

const iconMap: Record<Notification['type'], { icon: React.ElementType; color: string }> = {
  overdue: { icon: AlertCircle, color: 'text-destructive bg-destructive/15' },
  contract_expiring: { icon: Clock, color: 'text-warning bg-warning/15' },
  payment_received: { icon: CheckCircle, color: 'text-success bg-success/15' },
  rent_due: { icon: BellIcon, color: 'text-primary bg-primary-50' },
};

const NotificationsPage = () => {
  const { t, locale } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.notifications_title} subtitle={t.unread_count(unreadCount)}>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            {t.mark_all_read}
          </Button>
        )}
      </PageHeader>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const config = iconMap[notif.type];
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              className={`bg-card rounded-lg p-4 shadow-card border border-border flex items-start gap-4 transition-colors ${
                !notif.is_read ? 'border-r-4 border-r-primary' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${!notif.is_read ? 'font-semibold' : ''}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-latin">
                  {new Date(notif.created_at).toLocaleDateString(locale, {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              {!notif.is_read && (
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground shrink-0" onClick={() => markRead(notif.id)}>
                  {t.done}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
