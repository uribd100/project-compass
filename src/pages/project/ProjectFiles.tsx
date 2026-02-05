 import { useOutletContext } from 'react-router-dom';
 import { Project } from '@/types/project';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Upload, FolderPlus, FileText, Image, FileSpreadsheet, File, MoreVertical } from 'lucide-react';
 
 const mockFiles = [
   { id: '1', name: 'תוכנית אדריכלית - קומה ראשית.dwg', type: 'cad', size: '2.4 MB', date: '2024-01-15', folder: 'תוכניות' },
   { id: '2', name: 'דו״ח קונסטרוקציה.pdf', type: 'pdf', size: '1.2 MB', date: '2024-01-14', folder: 'דוחות' },
   { id: '3', name: 'הדמיית חזית.jpg', type: 'image', size: '3.8 MB', date: '2024-01-13', folder: 'הדמיות' },
   { id: '4', name: 'טבלת כמויות.xlsx', type: 'excel', size: '520 KB', date: '2024-01-12', folder: 'תחשיבים' },
   { id: '5', name: 'פרוטוקול ישיבה 12.pdf', type: 'pdf', size: '340 KB', date: '2024-01-11', folder: 'פרוטוקולים' },
 ];
 
 const fileIcons: Record<string, typeof FileText> = {
   pdf: FileText,
   image: Image,
   excel: FileSpreadsheet,
   cad: File,
 };
 
 export default function ProjectFiles() {
   const { project } = useOutletContext<{ project: Project }>();
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-foreground">קבצים ומסמכים</h2>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <FolderPlus className="h-4 w-4" />
             תיקיה חדשה
           </Button>
           <Button size="sm" className="gap-2">
             <Upload className="h-4 w-4" />
             העלאת קובץ
           </Button>
         </div>
       </div>
 
       <Card className="divide-y divide-border">
         {mockFiles.map((file) => {
           const Icon = fileIcons[file.type] || File;
           return (
             <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Icon className="h-5 w-5 text-primary" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="font-medium text-foreground truncate">{file.name}</p>
                 <p className="text-sm text-muted-foreground">
                   {file.folder} • {file.size} • {new Date(file.date).toLocaleDateString('he-IL')}
                 </p>
               </div>
               <Button variant="ghost" size="icon">
                 <MoreVertical className="h-4 w-4" />
               </Button>
             </div>
           );
         })}
       </Card>
     </div>
   );
 }