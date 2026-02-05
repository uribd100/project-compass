import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
 import { PageHeader } from '@/components/layout/PageHeader';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockDecisions } from '@/data/mockData';
 import { Plus, Search } from 'lucide-react';
import { DecisionStatus } from '@/types/project';

export default function Decisions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DecisionStatus | null>(null);

  const filteredDecisions = mockDecisions.filter((decision) => {
    const matchesSearch = decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || decision.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockDecisions.length,
    pending: mockDecisions.filter(d => d.status === 'pending').length,
    approved: mockDecisions.filter(d => d.status === 'approved').length,
    rejected: mockDecisions.filter(d => d.status === 'rejected').length,
    revision_needed: mockDecisions.filter(d => d.status === 'revision_needed').length,
  };

  return (
     <MainLayout>
       <div className="min-h-screen">
         <PageHeader
           title="החלטות ואישורים"
           subtitle="מעקב וניהול החלטות פרויקט הדורשות אישור"
           actions={
             <Button className="gap-2 bg-primary hover:bg-primary/90">
               <Plus className="h-4 w-4" />
               החלטה חדשה
             </Button>
           }
         />

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
                variant={statusFilter === 'pending' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                ממתינות
                <Badge variant="secondary" className="mr-2 bg-warning/10 text-warning">{statusCounts.pending}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('approved')}
              >
                אושרו
                <Badge variant="secondary" className="mr-2 bg-success/10 text-success">{statusCounts.approved}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'revision_needed' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('revision_needed')}
              >
                דורשות תיקון
                <Badge variant="secondary" className="mr-2 bg-info/10 text-info">{statusCounts.revision_needed}</Badge>
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש החלטות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Decisions Grid */}
          {filteredDecisions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDecisions.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">לא נמצאו החלטות</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchQuery || statusFilter
                  ? "נסה לשנות את החיפוש או הסינון"
                  : "צור את ההחלטה הראשונה שלך כדי להתחיל"}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
