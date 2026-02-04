import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bell,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/data/mockData';

const navigation = [
  { name: 'לוח בקרה', href: '/', icon: LayoutDashboard },
  { name: 'פרויקטים', href: '/projects', icon: FolderKanban },
  { name: 'פעילות', href: '/activity', icon: Activity },
  { name: 'משימות', href: '/tasks', icon: CheckSquare, badge: 3 },
  { name: 'החלטות', href: '/decisions', icon: FileText, badge: 2 },
  { name: 'קבצים', href: '/files', icon: FileText },
  { name: 'תקציב', href: '/budget', icon: DollarSign },
  { name: 'צוות', href: '/team', icon: Users },
];

const bottomNav = [
  { name: 'הגדרות', href: '/settings', icon: Settings },
];

const roleLabels: Record<string, string> = {
  admin: 'מנהל מערכת',
  deputy_manager: 'סגן מנהל פרויקט',
  engineer: 'מהנדס',
  consultant: 'יועץ',
  project_owner: 'בעל הפרויקט',
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-l border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">BuildWorks</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/10"
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-3">
          <button className="flex items-center w-full gap-2 px-3 py-2 text-sm text-muted-foreground bg-background/50 rounded-lg border border-border hover:border-border/80 transition-colors">
            <Search className="h-4 w-4" />
            <span>חיפוש...</span>
            <kbd className="mr-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-sidebar-foreground hover:bg-background/70'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-foreground')} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? 'secondary' : 'default'}
                      className={cn(
                        'text-xs min-w-[20px] h-5 justify-center',
                        isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-sidebar-border">
        {bottomNav.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-background/70'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg hover:bg-background/70 cursor-pointer transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-accent/30">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-accent text-accent-foreground text-sm">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{roleLabels[currentUser.role]}</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
