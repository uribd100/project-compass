import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { 
  ArrowRight, 
  Activity, 
  FileText, 
  CheckSquare, 
  DollarSign, 
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'overview', label: 'סקירה', path: '/overview', icon: Activity },
  { id: 'activity', label: 'פעילות', path: '/activity', icon: Activity },
  { id: 'files', label: 'קבצים', path: '/files', icon: FileText },
  { id: 'tasks', label: 'משימות', path: '/tasks', icon: CheckSquare },
  { id: 'budget', label: 'תקציב', path: '/budget', icon: DollarSign },
  { id: 'gantt', label: 'גאנט', path: '/gantt', icon: BarChart3 },
];

const statusLabels: Record<string, string> = {
  active: 'פעיל',
  completed: 'הושלם',
  on_hold: 'מושהה',
  planning: 'בתכנון',
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/30',
  completed: 'bg-muted text-muted-foreground border-muted',
  on_hold: 'bg-warning/10 text-warning border-warning/30',
  planning: 'bg-primary/10 text-primary border-primary/30',
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const location = useLocation();
  const { getProjectById } = useProjectData();
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">פרויקט לא נמצא</h1>
            <p className="text-muted-foreground mb-4">הפרויקט המבוקש אינו קיים במערכת.</p>
            <Link to="/projects">
              <Button>חזרה לפרויקטים</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentTab = tabs.find(tab => {
    const fullPath = `/projects/${projectId}${tab.path}`;
    return location.pathname === fullPath;
  }) || tabs[0];

  return (
    <MainLayout>
      <div className="min-h-screen">
        <PageHeader 
          title={project.name}
          subtitle={project.description}
          actions={
            <div className="flex items-center gap-3">
              <Badge className={cn("border", statusColors[project.status])}>
                {statusLabels[project.status]}
              </Badge>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  חזרה לפרויקטים
                </Button>
              </Link>
            </div>
          }
        />

        {/* Tabs Navigation */}
        <div className="border-b border-border bg-background/50">
          <div className="px-6 lg:px-8">
            <nav className="flex gap-1 -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = currentTab.id === tab.id;
                return (
                  <Link
                    key={tab.id}
                    to={`/projects/${projectId}${tab.path}`}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 lg:px-8 py-6">
          <Outlet context={{ project }} />
        </div>
      </div>
    </MainLayout>
  );
}
