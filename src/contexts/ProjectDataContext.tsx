import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { 
  Project, 
  Task, 
  Activity, 
  FileAttachment, 
  BudgetItem, 
  Decision,
  User, 
  TaskStatus, 
  ActivityType,
  DecisionStatus,
  BudgetItemStatus
} from '@/types/project';
import { 
  mockProjects as initialProjects, 
  mockTasks as initialTasks, 
  mockActivities as initialActivities,
  mockDecisions as initialDecisions,
  mockBudgetItems as initialBudgetItems,
  mockFiles as initialFiles,
  currentUser 
} from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface ProjectDataContextType {
  // Data
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  files: FileAttachment[];
  budgetItems: BudgetItem[];
  decisions: Decision[];
  
  // Computed statistics
  stats: {
    activeProjectsCount: number;
    completedTasksCount: number;
    pendingDecisionsCount: number;
    totalBudgetPlanned: number;
    totalBudgetActual: number;
    budgetUtilization: number;
    tasksCompletionRate: number;
  };
  
  // Project CRUD
  createProject: (project: Omit<Project, 'id' | 'progress' | 'team'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Task CRUD
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Decision CRUD
  createDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>) => Decision;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  approveDecision: (id: string) => void;
  rejectDecision: (id: string) => void;
  deleteDecision: (id: string) => void;
  
  // Activity
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'user'>) => void;
  
  // Files
  uploadFile: (file: Omit<FileAttachment, 'id' | 'uploadedAt' | 'uploadedBy' | 'version'>) => FileAttachment;
  deleteFile: (id: string) => void;
  
  // Budget
  createBudgetItem: (item: Omit<BudgetItem, 'id' | 'createdAt'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  
  // Helpers
  getProjectById: (id: string) => Project | undefined;
  getProjectTasks: (projectId: string) => Task[];
  getProjectActivities: (projectId: string) => Activity[];
  getProjectFiles: (projectId: string) => FileAttachment[];
  getProjectBudget: (projectId: string) => BudgetItem[];
  getProjectDecisions: (projectId: string) => Decision[];
  computeProjectProgress: (projectId: string) => number;
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [files, setFiles] = useState<FileAttachment[]>(initialFiles);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Internal activity logger
  const logActivity = useCallback((
    projectId: string, 
    type: ActivityType, 
    title: string, 
    description?: string,
    linkedIds?: {
      relatedDecisionId?: string;
      relatedTaskId?: string;
      relatedFileId?: string;
      relatedBudgetItemId?: string;
    }
  ) => {
    const newActivity: Activity = {
      id: `act-${generateId()}`,
      projectId,
      type,
      title,
      description,
      user: currentUser,
      timestamp: new Date().toISOString(),
      ...linkedIds,
    };
    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  }, []);

  // Compute project progress based on completed tasks
  const computeProjectProgress = useCallback((projectId: string): number => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  }, [tasks]);

  // Update project progress when tasks change
  const updateProjectProgress = useCallback((projectId: string) => {
    const progress = computeProjectProgress(projectId);
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, progress } : p
    ));
  }, [computeProjectProgress]);

  // Update project budget totals from budget items
  const updateProjectBudgetTotals = useCallback((projectId: string) => {
    const projectBudgetItems = budgetItems.filter(b => b.projectId === projectId);
    const planned = projectBudgetItems.reduce((sum, b) => sum + b.planned, 0);
    const actual = projectBudgetItems.reduce((sum, b) => sum + b.actual, 0);
    
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, budget: { planned, actual } } : p
    ));
  }, [budgetItems]);

  // Computed statistics
  const stats = useMemo(() => {
    const activeProjectsCount = projects.filter(p => p.status === 'active').length;
    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
    const pendingDecisionsCount = decisions.filter(d => d.status === 'pending').length;
    const totalBudgetPlanned = projects.reduce((sum, p) => sum + p.budget.planned, 0);
    const totalBudgetActual = projects.reduce((sum, p) => sum + p.budget.actual, 0);
    const budgetUtilization = totalBudgetPlanned > 0 
      ? Math.round((totalBudgetActual / totalBudgetPlanned) * 100) 
      : 0;
    const tasksCompletionRate = tasks.length > 0 
      ? Math.round((completedTasksCount / tasks.length) * 100) 
      : 0;

    return {
      activeProjectsCount,
      completedTasksCount,
      pendingDecisionsCount,
      totalBudgetPlanned,
      totalBudgetActual,
      budgetUtilization,
      tasksCompletionRate,
    };
  }, [projects, tasks, decisions]);

  // Project CRUD
  const createProject = useCallback((projectData: Omit<Project, 'id' | 'progress' | 'team'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${generateId()}`,
      progress: 0,
      team: [currentUser],
    };
    setProjects(prev => [...prev, newProject]);
    
    logActivity(
      newProject.id, 
      'milestone', 
      'פרויקט חדש נוצר',
      `הפרויקט "${newProject.name}" נוצר בהצלחה`
    );
    
    toast({
      title: "הפרויקט נוצר בהצלחה",
      description: `${newProject.name} נוסף לרשימת הפרויקטים`,
    });
    
    return newProject;
  }, [logActivity]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    toast({
      title: "הפרויקט עודכן",
      description: "השינויים נשמרו בהצלחה",
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setActivities(prev => prev.filter(a => a.projectId !== id));
    setFiles(prev => prev.filter(f => f.projectId !== id));
    setBudgetItems(prev => prev.filter(b => b.projectId !== id));
    setDecisions(prev => prev.filter(d => d.projectId !== id));
    
    toast({
      title: "הפרויקט נמחק",
      description: project ? `"${project.name}" הוסר מהמערכת` : "הפרויקט הוסר",
      variant: "destructive",
    });
  }, [projects]);

  // Task CRUD
  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    
    logActivity(
      newTask.projectId, 
      'task_update', 
      'משימה חדשה נוצרה',
      newTask.title,
      { relatedTaskId: newTask.id }
    );
    
    // Update project progress
    setTimeout(() => updateProjectProgress(newTask.projectId), 0);
    
    toast({
      title: "המשימה נוספה",
      description: newTask.title,
    });
    
    return newTask;
  }, [logActivity, updateProjectProgress]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    
    if (task) {
      setTimeout(() => updateProjectProgress(task.projectId), 0);
    }
    
    toast({
      title: "המשימה עודכנה",
      description: "השינויים נשמרו",
    });
  }, [tasks, updateProjectProgress]);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    
    if (task) {
      setTimeout(() => updateProjectProgress(task.projectId), 0);
    }
    
    toast({
      title: "המשימה נמחקה",
      description: task?.title || "המשימה הוסרה",
      variant: "destructive",
    });
  }, [tasks, updateProjectProgress]);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(t => {
        if (t.id === id) {
          const newStatus: TaskStatus = t.status === 'completed' ? 'not_started' : 'completed';
          const completedAt = newStatus === 'completed' ? new Date().toISOString() : undefined;
          return { ...t, status: newStatus, completedAt };
        }
        return t;
      });
      
      const task = updatedTasks.find(t => t.id === id);
      if (task) {
        setTimeout(() => updateProjectProgress(task.projectId), 0);
      }
      
      return updatedTasks;
    });
  }, [updateProjectProgress]);

  const completeTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.status === 'completed') return;
    
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() } 
        : t
    ));
    
    logActivity(
      task.projectId,
      'task_update',
      'משימה הושלמה',
      `"${task.title}" סומנה כהושלמה`,
      { relatedTaskId: task.id }
    );
    
    setTimeout(() => updateProjectProgress(task.projectId), 0);
    
    toast({
      title: "המשימה הושלמה",
      description: task.title,
    });
  }, [tasks, logActivity, updateProjectProgress]);

  // Decision CRUD
  const createDecision = useCallback((decisionData: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Decision => {
    const now = new Date().toISOString();
    const newDecision: Decision = {
      ...decisionData,
      id: `dec-${generateId()}`,
      createdAt: now,
      updatedAt: now,
    };
    setDecisions(prev => [...prev, newDecision]);
    
    logActivity(
      newDecision.projectId,
      'decision',
      'החלטה חדשה נוצרה',
      newDecision.title,
      { relatedDecisionId: newDecision.id }
    );
    
    toast({
      title: "ההחלטה נוצרה",
      description: newDecision.title,
    });
    
    return newDecision;
  }, [logActivity]);

  const updateDecision = useCallback((id: string, updates: Partial<Decision>) => {
    const decision = decisions.find(d => d.id === id);
    const previousStatus = decision?.status;
    
    setDecisions(prev => prev.map(d => 
      d.id === id 
        ? { ...d, ...updates, updatedAt: new Date().toISOString() } 
        : d
    ));
    
    if (decision && updates.status && updates.status !== previousStatus) {
      logActivity(
        decision.projectId,
        'decision',
        `סטטוס החלטה שונה`,
        `"${decision.title}" שונה ל-${getStatusLabel(updates.status)}`,
        { relatedDecisionId: decision.id }
      );
    }
    
    toast({
      title: "ההחלטה עודכנה",
      description: "השינויים נשמרו",
    });
  }, [decisions, logActivity]);

  // Automation: When decision is approved
  const approveDecision = useCallback((id: string) => {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return;
    
    // Update decision status
    setDecisions(prev => prev.map(d => 
      d.id === id 
        ? { ...d, status: 'approved' as DecisionStatus, updatedAt: new Date().toISOString() } 
        : d
    ));
    
    // Log approval activity
    logActivity(
      decision.projectId,
      'approval',
      'החלטה אושרה',
      `"${decision.title}" אושרה`,
      { relatedDecisionId: decision.id }
    );
    
    // Automation #1: If linked to a task, update task status to "ready"
    if (decision.linkedTaskId) {
      const linkedTask = tasks.find(t => t.id === decision.linkedTaskId);
      if (linkedTask && linkedTask.status !== 'completed') {
        setTasks(prev => prev.map(t => 
          t.id === decision.linkedTaskId 
            ? { ...t, status: 'ready' as TaskStatus } 
            : t
        ));
        
        logActivity(
          decision.projectId,
          'task_update',
          'משימה עודכנה אוטומטית',
          `"${linkedTask.title}" עברה לסטטוס "מוכן להתחלה" בעקבות אישור החלטה`,
          { relatedTaskId: linkedTask.id, relatedDecisionId: decision.id }
        );
        
        setTimeout(() => updateProjectProgress(decision.projectId), 0);
      }
    }
    
    // Automation #2: If linked to a budget item, update budget item status
    if (decision.linkedBudgetItemId) {
      const linkedBudget = budgetItems.find(b => b.id === decision.linkedBudgetItemId);
      if (linkedBudget) {
        setBudgetItems(prev => prev.map(b => 
          b.id === decision.linkedBudgetItemId 
            ? { ...b, status: 'in_progress' as BudgetItemStatus, updatedAt: new Date().toISOString() } 
            : b
        ));
        
        logActivity(
          decision.projectId,
          'budget_change',
          'סעיף תקציב הופעל',
          `"${linkedBudget.name}" אושר והופעל בעקבות אישור החלטה`,
          { relatedBudgetItemId: linkedBudget.id, relatedDecisionId: decision.id }
        );
      }
    }
    
    toast({
      title: "ההחלטה אושרה",
      description: decision.title,
    });
  }, [decisions, tasks, budgetItems, logActivity, updateProjectProgress]);

  const rejectDecision = useCallback((id: string) => {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return;
    
    setDecisions(prev => prev.map(d => 
      d.id === id 
        ? { ...d, status: 'rejected' as DecisionStatus, updatedAt: new Date().toISOString() } 
        : d
    ));
    
    logActivity(
      decision.projectId,
      'decision',
      'החלטה נדחתה',
      `"${decision.title}" נדחתה`,
      { relatedDecisionId: decision.id }
    );
    
    toast({
      title: "ההחלטה נדחתה",
      description: decision.title,
      variant: "destructive",
    });
  }, [decisions, logActivity]);

  const deleteDecision = useCallback((id: string) => {
    const decision = decisions.find(d => d.id === id);
    setDecisions(prev => prev.filter(d => d.id !== id));
    
    toast({
      title: "ההחלטה נמחקה",
      description: decision?.title || "ההחלטה הוסרה",
      variant: "destructive",
    });
  }, [decisions]);

  // Activity
  const addActivity = useCallback((activityData: Omit<Activity, 'id' | 'timestamp' | 'user'>) => {
    logActivity(
      activityData.projectId,
      activityData.type,
      activityData.title,
      activityData.description,
      {
        relatedDecisionId: activityData.relatedDecisionId,
        relatedTaskId: activityData.relatedTaskId,
        relatedFileId: activityData.relatedFileId,
        relatedBudgetItemId: activityData.relatedBudgetItemId,
      }
    );
  }, [logActivity]);

  // Files - with automatic activity logging
  const uploadFile = useCallback((fileData: Omit<FileAttachment, 'id' | 'uploadedAt' | 'uploadedBy' | 'version'>): FileAttachment => {
    const newFile: FileAttachment = {
      ...fileData,
      id: `file-${generateId()}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser,
      version: 1,
    };
    setFiles(prev => [...prev, newFile]);
    
    // Automatically create activity for file upload
    if (newFile.projectId) {
      logActivity(
        newFile.projectId,
        'file_upload',
        'קובץ הועלה',
        `"${newFile.name}" הועלה לפרויקט`,
        { relatedFileId: newFile.id }
      );
    }
    
    toast({
      title: "הקובץ הועלה בהצלחה",
      description: newFile.name,
    });
    
    return newFile;
  }, [logActivity]);

  const deleteFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({
      title: "הקובץ נמחק",
      description: file?.name || "הקובץ הוסר",
      variant: "destructive",
    });
  }, [files]);

  // Budget - with automatic activity logging
  const createBudgetItem = useCallback((itemData: Omit<BudgetItem, 'id' | 'createdAt'>) => {
    const newItem: BudgetItem = {
      ...itemData,
      id: `budget-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setBudgetItems(prev => [...prev, newItem]);
    
    logActivity(
      newItem.projectId,
      'budget_change',
      'סעיף תקציב נוסף',
      `${newItem.name} - ₪${newItem.planned.toLocaleString()}`,
      { relatedBudgetItemId: newItem.id }
    );
    
    // Update project budget totals
    setTimeout(() => updateProjectBudgetTotals(newItem.projectId), 0);
    
    toast({
      title: "סעיף התקציב נוסף",
      description: newItem.name,
    });
  }, [logActivity, updateProjectBudgetTotals]);

  const updateBudgetItem = useCallback((id: string, updates: Partial<BudgetItem>) => {
    const item = budgetItems.find(b => b.id === id);
    
    setBudgetItems(prev => prev.map(b => 
      b.id === id 
        ? { ...b, ...updates, updatedAt: new Date().toISOString() } 
        : b
    ));
    
    if (item && (updates.actual !== undefined || updates.planned !== undefined)) {
      logActivity(
        item.projectId,
        'budget_change',
        'סעיף תקציב עודכן',
        `"${item.name}" עודכן`,
        { relatedBudgetItemId: item.id }
      );
      
      setTimeout(() => updateProjectBudgetTotals(item.projectId), 0);
    }
    
    toast({
      title: "התקציב עודכן",
      description: "השינויים נשמרו",
    });
  }, [budgetItems, logActivity, updateProjectBudgetTotals]);

  const deleteBudgetItem = useCallback((id: string) => {
    const item = budgetItems.find(b => b.id === id);
    setBudgetItems(prev => prev.filter(b => b.id !== id));
    
    if (item) {
      setTimeout(() => updateProjectBudgetTotals(item.projectId), 0);
    }
    
    toast({
      title: "סעיף התקציב נמחק",
      description: item?.name || "הסעיף הוסר",
      variant: "destructive",
    });
  }, [budgetItems, updateProjectBudgetTotals]);

  // Helpers
  const getProjectById = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const getProjectTasks = useCallback((projectId: string) => {
    return tasks.filter(t => t.projectId === projectId);
  }, [tasks]);

  const getProjectActivities = useCallback((projectId: string) => {
    return activities.filter(a => a.projectId === projectId);
  }, [activities]);

  const getProjectFiles = useCallback((projectId: string) => {
    return files.filter(f => f.projectId === projectId);
  }, [files]);

  const getProjectBudget = useCallback((projectId: string) => {
    return budgetItems.filter(b => b.projectId === projectId);
  }, [budgetItems]);

  const getProjectDecisions = useCallback((projectId: string) => {
    return decisions.filter(d => d.projectId === projectId);
  }, [decisions]);

  return (
    <ProjectDataContext.Provider value={{
      projects,
      tasks,
      activities,
      files,
      budgetItems,
      decisions,
      stats,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      completeTask,
      createDecision,
      updateDecision,
      approveDecision,
      rejectDecision,
      deleteDecision,
      addActivity,
      uploadFile,
      deleteFile,
      createBudgetItem,
      updateBudgetItem,
      deleteBudgetItem,
      getProjectById,
      getProjectTasks,
      getProjectActivities,
      getProjectFiles,
      getProjectBudget,
      getProjectDecisions,
      computeProjectProgress,
    }}>
      {children}
    </ProjectDataContext.Provider>
  );
}

// Helper function for status labels
function getStatusLabel(status: DecisionStatus): string {
  const labels: Record<DecisionStatus, string> = {
    pending: 'ממתין',
    approved: 'אושר',
    rejected: 'נדחה',
    revision_needed: 'דורש תיקון',
  };
  return labels[status] || status;
}

export function useProjectData() {
  const context = useContext(ProjectDataContext);
  if (context === undefined) {
    throw new Error('useProjectData must be used within a ProjectDataProvider');
  }
  return context;
}
