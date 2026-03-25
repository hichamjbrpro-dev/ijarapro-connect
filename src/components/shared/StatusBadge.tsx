import { useUIStore } from '@/store/uiStore';
import { useTranslation } from '@/hooks/useTranslation';
import { PaymentStatus, UnitStatus } from '@/types';

interface StatusBadgeProps {
  status: PaymentStatus | UnitStatus;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  paid: { bg: 'bg-success/15', text: 'text-success' },
  occupied: { bg: 'bg-success/15', text: 'text-success' },
  unpaid: { bg: 'bg-destructive/15', text: 'text-destructive' },
  vacant: { bg: 'bg-destructive/15', text: 'text-destructive' },
  partial: { bg: 'bg-warning/15', text: 'text-warning' },
  maintenance: { bg: 'bg-warning/15', text: 'text-warning' },
};

const statusKeyMap: Record<string, string> = {
  paid: 'status_paid',
  unpaid: 'status_unpaid',
  partial: 'status_partial',
  occupied: 'status_occupied',
  vacant: 'status_vacant',
  maintenance: 'status_maintenance',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();
  const colors = colorMap[status] || { bg: 'bg-muted', text: 'text-muted-foreground' };
  const key = statusKeyMap[status];
  const label = key ? (t as any)[key] : status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
