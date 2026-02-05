 import { useOutletContext } from 'react-router-dom';
 import { Project } from '@/types/project';
 import { StatsCard } from '@/components/dashboard/StatsCard';
 import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
 import { TaskList } from '@/components/dashboard/TaskList';
 import { DecisionCard } from '@/components/dashboard/DecisionCard';
 import { mockActivities, mockTasks, mockDecisions } from '@/data/mockData';
 import { CheckSquare, DollarSign, Clock, Users } from 'lucide-react';
 
 export default function ProjectOverview() {
   const { project } = useOutletContext<{ project: Project }>();
   
   const projectTasks = mockTasks.filter(t => t.projectId === project.id);
   const projectDecisions = mockDecisions.filter(d => d.projectId === project.id);
   const projectActivities = mockActivities.filter(a => a.projectId === project.id);
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('he-IL', {
       style: 'currency',
       currency: 'ILS',
       notation: 'compact',
       maximumFractionDigits: 1,
     }).format(amount);
   };
 
   const budgetUtilization = ((project.budget.actual / project.budget.planned) * 100).toFixed(0);
 
   return (
     <div className="space-y-8">
       {/* Stats */}
       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatsCard
           title="התקדמות"
           value={`${project.progress}%`}
           subtitle="מהפרויקט הושלם"
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
           value={projectTasks.filter(t => t.status !== 'completed').length}
           subtitle={`${projectTasks.length} סה"כ`}
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
           <ActivityFeed activities={projectActivities.length > 0 ? projectActivities : mockActivities.slice(0, 3)} maxItems={5} />
         </div>
 
         {/* Decisions & Tasks */}
         <div className="space-y-6">
           <div>
             <h3 className="text-lg font-semibold text-foreground mb-4">החלטות ממתינות</h3>
             <div className="space-y-3">
               {(projectDecisions.length > 0 ? projectDecisions : mockDecisions).slice(0, 2).map((decision) => (
                 <DecisionCard key={decision.id} decision={decision} compact />
               ))}
             </div>
           </div>
           <div>
             <h3 className="text-lg font-semibold text-foreground mb-4">משימות קרובות</h3>
             <TaskList tasks={(projectTasks.length > 0 ? projectTasks : mockTasks).slice(0, 3)} />
           </div>
         </div>
       </div>
     </div>
   );
 }