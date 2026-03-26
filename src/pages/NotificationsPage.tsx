import { useState, useMemo } from 'react';
import { AlertCircle, Clock, CheckCircle, Bell as BellIcon, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotifications } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/types';

const iconMap: Record<Notification['type'], { icon: React.ElementType; color: string }> = {
  overdue: { icon: AlertCircle, color: 'text-destructive bg-destructive/10' },
  contract_expiring: { icon: Clock, color: 'text-warning bg-warning/10' },
  payment_received: { icon: CheckCircle, color: 'text-success bg-success/10' },
  rent_due: { icon: BellIcon, color: 'text-primary bg-primary/10' },
};

type FilterType = 'all' | Notification['type'];

const NotificationsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: t.notif_all, icon: BellIcon },
    { key: 'overdue', label: t.notif_overdue, icon: AlertCircle },
    { key: 'contract_expiring', label: t.notif_contract_expiring, icon: Clock },
    { key: 'payment_received', label: t.notif_payment_received, icon: CheckCircle },
    { key: 'rent_due', label: t.notif_rent_due, icon: BellIcon },
  ];

  const filtered = useMemo(() => {
    const list = activeFilter === 'all' ? notifications : notifications.filter((n) => n.type === activeFilter);
    return [...list].sort((a, b) => {
      if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [notifications, activeFilter]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notifications.length };
    notifications.forEach((n) => { counts[n.type] = (counts[n.type] || 0) + 1; });
    return counts;
  }, [notifications]);

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const deleteNotif = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const deleteAllRead = async () => {
    const readIds = notifications.filter(n => n.is_read).map(n => n.id);
    if (readIds.length === 0) return;
    await supabase.from('notifications').delete().in('id', readIds);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const getRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return t.notif_time_now;
    if (minutes < 60) return t.notif_time_minutes(minutes);
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t.notif_time_hours(hours);
    const days = Math.floor(hours / 24);
    return t.notif_time_days(days);
  };

  if (isLoading) return <div className="animate-fade-in p-8 text-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="animate-fade-in">
      <PageHeader title={t.notifications_title} subtitle={t.unread_count(unreadCount)}>
        <div className="flex items-center gap-2">
          {notifications.some((n) => n.is_read) && (
            <Button variant="ghost" size="sm" onClick={deleteAllRead} className="text-muted-foreground text-xs gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />{t.notif_delete_all_read}
            </Button>
          )}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>{t.mark_all_read}</Button>
          )}
        </div>
      </PageHeader>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          const count = filterCounts[f.key] || 0;
          return (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}>
              <f.icon className="w-3.5 h-3.5" />{f.label}
              <span className={`text-[10px] font-latin ${isActive ? 'opacity-80' : 'opacity-60'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.notif_empty} subtitle={t.notif_empty_subtitle} />
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = iconMap[notif.type];
            const Icon = config.icon;
            return (
              <div key={notif.id} className={`group bg-card rounded-lg p-4 border border-border flex items-start gap-3 transition-all hover:shadow-sm ${!notif.is_read ? 'border-r-4 border-r-primary shadow-card' : 'opacity-75'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.color}`}><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!notif.is_read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{notif.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-latin">{getRelativeTime(notif.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.is_read && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => markRead(notif.id)} title={t.done}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteNotif(notif.id)} title={t.notif_delete}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
