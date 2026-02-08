import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Task, TaskPriority, TaskStatus } from '@/types/project';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  task?: Task | null;
}

export function TaskModal({ open, onOpenChange, projectId, task }: TaskModalProps) {
  const { createTask, updateTask } = useProjectData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as TaskPriority,
    status: task?.status || 'not_started' as TaskStatus,
    dueDate: task?.dueDate || '',
  });

  // Reset form when task changes
  useState(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'not_started',
        dueDate: '',
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && task) {
        updateTask(task.id, {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          status: formData.status,
          dueDate: formData.dueDate || undefined,
        });
      } else {
        createTask({
          projectId,
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          status: formData.status,
          dueDate: formData.dueDate || undefined,
        });
      }
      
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'not_started',
        dueDate: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'עריכת משימה' : 'משימה חדשה'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'ערוך את פרטי המשימה' : 'הוסף משימה חדשה לפרויקט'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">כותרת המשימה *</Label>
            <Input
              id="title"
              placeholder="לדוגמה: סקירת תוכניות אדריכליות"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              placeholder="פרטים נוספים על המשימה..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">עדיפות</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">נמוכה</SelectItem>
                  <SelectItem value="medium">בינונית</SelectItem>
                  <SelectItem value="high">גבוהה</SelectItem>
                  <SelectItem value="urgent">דחוף</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">סטטוס</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">לא התחיל</SelectItem>
                  <SelectItem value="in_progress">בביצוע</SelectItem>
                  <SelectItem value="completed">הושלם</SelectItem>
                  <SelectItem value="blocked">חסום</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">תאריך יעד</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? 'שומר...' : isEditing ? 'שמור שינויים' : 'צור משימה'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
