import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, Task, TaskStatus, TaskPriority } from '@/types/project';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Calendar, ChevronLeft, ChevronRight, X, User, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  addDays, addWeeks, addMonths,
  differenceInDays, differenceInCalendarWeeks,
  format, parseISO, eachDayOfInterval, eachWeekOfInterval,
  eachMonthOfInterval, isSameMonth, isToday,
  min as dateMin, max as dateMax,
} from 'date-fns';
import { he } from 'date-fns/locale';

type Scale = 'week' | 'month';

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'לא התחיל',
  in_progress: 'בתהליך',
  completed: 'הושלם',
  blocked: 'חסום',
  ready: 'מוכן',
};

const statusColors: Record<TaskStatus, string> = {
  not_started: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/15 text-primary border-primary/30',
  completed: 'bg-success/15 text-success border-success/30',
  blocked: 'bg-destructive/15 text-destructive border-destructive/30',
  ready: 'bg-info/15 text-info border-info/30',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
  urgent: 'דחוף',
};

const barColors: Record<TaskStatus, { bg: string; fill: string }> = {
  not_started: { bg: 'hsl(var(--muted) / 0.3)', fill: 'hsl(var(--muted))' },
  in_progress: { bg: 'hsl(var(--primary) / 0.15)', fill: 'hsl(var(--primary))' },
  completed: { bg: 'hsl(var(--success) / 0.15)', fill: 'hsl(var(--success))' },
  blocked: { bg: 'hsl(var(--destructive) / 0.15)', fill: 'hsl(var(--destructive))' },
  ready: { bg: 'hsl(var(--info) / 0.15)', fill: 'hsl(var(--info))' },
};

const TASK_LIST_WIDTH = 220;
const ROW_HEIGHT = 44;
const HEADER_HEIGHT = 52;

export default function ProjectGantt() {
  const { project } = useOutletContext<{ project: Project }>();
  const { getProjectTasks, updateTask } = useProjectData();
  const [scale, setScale] = useState<Scale>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editData, setEditData] = useState<{ startDate: string; endDate: string; status: TaskStatus; assigneeName: string }>({
    startDate: '', endDate: '', status: 'not_started', assigneeName: '',
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const tasks = useMemo(() => {
    return getProjectTasks(project.id).filter(t => t.startDate && t.endDate);
  }, [getProjectTasks, project.id]);

  // Compute timeline range
  const { timelineStart, timelineEnd, columns, cellWidth, totalWidth } = useMemo(() => {
    if (tasks.length === 0) {
      const now = new Date();
      return {
        timelineStart: startOfMonth(now),
        timelineEnd: endOfMonth(addMonths(now, 2)),
        columns: [] as Date[],
        cellWidth: 40,
        totalWidth: 400,
      };
    }

    const allStarts = tasks.map(t => parseISO(t.startDate!));
    const allEnds = tasks.map(t => parseISO(t.endDate!));
    const earliest = dateMin(allStarts);
    const latest = dateMax(allEnds);

    let tStart: Date, tEnd: Date, cols: Date[], cw: number;

    if (scale === 'week') {
      tStart = startOfWeek(addDays(earliest, -7), { locale: he });
      tEnd = endOfWeek(addDays(latest, 14), { locale: he });
      cols = eachDayOfInterval({ start: tStart, end: tEnd });
      cw = 36;
    } else {
      tStart = startOfMonth(addMonths(earliest, -1));
      tEnd = endOfMonth(addMonths(latest, 1));
      cols = eachDayOfInterval({ start: tStart, end: tEnd });
      cw = 12;
    }

    return {
      timelineStart: tStart,
      timelineEnd: tEnd,
      columns: cols,
      cellWidth: cw,
      totalWidth: cols.length * cw,
    };
  }, [tasks, scale]);

  // Generate header groups
  const headerGroups = useMemo(() => {
    if (columns.length === 0) return { top: [] as { label: string; span: number }[], bottom: [] as { label: string; isToday: boolean }[] };

    if (scale === 'week') {
      // Top = weeks, Bottom = days
      const weeks = eachWeekOfInterval({ start: columns[0], end: columns[columns.length - 1] }, { locale: he });
      const top = weeks.map(weekStart => {
        const days = columns.filter(d => {
          const ws = startOfWeek(d, { locale: he });
          return ws.getTime() === weekStart.getTime();
        });
        return {
          label: format(weekStart, 'd MMM', { locale: he }),
          span: days.length,
        };
      });

      const bottom = columns.map(d => ({
        label: format(d, 'EEE', { locale: he }).slice(0, 2),
        isToday: isToday(d),
      }));

      return { top, bottom };
    } else {
      // Top = months, Bottom = days (no day labels at month scale, just ticks)
      const months = eachMonthOfInterval({ start: columns[0], end: columns[columns.length - 1] });
      const top = months.map(monthStart => {
        const days = columns.filter(d => isSameMonth(d, monthStart));
        return {
          label: format(monthStart, 'MMMM yyyy', { locale: he }),
          span: days.length,
        };
      });

      // Show day number every 5 days
      const bottom = columns.map(d => ({
        label: d.getDate() % 5 === 1 ? format(d, 'd', { locale: he }) : '',
        isToday: isToday(d),
      }));

      return { top, bottom };
    }
  }, [columns, scale]);

  // Calculate bar position
  const getBarPosition = useCallback((task: Task) => {
    if (!task.startDate || !task.endDate || columns.length === 0) return null;
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    const offsetDays = differenceInDays(start, columns[0]);
    const durationDays = differenceInDays(end, start) + 1;
    const x = offsetDays * cellWidth;
    const width = durationDays * cellWidth;
    return { x, width };
  }, [columns, cellWidth]);

  // Dependency arrow positions
  const dependencyLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; midX: number }[] = [];
    const taskIndexMap = new Map(tasks.map((t, i) => [t.id, i]));

    tasks.forEach((task, targetIdx) => {
      if (!task.dependencies) return;
      task.dependencies.forEach(depId => {
        const sourceIdx = taskIndexMap.get(depId);
        if (sourceIdx === undefined) return;
        const sourceTask = tasks[sourceIdx];
        const sourceBar = getBarPosition(sourceTask);
        const targetBar = getBarPosition(task);
        if (!sourceBar || !targetBar) return;

        // RTL: arrow from left side of source to right side of target
        const x1 = sourceBar.x; // left edge of source (in RTL = end)
        const y1 = sourceIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const x2 = targetBar.x + targetBar.width; // right edge of target (in RTL = start)
        const y2 = targetIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
        const midX = Math.min(x1, x2) - 12;

        lines.push({ x1, y1, x2, y2, midX });
      });
    });
    return lines;
  }, [tasks, getBarPosition]);

  const openTaskPanel = (task: Task) => {
    setSelectedTask(task);
    setEditData({
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      status: task.status,
      assigneeName: task.assignee?.name || '',
    });
  };

  const saveTaskEdits = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, {
      startDate: editData.startDate || undefined,
      endDate: editData.endDate || undefined,
      status: editData.status,
    });
    setSelectedTask(null);
  };

  // Scroll to today on mount
  useEffect(() => {
    if (timelineRef.current && columns.length > 0) {
      const today = new Date();
      const dayOffset = differenceInDays(today, columns[0]);
      if (dayOffset > 0 && dayOffset < columns.length) {
        const scrollPos = dayOffset * cellWidth - timelineRef.current.clientWidth / 2;
        timelineRef.current.scrollLeft = Math.max(0, scrollPos);
      }
    }
  }, [columns, cellWidth]);

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">תרשים גאנט</h2>
        </div>
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">אין משימות עם תאריכים</h3>
          <p className="text-muted-foreground">הוסף תאריכי התחלה וסיום למשימות כדי להציג את תרשים הגאנט</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">תרשים גאנט</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/30 rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setScale('week')}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-all',
                scale === 'week' ? 'bg-background text-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              שבוע
            </button>
            <button
              onClick={() => setScale('month')}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-all',
                scale === 'month' ? 'bg-background text-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              חודש
            </button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border border-border">
        <div className="flex">
          {/* Task list (fixed left in RTL) */}
          <div className="flex-shrink-0 border-l border-border bg-card" style={{ width: TASK_LIST_WIDTH }}>
            {/* Header */}
            <div
              className="flex items-center px-4 font-medium text-sm text-muted-foreground border-b border-border bg-muted/10"
              style={{ height: HEADER_HEIGHT }}
            >
              משימה
            </div>
            {/* Task rows */}
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-center px-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-accent/30',
                  selectedTask?.id === task.id && 'bg-primary/5'
                )}
                style={{ height: ROW_HEIGHT }}
                onClick={() => openTaskPanel(task)}
              >
                <div className="truncate text-sm text-foreground">{task.title}</div>
              </div>
            ))}
          </div>

          {/* Timeline area */}
          <div className="flex-1 overflow-x-auto" ref={timelineRef}>
            <div style={{ width: totalWidth, minWidth: '100%' }}>
              {/* Header rows */}
              <div className="border-b border-border bg-muted/10" style={{ height: HEADER_HEIGHT }}>
                {/* Top row */}
                <div className="flex" style={{ height: HEADER_HEIGHT / 2 }}>
                  {headerGroups.top.map((group, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center text-xs font-medium text-muted-foreground border-l border-border/30 first:border-l-0"
                      style={{ width: group.span * cellWidth }}
                    >
                      {group.label}
                    </div>
                  ))}
                </div>
                {/* Bottom row */}
                <div className="flex" style={{ height: HEADER_HEIGHT / 2 }}>
                  {headerGroups.bottom.map((col, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-center text-[10px]',
                        col.isToday ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground/60'
                      )}
                      style={{ width: cellWidth }}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart body */}
              <div className="relative" style={{ height: tasks.length * ROW_HEIGHT }}>
                {/* Grid lines */}
                {columns.map((col, i) => (
                  <div
                    key={i}
                    className={cn(
                      'absolute top-0 bottom-0 border-l',
                      isToday(col) ? 'border-primary/40 z-10' : 'border-border/20'
                    )}
                    style={{ right: i * cellWidth, width: cellWidth }}
                  />
                ))}

                {/* Row backgrounds */}
                {tasks.map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute w-full border-b border-border/30"
                    style={{ top: idx * ROW_HEIGHT, height: ROW_HEIGHT }}
                  />
                ))}

                {/* Today line */}
                {(() => {
                  const today = new Date();
                  const todayOffset = differenceInDays(today, columns[0]);
                  if (todayOffset >= 0 && todayOffset < columns.length) {
                    return (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary/60 z-20"
                        style={{ right: todayOffset * cellWidth + cellWidth / 2 }}
                      />
                    );
                  }
                  return null;
                })()}

                {/* SVG layer for dependency arrows */}
                <svg
                  ref={svgRef}
                  className="absolute inset-0 pointer-events-none z-10"
                  width={totalWidth}
                  height={tasks.length * ROW_HEIGHT}
                  style={{ direction: 'ltr' }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 8 3, 0 6"
                        fill="hsl(var(--muted-foreground) / 0.4)"
                      />
                    </marker>
                  </defs>
                  {dependencyLines.map((line, i) => {
                    // Convert from RTL right-offset to LTR x coordinates
                    const ltrX1 = totalWidth - line.x1;
                    const ltrX2 = totalWidth - line.x2;
                    const ltrMidX = totalWidth - line.midX;

                    return (
                      <g key={i}>
                        <path
                          d={`M ${ltrX1} ${line.y1} H ${ltrMidX} V ${line.y2} H ${ltrX2}`}
                          fill="none"
                          stroke="hsl(var(--muted-foreground) / 0.3)"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Task bars */}
                {tasks.map((task, idx) => {
                  const pos = getBarPosition(task);
                  if (!pos) return null;
                  const colors = barColors[task.status];

                  return (
                    <div
                      key={task.id}
                      className="absolute z-10 cursor-pointer group"
                      style={{
                        top: idx * ROW_HEIGHT + 8,
                        right: pos.x,
                        width: pos.width,
                        height: ROW_HEIGHT - 16,
                      }}
                      onClick={() => openTaskPanel(task)}
                    >
                      <div
                        className="w-full h-full rounded-md transition-all group-hover:shadow-md group-hover:scale-y-110 relative overflow-hidden"
                        style={{ backgroundColor: colors.bg }}
                      >
                        {/* Progress fill for completed */}
                        <div
                          className="absolute inset-y-0 right-0 rounded-md transition-all"
                          style={{
                            backgroundColor: colors.fill,
                            width: task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '50%' : '0%',
                            opacity: 0.8,
                          }}
                        />
                        {/* Label inside bar */}
                        {pos.width > 70 && (
                          <span className="absolute inset-0 flex items-center px-2 text-[11px] font-medium text-foreground truncate z-10">
                            {task.title}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-4 py-3 border-t border-border bg-muted/5">
          {Object.entries(barColors).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.fill }} />
              <span className="text-[11px] text-muted-foreground">{statusLabels[status as TaskStatus]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Task Edit Side Panel */}
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent side="left" className="w-[380px] sm:w-[420px]">
          <SheetHeader>
            <SheetTitle className="text-right">עריכת משימה</SheetTitle>
          </SheetHeader>

          {selectedTask && (
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{selectedTask.title}</h3>
                {selectedTask.description && (
                  <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                )}
              </div>

              <Separator />

              {/* Assignee */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  אחראי
                </label>
                <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                  {selectedTask.assignee?.avatar && (
                    <img src={selectedTask.assignee.avatar} alt="" className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-sm text-foreground">
                    {selectedTask.assignee?.name || 'לא הוקצה'}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">סטטוס</label>
                <Select value={editData.status} onValueChange={(v) => setEditData(prev => ({ ...prev, status: v as TaskStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">עדיפות</label>
                <Badge className={cn('text-xs', statusColors[selectedTask.status])}>
                  {priorityLabels[selectedTask.priority]}
                </Badge>
              </div>

              <Separator />

              {/* Dates */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  תאריכים
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">התחלה</span>
                    <Input
                      type="date"
                      value={editData.startDate}
                      onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">סיום</span>
                    <Input
                      type="date"
                      value={editData.endDate}
                      onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              {selectedTask.dependencies && selectedTask.dependencies.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">תלויות</label>
                    <div className="space-y-1">
                      {selectedTask.dependencies.map(depId => {
                        const depTask = tasks.find(t => t.id === depId);
                        return depTask ? (
                          <div key={depId} className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/10 rounded-md">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                            {depTask.title}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex gap-3">
                <Button onClick={saveTaskEdits} className="flex-1">
                  שמור שינויים
                </Button>
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  ביטול
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
