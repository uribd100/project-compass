import { MainLayout } from '@/components/layout/MainLayout';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockActivities } from '@/data/mockData';
import { Plus, Search, Filter, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { ActivityType } from '@/types/project';

export default function Activity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActivityType | null>(null);

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Activity Feed</h1>
                <p className="text-muted-foreground mt-1">
                  All project activities, decisions, and updates in one place
                </p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Post Update
              </Button>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={typeFilter === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter(null)}
              >
                All
              </Button>
              <Button
                variant={typeFilter === 'message' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('message')}
              >
                Messages
              </Button>
              <Button
                variant={typeFilter === 'decision' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('decision')}
              >
                Decisions
              </Button>
              <Button
                variant={typeFilter === 'file_upload' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('file_upload')}
              >
                Files
              </Button>
              <Button
                variant={typeFilter === 'milestone' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('milestone')}
              >
                Milestones
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
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
