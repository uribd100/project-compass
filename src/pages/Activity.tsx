import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { ActivityType } from '@/types/project';

export default function Activity() {
  const { activities } = useProjectData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActivityType | null>(null);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <MainLayout>
      <div className="min-h-screen">
        <PageHeader
          title="פיד פעילות"
          subtitle="כל פעילויות הפרויקט, ההחלטות והעדכונים במקום אחד"
          actions={
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              פרסם עדכון
            </Button>
          }
        />

        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={typeFilter === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter(null)}
              >
                הכל
              </Button>
              <Button
                variant={typeFilter === 'message' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('message')}
              >
                הודעות
              </Button>
              <Button
                variant={typeFilter === 'decision' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('decision')}
              >
                החלטות
              </Button>
              <Button
                variant={typeFilter === 'file_upload' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('file_upload')}
              >
                קבצים
              </Button>
              <Button
                variant={typeFilter === 'milestone' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('milestone')}
              >
                אבני דרך
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש פעילות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="max-w-3xl">
            <ActivityFeed activities={filteredActivities} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
