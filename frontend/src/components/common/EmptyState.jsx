import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no items matching your criteria at this time.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-10 text-center max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
