import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, Task, Activity, FileAttachment, BudgetItem, User, TaskStatus, ActivityType } from '@/types/project';
import { 
  mockProjects as initialProjects, 
  mockTasks as initialTasks, 
  mockActivities as initialActivities,
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
  
  // Project CRUD
  createProject: (project: Omit<Project, 'id' | 'progress' | 'team'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Task CRUD
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  // Activity
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'user'>) => void;
  
  // Files
  uploadFile: (file: Omit<FileAttachment, 'id' | 'uploadedAt' | 'uploadedBy' | 'version'>) => void;
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
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

// Initial budget items from existing data
const initialBudgetItems: BudgetItem[] = [
  { id: 'budget-1', projectId: 'proj-1', name: 'תכנון ופיקוח', category: 'planning', planned: 500000, actual: 420000, createdAt: '2024-01-01' },
  { id: 'budget-2', projectId: 'proj-1', name: 'בנייה וקונסטרוקציה', category: 'construction', planned: 2000000, actual: 1850000, createdAt: '2024-01-01' },
  { id: 'budget-3', projectId: 'proj-1', name: 'מערכות חשמל', category: 'electrical', planned: 300000, actual: 280000, createdAt: '2024-01-01' },
  { id: 'budget-4', projectId: 'proj-1', name: 'אינסטלציה', category: 'plumbing', planned: 250000, actual: 190000, createdAt: '2024-01-01' },
  { id: 'budget-5', projectId: 'proj-1', name: 'גמר ופיתוח', category: 'finishing', planned: 400000, actual: 120000, createdAt: '2024-01-01' },
];

// Initial files
const initialFiles: FileAttachment[] = [
  { id: 'file-1', name: 'תוכנית אדריכלית - קומה ראשית.dwg', type: 'cad', size: 2400000, url: '#', uploadedBy: currentUser, uploadedAt: '2024-01-15', version: 1, folder: 'תוכניות', tags: [] },
  { id: 'file-2', name: 'דו״ח קונסטרוקציה.pdf', type: 'pdf', size: 1200000, url: '#', uploadedBy: currentUser, uploadedAt: '2024-01-14', version: 1, folder: 'דוחות', tags: [] },
  { id: 'file-3', name: 'הדמיית חזית.jpg', type: 'image', size: 3800000, url: '#', uploadedBy: currentUser, uploadedAt: '2024-01-13', version: 1, folder: 'הדמיות', tags: [] },
  { id: 'file-4', name: 'טבלת כמויות.xlsx', type: 'excel', size: 520000, url: '#', uploadedBy: currentUser, uploadedAt: '2024-01-12', version: 1, folder: 'תחשיבים', tags: [] },
  { id: 'file-5', name: 'פרוטוקול ישיבה 12.pdf', type: 'pdf', size: 340000, url: '#', uploadedBy: currentUser, uploadedAt: '2024-01-11', version: 1, folder: 'פרוטוקולים', tags: [] },
];

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [files, setFiles] = useState<FileAttachment[]>(initialFiles);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Project CRUD
  const createProject = useCallback((projectData: Omit<Project, 'id' | 'progress' | 'team'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${generateId()}`,
      progress: 0,
      team: [currentUser],
    };
    setProjects(prev => [...prev, newProject]);
    
    // Add activity
    setActivities(prev => [...prev, {
      id: `act-${generateId()}`,
      projectId: newProject.id,
      type: 'milestone' as ActivityType,
      title: 'פרויקט חדש נוצר',
      description: `הפרויקט "${newProject.name}" נוצר בהצלחה`,
      user: currentUser,
      timestamp: new Date().toISOString(),
    }]);
    
    toast({
      title: "הפרויקט נוצר בהצלחה",
      description: `${newProject.name} נוסף לרשימת הפרויקטים`,
    });
    
    return newProject;
  }, []);

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
    setFiles(prev => prev.filter(f => !f.url.includes(id)));
    setBudgetItems(prev => prev.filter(b => b.projectId !== id));
    
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
    
    // Add activity
    setActivities(prev => [...prev, {
      id: `act-${generateId()}`,
      projectId: newTask.projectId,
      type: 'task_update' as ActivityType,
      title: 'משימה חדשה נוצרה',
      description: newTask.title,
      user: currentUser,
      timestamp: new Date().toISOString(),
      relatedTaskId: newTask.id,
    }]);
    
    toast({
      title: "המשימה נוספה",
      description: newTask.title,
    });
    
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    toast({
      title: "המשימה עודכנה",
      description: "השינויים נשמרו",
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({
      title: "המשימה נמחקה",
      description: task?.title || "המשימה הוסרה",
      variant: "destructive",
    });
  }, [tasks]);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus: TaskStatus = t.status === 'completed' ? 'not_started' : 'completed';
        return { ...t, status: newStatus };
      }
      return t;
    }));
  }, []);

  // Activity
  const addActivity = useCallback((activityData: Omit<Activity, 'id' | 'timestamp' | 'user'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act-${generateId()}`,
      timestamp: new Date().toISOString(),
      user: currentUser,
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  // Files
  const uploadFile = useCallback((fileData: Omit<FileAttachment, 'id' | 'uploadedAt' | 'uploadedBy' | 'version'>) => {
    const newFile: FileAttachment = {
      ...fileData,
      id: `file-${generateId()}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser,
      version: 1,
    };
    setFiles(prev => [...prev, newFile]);
    
    toast({
      title: "הקובץ הועלה בהצלחה",
      description: newFile.name,
    });
  }, []);

  const deleteFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({
      title: "הקובץ נמחק",
      description: file?.name || "הקובץ הוסר",
      variant: "destructive",
    });
  }, [files]);

  // Budget
  const createBudgetItem = useCallback((itemData: Omit<BudgetItem, 'id' | 'createdAt'>) => {
    const newItem: BudgetItem = {
      ...itemData,
      id: `budget-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setBudgetItems(prev => [...prev, newItem]);
    
    // Add activity
    setActivities(prev => [...prev, {
      id: `act-${generateId()}`,
      projectId: newItem.projectId,
      type: 'budget_change' as ActivityType,
      title: 'סעיף תקציב נוסף',
      description: `${newItem.name} - ₪${newItem.planned.toLocaleString()}`,
      user: currentUser,
      timestamp: new Date().toISOString(),
    }]);
    
    toast({
      title: "סעיף התקציב נוסף",
      description: newItem.name,
    });
  }, []);

  const updateBudgetItem = useCallback((id: string, updates: Partial<BudgetItem>) => {
    setBudgetItems(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    toast({
      title: "התקציב עודכן",
      description: "השינויים נשמרו",
    });
  }, []);

  const deleteBudgetItem = useCallback((id: string) => {
    const item = budgetItems.find(b => b.id === id);
    setBudgetItems(prev => prev.filter(b => b.id !== id));
    toast({
      title: "סעיף התקציב נמחק",
      description: item?.name || "הסעיף הוסר",
      variant: "destructive",
    });
  }, [budgetItems]);

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
    // For now, return all files (we can add projectId to files later)
    return files;
  }, [files]);

  const getProjectBudget = useCallback((projectId: string) => {
    return budgetItems.filter(b => b.projectId === projectId);
  }, [budgetItems]);

  return (
    <ProjectDataContext.Provider value={{
      projects,
      tasks,
      activities,
      files,
      budgetItems,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
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
    }}>
      {children}
    </ProjectDataContext.Provider>
  );
}

export function useProjectData() {
  const context = useContext(ProjectDataContext);
  if (context === undefined) {
    throw new Error('useProjectData must be used within a ProjectDataProvider');
  }
  return context;
}
