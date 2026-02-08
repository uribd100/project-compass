import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, Task } from '@/types/project';
import { TaskList } from '@/components/dashboard/TaskList';
import { TaskModal } from '@/components/modals/TaskModal';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export default function ProjectTasks() {
  const { project } = useOutletContext<{ project: Project }>();
  const { getProjectTasks, toggleTaskStatus, deleteTask } = useProjectData();
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const projectTasks = getProjectTasks(project.id);
  // If no tasks for this project, show all tasks as demo
  const tasks = projectTasks.length > 0 ? projectTasks : getProjectTasks('proj-1');

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">משימות הפרויקט</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            סינון
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}
          >
            <Plus className="h-4 w-4" />
            משימה חדשה
          </Button>
        </div>
      </div>
      
      <TaskList 
        tasks={tasks} 
        onTaskToggle={toggleTaskStatus}
        onTaskEdit={handleEditTask}
        onTaskDelete={(taskId) => setDeletingTaskId(taskId)}
      />

      <TaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        projectId={project.id}
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
    </div>
  );
}
