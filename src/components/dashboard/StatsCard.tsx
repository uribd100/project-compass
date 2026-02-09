import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'accent';
}
export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default'
}: StatsCardProps) {
  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent'
  };
  const TrendIcon = trend ? trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus : null;
  return <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium border-primary text-primary bg-primary">{title}</p>
          <p className="text-2xl font-bold mt-2 text-cyan-400 bg-green-100">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          {trend && TrendIcon && <div className="flex items-center gap-1.5 mt-3">
              <TrendIcon className={cn('h-4 w-4', trend.value > 0 ? 'text-success' : trend.value < 0 ? 'text-destructive' : 'text-muted-foreground')} />
              <span className={cn('text-sm font-medium', trend.value > 0 ? 'text-success' : trend.value < 0 ? 'text-destructive' : 'text-muted-foreground')}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground">{trend.label}</span>
            </div>}
        </div>
        <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', iconVariants[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>;
}