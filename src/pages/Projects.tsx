import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/data/mockData';
import { Plus, Search, Filter, Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockProjects.length,
    active: mockProjects.filter(p => p.status === 'active').length,
    on_hold: mockProjects.filter(p => p.status === 'on_hold').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and monitor all your construction projects
                </p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Project
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
                className="gap-1"
              >
                All
                <Badge variant="secondary" className="ml-1">{statusCounts.all}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className="gap-1"
              >
                Active
                <Badge variant="secondary" className="ml-1 bg-success/10 text-success">{statusCounts.active}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'on_hold' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('on_hold')}
                className="gap-1"
              >
                On Hold
                <Badge variant="secondary" className="ml-1 bg-warning/10 text-warning">{statusCounts.on_hold}</Badge>
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
                className="gap-1"
              >
                Completed
                <Badge variant="secondary" className="ml-1">{statusCounts.completed}</Badge>
              </Button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchQuery || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first project"}
              </p>
              {!searchQuery && !statusFilter && (
                <Button className="mt-6 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
