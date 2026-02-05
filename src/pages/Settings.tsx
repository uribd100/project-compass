 import { MainLayout } from '@/components/layout/MainLayout';
 import { PageHeader } from '@/components/layout/PageHeader';
 import { Card } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { Separator } from '@/components/ui/separator';
 import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
 import { currentUser } from '@/data/mockData';
 import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
 
 const settingsSections = [
   { id: 'profile', label: 'פרופיל', icon: User },
   { id: 'notifications', label: 'התראות', icon: Bell },
   { id: 'security', label: 'אבטחה', icon: Shield },
   { id: 'appearance', label: 'מראה', icon: Palette },
   { id: 'language', label: 'שפה', icon: Globe },
 ];
 
 export default function Settings() {
   return (
     <MainLayout>
       <div className="min-h-screen">
         <PageHeader 
           title="הגדרות"
           subtitle="נהל את הגדרות החשבון וההעדפות שלך"
         />
 
         <div className="px-6 lg:px-8 py-6">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
             {/* Sidebar */}
             <nav className="space-y-1">
               {settingsSections.map((section) => (
                 <button
                   key={section.id}
                   className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                 >
                   <section.icon className="h-5 w-5" />
                   {section.label}
                 </button>
               ))}
             </nav>
 
             {/* Content */}
             <div className="lg:col-span-3 space-y-6">
               {/* Profile Section */}
               <Card className="p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-4">פרטי פרופיל</h3>
                 <div className="flex items-center gap-6 mb-6">
                   <Avatar className="h-20 w-20">
                     <AvatarImage src={currentUser.avatar} />
                     <AvatarFallback className="text-xl">
                       {currentUser.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <Button variant="outline" size="sm">שנה תמונה</Button>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>שם מלא</Label>
                     <Input defaultValue={currentUser.name} />
                   </div>
                   <div className="space-y-2">
                     <Label>דוא״ל</Label>
                     <Input defaultValue={currentUser.email} type="email" />
                   </div>
                 </div>
               </Card>
 
               {/* Notifications Section */}
               <Card className="p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-4">העדפות התראות</h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="font-medium text-foreground">התראות דוא״ל</p>
                       <p className="text-sm text-muted-foreground">קבל עדכונים על פעילות חשובה</p>
                     </div>
                     <Switch defaultChecked />
                   </div>
                   <Separator />
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="font-medium text-foreground">התראות דחיפה</p>
                       <p className="text-sm text-muted-foreground">קבל התראות בזמן אמת בדפדפן</p>
                     </div>
                     <Switch />
                   </div>
                   <Separator />
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="font-medium text-foreground">סיכום יומי</p>
                       <p className="text-sm text-muted-foreground">קבל סיכום יומי של הפעילות</p>
                     </div>
                     <Switch defaultChecked />
                   </div>
                 </div>
               </Card>
 
               <div className="flex justify-end gap-3">
                 <Button variant="outline">ביטול</Button>
                 <Button>שמור שינויים</Button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </MainLayout>
   );
 }