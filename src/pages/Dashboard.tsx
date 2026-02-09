import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { currentUser } from '@/data/mockData';
import { 
  Plus, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  DollarSign,
  ArrowLeft,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { 
    projects, 
    tasks, 
    activities, 
    decisions,
    stats,
    toggleTaskStatus 
  } = useProjectData();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingDecisions = decisions.filter(d => d.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <PageHeader 
          title={`בוקר טוב, ${currentUser.name.split(' ')[0]}`}
          subtitle="הנה מה שקורה בפרויקטים שלך היום."
          actions={
            <Button 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => setShowNewProjectModal(true)}
            >
              <Plus className="h-4 w-4" />
              פרויקט חדש
            </Button>
          }
        />

        <div className="px-6 lg:px-8 py-6 space-y-8">
          {/* Stats Overview - Computed from real data */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="פרויקטים פעילים"
              value={stats.activeProjectsCount}
              subtitle={`${projects.length} סה"כ`}
              icon={FolderKanban}
              variant="primary"
            />
            <StatsCard
              title="משימות בביצוע"
              value={inProgressTasks.length}
              subtitle={`${stats.tasksCompletionRate}% הושלמו`}
              icon={CheckSquare}
              variant="accent"
            />
            <StatsCard
              title="החלטות ממתינות"
              value={stats.pendingDecisionsCount}
              subtitle="ממתינות לאישור"
              icon={Clock}
            />
            <StatsCard
              title="ניצול תקציב"
              value={`${stats.budgetUtilization}%`}
              subtitle={`${formatCurrency(stats.totalBudgetActual)} מתוך ${formatCurrency(stats.totalBudgetPlanned)}`}
              icon={DollarSign}
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Projects & Activity - Takes 2 columns on XL */}
            <div className="xl:col-span-2 space-y-8">
              {/* Active Projects */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">פרויקטים פעילים</h2>
                  <Link to="/projects">
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                      הצג הכל
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProjects.slice(0, 4).map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                      <ProjectCard project={project} />
                    </Link>
                  ))}
                  {activeProjects.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-card rounded-xl border border-border/50">
                      <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">אין פרויקטים פעילים</p>
                      <Button 
                        className="mt-4 gap-2"
                        onClick={() => setShowNewProjectModal(true)}
                      >
                        <Plus className="h-4 w-4" />
                        צור פרויקט ראשון
                      </Button>
                    </div>
                  )}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">פעילות אחרונה</h2>
                  <Link to="/activity">
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                      הצג הכל
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <ActivityFeed activities={activities} maxItems={4} />
              </section>
            </div>

            {/* Sidebar - Decisions & Tasks */}
            <div className="space-y-8">
              {/* Pending Decisions */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">החלטות ממתינות</h2>
                  <Link to="/decisions">
                    <span className="text-sm text-muted-foreground">{pendingDecisions.length} ממתינות</span>
                  </Link>
                </div>
                <div className="space-y-3">
                  {decisions.slice(0, 3).map((decision) => (
                    <DecisionCard key={decision.id} decision={decision} compact />
                  ))}
                  {decisions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      אין החלטות ממתינות
                    </div>
                  )}
                </div>
              </section>

              {/* My Tasks */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">המשימות שלי</h2>
                  <Link to="/tasks">
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                      <Plus className="h-4 w-4" />
                      הוסף
                    </Button>
                  </Link>
                </div>
                <TaskList 
                  tasks={tasks.slice(0, 4)} 
                  onTaskToggle={toggleTaskStatus}
                />
              </section>

              {/* Upcoming Deadlines */}
              <section className="card-elevated p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">מועדים קרובים</h3>
                    <p className="text-sm text-muted-foreground">7 ימים הבאים</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {pendingDecisions
                    .slice(0, 2)
                    .map((decision) => (
                      <div key={decision.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground truncate max-w-[180px]">{decision.title}</span>
                        <span className="text-muted-foreground flex-shrink-0">
                          {new Date(decision.deadline).toLocaleDateString('he-IL', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    ))}
                  {pendingDecisions.length === 0 && (
                    <div className="text-sm text-muted-foreground">אין מועדים קרובים</div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <NewProjectModal 
        open={showNewProjectModal} 
        onOpenChange={setShowNewProjectModal} 
      />
    </MainLayout>
  );
}
