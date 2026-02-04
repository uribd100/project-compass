import { Project } from '@/types/project';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, TrendingUp } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-success/10 text-success border-success/30',
    on_hold: 'bg-warning/10 text-warning border-warning/30',
    completed: 'bg-muted text-muted-foreground border-border',
  };

  const budgetPercentage = (project.budget.actual / project.budget.planned) * 100;
  const isOverBudget = budgetPercentage > 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div
      onClick={onClick}
      className="card-interactive p-6 cursor-pointer animate-fade-in group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn('ml-3 capitalize flex-shrink-0', statusColors[project.status])}
        >
          {project.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      {/* Budget */}
      <div className="flex items-center justify-between text-sm mb-4 p-3 rounded-lg bg-muted/50">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Budget</p>
          <p className="font-medium text-foreground">
            {formatCurrency(project.budget.actual)} / {formatCurrency(project.budget.planned)}
          </p>
        </div>
        <div className={cn('flex items-center gap-1', isOverBudget ? 'text-destructive' : 'text-success')}>
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">{budgetPercentage.toFixed(0)}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-card">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {project.team.length > 3 && (
            <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
