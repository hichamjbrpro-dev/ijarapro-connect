import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState = ({ title, subtitle, actionLabel, onAction, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-6">
        {icon || (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mb-6 max-w-sm">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary-light text-primary-foreground">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
