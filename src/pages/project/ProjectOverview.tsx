import { useOutletContext } from 'react-router-dom';
import { Project } from '@/types/project';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { TaskList } from '@/components/dashboard/TaskList';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { CheckSquare, DollarSign, Clock, Users } from 'lucide-react';

export default function ProjectOverview() {
  const { project } = useOutletContext<{ project: Project }>();
  const { 
    getProjectTasks, 
    getProjectActivities, 
    getProjectDecisions,
    toggleTaskStatus 
  } = useProjectData();
  
  const projectTasks = getProjectTasks(project.id);
  const projectDecisions = getProjectDecisions(project.id);
  const projectActivities = getProjectActivities(project.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const openTasksCount = projectTasks.filter(t => t.status !== 'completed').length;
  const completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;
  const pendingDecisionsCount = projectDecisions.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="התקדמות"
          value={`${project.progress}%`}
          subtitle={`${completedTasksCount}/${projectTasks.length} משימות הושלמו`}
          icon={CheckSquare}
          variant="primary"
        />
        <StatsCard
          title="תקציב"
          value={formatCurrency(project.budget.actual)}
          subtitle={`מתוך ${formatCurrency(project.budget.planned)}`}
          icon={DollarSign}
          variant="accent"
        />
        <StatsCard
          title="משימות פתוחות"
          value={openTasksCount}
          subtitle={`${pendingDecisionsCount} החלטות ממתינות`}
          icon={Clock}
        />
        <StatsCard
          title="חברי צוות"
          value={project.team.length}
          subtitle="משתתפים בפרויקט"
          icon={Users}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">פעילות אחרונה</h3>
          <ActivityFeed 
            activities={projectActivities.length > 0 ? projectActivities : []} 
            maxItems={5} 
          />
          {projectActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border/50">
              אין פעילות עדיין בפרויקט זה
            </div>
          )}
        </div>

        {/* Decisions & Tasks */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">החלטות ממתינות</h3>
            <div className="space-y-3">
              {projectDecisions
                .filter(d => d.status === 'pending')
                .slice(0, 2)
                .map((decision) => (
                  <DecisionCard key={decision.id} decision={decision} compact />
                ))}
              {projectDecisions.filter(d => d.status === 'pending').length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground bg-card rounded-xl border border-border/50">
                  אין החלטות ממתינות
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">משימות קרובות</h3>
            <TaskList 
              tasks={projectTasks.filter(t => t.status !== 'completed').slice(0, 3)} 
              onTaskToggle={toggleTaskStatus}
            />
            {projectTasks.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground bg-card rounded-xl border border-border/50">
                אין משימות בפרויקט זה
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
