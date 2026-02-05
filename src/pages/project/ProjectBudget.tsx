 import { useOutletContext } from 'react-router-dom';
 import { Project } from '@/types/project';
 import { Card } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { Plus, Download, TrendingUp, TrendingDown } from 'lucide-react';
 
 const budgetCategories = [
   { name: 'תכנון ופיקוח', planned: 500000, actual: 420000 },
   { name: 'בנייה וקונסטרוקציה', planned: 2000000, actual: 1850000 },
   { name: 'מערכות חשמל', planned: 300000, actual: 280000 },
   { name: 'אינסטלציה', planned: 250000, actual: 190000 },
   { name: 'גמר ופיתוח', planned: 400000, actual: 120000 },
 ];
 
 export default function ProjectBudget() {
   const { project } = useOutletContext<{ project: Project }>();
 
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('he-IL', {
       style: 'currency',
       currency: 'ILS',
       maximumFractionDigits: 0,
     }).format(amount);
   };
 
   const totalPlanned = budgetCategories.reduce((sum, c) => sum + c.planned, 0);
   const totalActual = budgetCategories.reduce((sum, c) => sum + c.actual, 0);
   const utilization = (totalActual / totalPlanned) * 100;
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-foreground">ניהול תקציב</h2>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Download className="h-4 w-4" />
             ייצוא דו״ח
           </Button>
           <Button size="sm" className="gap-2">
             <Plus className="h-4 w-4" />
             הוצאה חדשה
           </Button>
         </div>
       </div>
 
       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="p-4">
           <p className="text-sm text-muted-foreground">תקציב מתוכנן</p>
           <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPlanned)}</p>
         </Card>
         <Card className="p-4">
           <p className="text-sm text-muted-foreground">הוצאות בפועל</p>
           <p className="text-2xl font-bold text-foreground">{formatCurrency(totalActual)}</p>
         </Card>
         <Card className="p-4">
           <p className="text-sm text-muted-foreground">יתרה</p>
           <p className="text-2xl font-bold text-success">{formatCurrency(totalPlanned - totalActual)}</p>
         </Card>
       </div>
 
       {/* Budget Breakdown */}
       <Card className="p-6">
         <h3 className="text-lg font-semibold text-foreground mb-4">פירוט לפי קטגוריות</h3>
         <div className="space-y-4">
           {budgetCategories.map((category) => {
             const percent = (category.actual / category.planned) * 100;
             const isOver = percent > 100;
             return (
               <div key={category.name} className="space-y-2">
                 <div className="flex items-center justify-between">
                   <span className="font-medium text-foreground">{category.name}</span>
                   <div className="flex items-center gap-2">
                     <span className="text-sm text-muted-foreground">
                       {formatCurrency(category.actual)} / {formatCurrency(category.planned)}
                     </span>
                     {isOver ? (
                       <TrendingUp className="h-4 w-4 text-destructive" />
                     ) : (
                       <TrendingDown className="h-4 w-4 text-success" />
                     )}
                   </div>
                 </div>
                 <Progress value={Math.min(percent, 100)} className="h-2" />
               </div>
             );
           })}
         </div>
       </Card>
     </div>
   );
 }