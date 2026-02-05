 import { useOutletContext } from 'react-router-dom';
 import { Project } from '@/types/project';
 import { Card } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { ZoomIn, ZoomOut, Download, Calendar } from 'lucide-react';
 
 const ganttTasks = [
   { name: 'תכנון אדריכלי', start: 0, duration: 20, progress: 100 },
   { name: 'אישורי הגשה', start: 18, duration: 15, progress: 80 },
   { name: 'תכנון קונסטרוקציה', start: 20, duration: 25, progress: 60 },
   { name: 'יסודות ובנייה', start: 45, duration: 40, progress: 30 },
   { name: 'מערכות חשמל', start: 70, duration: 20, progress: 0 },
   { name: 'גמר ופיתוח', start: 85, duration: 25, progress: 0 },
 ];
 
 export default function ProjectGantt() {
   const { project } = useOutletContext<{ project: Project }>();
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-foreground">תרשים גאנט</h2>
         <div className="flex gap-2">
           <Button variant="outline" size="icon">
             <ZoomOut className="h-4 w-4" />
           </Button>
           <Button variant="outline" size="icon">
             <ZoomIn className="h-4 w-4" />
           </Button>
           <Button variant="outline" size="sm" className="gap-2">
             <Download className="h-4 w-4" />
             ייצוא
           </Button>
         </div>
       </div>
 
       <Card className="p-6 overflow-x-auto">
         {/* Timeline Header */}
         <div className="flex items-center gap-4 mb-6 min-w-[800px]">
           <div className="w-48 flex-shrink-0 font-medium text-foreground">משימה</div>
           <div className="flex-1 grid grid-cols-12 gap-1">
             {['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'].map((month) => (
               <div key={month} className="text-center text-sm text-muted-foreground py-2 border-b border-border">
                 {month}
               </div>
             ))}
           </div>
         </div>
 
         {/* Gantt Rows */}
         <div className="space-y-3 min-w-[800px]">
           {ganttTasks.map((task, idx) => (
             <div key={idx} className="flex items-center gap-4">
               <div className="w-48 flex-shrink-0 text-sm text-foreground truncate">{task.name}</div>
               <div className="flex-1 relative h-8 bg-muted/30 rounded">
                 <div
                   className="absolute h-full bg-primary/20 rounded"
                   style={{
                     right: `${(task.start / 110) * 100}%`,
                     width: `${(task.duration / 110) * 100}%`,
                   }}
                 >
                   <div
                     className="h-full bg-primary rounded"
                     style={{ width: `${task.progress}%` }}
                   />
                 </div>
               </div>
             </div>
           ))}
         </div>
 
         {/* Legend */}
         <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-primary rounded" />
             <span className="text-sm text-muted-foreground">הושלם</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-primary/20 rounded" />
             <span className="text-sm text-muted-foreground">מתוכנן</span>
           </div>
         </div>
       </Card>
     </div>
   );
 }