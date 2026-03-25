import { PaymentStatus, UnitStatus } from '@/types';
import { statusLabel } from '@/utils/formatters';

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

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colors = colorMap[status] || { bg: 'bg-muted', text: 'text-muted-foreground' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {statusLabel[status] || status}
    </span>
  );
};

export default StatusBadge;
