import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskList } from '@/components/dashboard/TaskList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockTasks } from '@/data/mockData';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';
import { TaskStatus } from '@/types/project';

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockTasks.length,
    not_started: mockTasks.filter(t => t.status === 'not_started').length,
    in_progress: mockTasks.filter(t => t.status === 'in_progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    blocked: mockTasks.filter(t => t.status === 'blocked').length,
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">משימות</h1>
                <p className="text-muted-foreground mt-1">
                  ניהול ומעקב אחר כל משימות הפרויקט
                </p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                משימה חדשה
              </Button>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                הכל
                <Badge variant="secondary" className="mr-2">{statusCounts.all}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('in_progress')}
              >
                בביצוע
                <Badge variant="secondary" className="mr-2 bg-info/10 text-info">{statusCounts.in_progress}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'not_started' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('not_started')}
              >
                לא התחילו
                <Badge variant="secondary" className="mr-2">{statusCounts.not_started}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                הושלמו
                <Badge variant="secondary" className="mr-2 bg-success/10 text-success">{statusCounts.completed}</Badge>
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש משימות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="max-w-4xl">
            <TaskList tasks={filteredTasks} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
