import { Task, TaskStatus, TaskPriority } from '@/types/project';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, Flag, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskListProps {
  tasks: Task[];
  onTaskToggle?: (taskId: string) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  not_started: { label: 'לא התחיל', className: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'בביצוע', className: 'bg-info/10 text-info' },
  completed: { label: 'הושלם', className: 'bg-success/10 text-success' },
  blocked: { label: 'חסום', className: 'bg-destructive/10 text-destructive' },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'נמוכה', className: 'text-muted-foreground' },
  medium: { label: 'בינונית', className: 'text-info' },
  high: { label: 'גבוהה', className: 'text-warning' },
  urgent: { label: 'דחוף', className: 'text-destructive' },
};

export function TaskList({ tasks, onTaskToggle, onTaskEdit, onTaskDelete }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-2">
      {sortedTasks.map((task, index) => {
        const isCompleted = task.status === 'completed';
        const priority = priorityConfig[task.priority];
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && !isCompleted;

        return (
          <div
            key={task.id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-200 animate-fade-in group',
              isCompleted && 'opacity-60'
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onTaskToggle?.(task.id)}
              className="h-5 w-5"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    'font-medium text-foreground truncate',
                    isCompleted && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </p>
                <Flag className={cn('h-3.5 w-3.5 flex-shrink-0', priority.className)} />
              </div>
              
              <div className="flex items-center gap-3 mt-1.5">
                <Badge
                  variant="secondary"
                  className={cn('text-xs', statusConfig[task.status].className)}
                >
                  {statusConfig[task.status].label}
                </Badge>
                
                {dueDate && (
                  <span
                    className={cn(
                      'text-xs flex items-center gap-1',
                      isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    {dueDate.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {task.assignee && (
              <Avatar className="h-8 w-8 border-2 border-card flex-shrink-0">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                  {task.assignee.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}

            {(onTaskEdit || onTaskDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onTaskEdit && (
                    <DropdownMenuItem onClick={() => onTaskEdit(task)}>
                      <Edit2 className="h-4 w-4 ml-2" />
                      ערוך
                    </DropdownMenuItem>
                  )}
                  {onTaskDelete && (
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onTaskDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      מחק
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Flag className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">אין משימות עדיין</p>
          <p className="text-sm text-muted-foreground/70 mt-1">צור את המשימה הראשונה שלך כדי להתחיל</p>
        </div>
      )}
    </div>
  );
}
