import { Decision, DecisionStatus } from '@/types/project';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ArrowRight, Clock } from 'lucide-react';

interface DecisionCardProps {
  decision: Decision;
  compact?: boolean;
  onClick?: () => void;
}

const statusConfig: Record<DecisionStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/30' },
  approved: { label: 'Approved', className: 'bg-success/10 text-success border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  revision_needed: { label: 'Needs Revision', className: 'bg-info/10 text-info border-info/30' },
};

function getDaysUntilDeadline(deadline: string): { days: number; isOverdue: boolean } {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { days: Math.abs(diffDays), isOverdue: diffDays < 0 };
}

export function DecisionCard({ decision, compact, onClick }: DecisionCardProps) {
  const status = statusConfig[decision.status];
  const deadline = getDaysUntilDeadline(decision.deadline);

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-soft cursor-pointer transition-all duration-200"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{decision.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className={cn('text-xs', status.className)}>
              {status.label}
            </Badge>
            <span
              className={cn(
                'text-xs flex items-center gap-1',
                deadline.isOverdue ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              <Clock className="h-3 w-3" />
              {deadline.isOverdue ? `${deadline.days}d overdue` : `${deadline.days}d left`}
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="card-interactive p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground">{decision.title}</h3>
        <Badge variant="outline" className={cn('ml-3', status.className)}>
          {status.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {decision.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span className={deadline.isOverdue ? 'text-destructive font-medium' : ''}>
            {deadline.isOverdue ? `${deadline.days}d overdue` : `Due in ${deadline.days}d`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>{decision.responsibleUsers.length} responsible</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex -space-x-2">
          {decision.responsibleUsers.slice(0, 4).map((user) => (
            <Avatar key={user.id} className="h-7 w-7 border-2 border-card">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        {decision.status === 'pending' && (
          <Button size="sm" variant="outline" className="text-xs">
            Review
          </Button>
        )}
      </div>
    </div>
  );
}
