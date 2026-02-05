 import { useOutletContext } from 'react-router-dom';
 import { Project } from '@/types/project';
 import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
 import { mockActivities } from '@/data/mockData';
 import { Button } from '@/components/ui/button';
 import { Filter, Download } from 'lucide-react';
 
 export default function ProjectActivity() {
   const { project } = useOutletContext<{ project: Project }>();
   const projectActivities = mockActivities.filter(a => a.projectId === project.id);
   const activities = projectActivities.length > 0 ? projectActivities : mockActivities;
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-foreground">יומן פעילות</h2>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Filter className="h-4 w-4" />
             סינון
           </Button>
           <Button variant="outline" size="sm" className="gap-2">
             <Download className="h-4 w-4" />
             ייצוא
           </Button>
         </div>
       </div>
       <ActivityFeed activities={activities} maxItems={20} />
     </div>
   );
 }