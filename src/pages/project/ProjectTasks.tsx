 import { useOutletContext } from 'react-router-dom';
 import { Project } from '@/types/project';
 import { TaskList } from '@/components/dashboard/TaskList';
 import { mockTasks } from '@/data/mockData';
 import { Button } from '@/components/ui/button';
 import { Plus, Filter } from 'lucide-react';
 
 export default function ProjectTasks() {
   const { project } = useOutletContext<{ project: Project }>();
   const projectTasks = mockTasks.filter(t => t.projectId === project.id);
   const tasks = projectTasks.length > 0 ? projectTasks : mockTasks;
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-foreground">משימות הפרויקט</h2>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Filter className="h-4 w-4" />
             סינון
           </Button>
           <Button size="sm" className="gap-2">
             <Plus className="h-4 w-4" />
             משימה חדשה
           </Button>
         </div>
       </div>
       <TaskList tasks={tasks} />
     </div>
   );
 }