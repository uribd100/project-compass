 import { ReactNode } from 'react';
 import { Button } from '@/components/ui/button';
 import { Search, Bell } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface PageHeaderProps {
   title: string;
   subtitle?: string;
   actions?: ReactNode;
   className?: string;
 }
 
 export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
   return (
     <header className={cn("sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border", className)}>
       <div className="px-6 lg:px-8 py-4">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div>
             <h1 className="text-2xl font-bold text-foreground">{title}</h1>
             {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
           </div>
           <div className="flex items-center gap-3">
             {actions}
           </div>
         </div>
       </div>
     </header>
   );
 }