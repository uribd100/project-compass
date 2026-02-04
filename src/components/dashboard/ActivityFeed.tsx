import { Activity, ActivityType } from '@/types/project';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  FileUp,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Flag,
  Clock,
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const activityIcons: Record<ActivityType, typeof MessageSquare> = {
  message: MessageSquare,
  decision: AlertCircle,
  approval: CheckCircle2,
  file_upload: FileUp,
  task_update: Flag,
  budget_change: DollarSign,
  milestone: Flag,
};

const activityColors: Record<ActivityType, string> = {
  message: 'bg-info/10 text-info',
  decision: 'bg-warning/10 text-warning',
  approval: 'bg-success/10 text-success',
  file_upload: 'bg-primary/10 text-primary',
  task_update: 'bg-accent/10 text-accent',
  budget_change: 'bg-destructive/10 text-destructive',
  milestone: 'bg-accent/10 text-accent',
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ActivityFeed({ activities, maxItems }: ActivityFeedProps) {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className="space-y-4">
      {displayedActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        return (
          <div
            key={activity.id}
            className="flex gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-soft transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon */}
            <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', activityColors[activity.type])}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>

              {/* Attachments preview */}
              {activity.attachments && activity.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activity.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg text-sm"
                    >
                      <FileUp className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground truncate max-w-[150px]">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback className="text-[10px] bg-accent text-accent-foreground">
                      {activity.user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{activity.user.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {displayedActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No activities yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Activities will appear here as your team works</p>
        </div>
      )}
    </div>
  );
}
