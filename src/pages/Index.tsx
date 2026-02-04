import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { 
  mockProjects, 
  mockActivities, 
  mockDecisions, 
  mockTasks,
  currentUser 
} from '@/data/mockData';
import { 
  Plus, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  DollarSign,
  ArrowRight,
  Calendar
} from 'lucide-react';

export default function Index() {
  const activeProjects = mockProjects.filter(p => p.status === 'active');
  const pendingDecisions = mockDecisions.filter(d => d.status === 'pending');
  const inProgressTasks = mockTasks.filter(t => t.status === 'in_progress');
  
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget.planned, 0);
  const actualSpend = mockProjects.reduce((sum, p) => sum + p.budget.actual, 0);

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Good morning, {currentUser.name.split(' ')[0]}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's what's happening across your projects today.
                </p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-8 py-6 space-y-8">
          {/* Stats Overview */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Active Projects"
              value={activeProjects.length}
              subtitle={`${mockProjects.length} total`}
              icon={FolderKanban}
              variant="primary"
              trend={{ value: 12, label: 'from last month' }}
            />
            <StatsCard
              title="Tasks In Progress"
              value={inProgressTasks.length}
              subtitle={`${mockTasks.length} total tasks`}
              icon={CheckSquare}
              variant="accent"
              trend={{ value: -5, label: 'from last week' }}
            />
            <StatsCard
              title="Pending Decisions"
              value={pendingDecisions.length}
              subtitle="Awaiting approval"
              icon={Clock}
              trend={{ value: 0, label: 'no change' }}
            />
            <StatsCard
              title="Budget Utilization"
              value={`${((actualSpend / totalBudget) * 100).toFixed(0)}%`}
              subtitle={`$${(actualSpend / 1000000).toFixed(1)}M of $${(totalBudget / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              trend={{ value: 8, label: 'from last month' }}
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Projects & Activity - Takes 2 columns on XL */}
            <div className="xl:col-span-2 space-y-8">
              {/* Active Projects */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Active Projects</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <ActivityFeed activities={mockActivities} maxItems={4} />
              </section>
            </div>

            {/* Sidebar - Decisions & Tasks */}
            <div className="space-y-8">
              {/* Pending Decisions */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Pending Decisions</h2>
                  <span className="text-sm text-muted-foreground">{pendingDecisions.length} pending</span>
                </div>
                <div className="space-y-3">
                  {mockDecisions.slice(0, 3).map((decision) => (
                    <DecisionCard key={decision.id} decision={decision} compact />
                  ))}
                </div>
              </section>

              {/* My Tasks */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">My Tasks</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                <TaskList tasks={mockTasks.slice(0, 4)} />
              </section>

              {/* Upcoming Deadlines */}
              <section className="card-elevated p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Upcoming Deadlines</h3>
                    <p className="text-sm text-muted-foreground">Next 7 days</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockDecisions
                    .filter(d => d.status === 'pending')
                    .slice(0, 2)
                    .map((decision) => (
                      <div key={decision.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground truncate max-w-[180px]">{decision.title}</span>
                        <span className="text-muted-foreground flex-shrink-0">
                          {new Date(decision.deadline).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
