import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskList } from '@/components/dashboard/TaskList';
import { TaskModal } from '@/components/modals/TaskModal';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Plus, Search } from 'lucide-react';
import { TaskStatus, Task } from '@/types/project';

export default function Tasks() {
  const { tasks, toggleTaskStatus, deleteTask } = useProjectData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: tasks.length,
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <PageHeader
          title="משימות"
          subtitle="ניהול ומעקב אחר כל משימות הפרויקט"
          actions={
            <Button 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              משימה חדשה
            </Button>
          }
        />

        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                הכל
                <Badge variant="secondary" className="mr-2">{statusCounts.all}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('in_progress')}
              >
                בביצוע
                <Badge variant="secondary" className="mr-2 bg-info/10 text-info">{statusCounts.in_progress}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'not_started' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('not_started')}
              >
                לא התחילו
                <Badge variant="secondary" className="mr-2">{statusCounts.not_started}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                הושלמו
                <Badge variant="secondary" className="mr-2 bg-success/10 text-success">{statusCounts.completed}</Badge>
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש משימות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="max-w-4xl">
            <TaskList 
              tasks={filteredTasks}
              onTaskToggle={toggleTaskStatus}
              onTaskEdit={handleEditTask}
              onTaskDelete={(taskId) => setDeletingTaskId(taskId)}
            />
          </div>
        </div>
      </div>

      <TaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        projectId="proj-1"
        task={editingTask}
      />

      <ConfirmDialog
        open={!!deletingTaskId}
        onOpenChange={() => setDeletingTaskId(null)}
        title="מחיקת משימה"
        description="האם אתה בטוח שברצונך למחוק משימה זו? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </MainLayout>
  );
}
