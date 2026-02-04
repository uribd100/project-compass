import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DecisionCard } from '@/components/dashboard/DecisionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockDecisions } from '@/data/mockData';
import { Plus, Search, Filter } from 'lucide-react';
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
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Decisions & Approvals</h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage project decisions requiring approval
                </p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Decision
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
                All
                <Badge variant="secondary" className="ml-2">{statusCounts.all}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pending
                <Badge variant="secondary" className="ml-2 bg-warning/10 text-warning">{statusCounts.pending}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('approved')}
              >
                Approved
                <Badge variant="secondary" className="ml-2 bg-success/10 text-success">{statusCounts.approved}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'revision_needed' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('revision_needed')}
              >
                Needs Revision
                <Badge variant="secondary" className="ml-2 bg-info/10 text-info">{statusCounts.revision_needed}</Badge>
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
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
              <h3 className="text-lg font-medium text-foreground mb-2">No decisions found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchQuery || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first decision to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
