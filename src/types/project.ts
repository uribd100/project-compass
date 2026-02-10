export type UserRole = 
  | 'admin' 
  | 'deputy_manager' 
  | 'engineer' 
  | 'consultant' 
  | 'project_owner';

export type ConsultantType = 
  | 'architecture' 
  | 'traffic' 
  | 'landscape' 
  | 'structural' 
  | 'safety' 
  | 'accessibility' 
  | 'green_building' 
  | 'protection';

export type ActivityType = 
  | 'message' 
  | 'decision' 
  | 'approval' 
  | 'file_upload' 
  | 'task_update' 
  | 'budget_change' 
  | 'milestone';

export type DecisionStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'revision_needed';

export type TaskStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'completed' 
  | 'blocked'
  | 'ready';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type BudgetItemStatus = 'planned' | 'in_progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  consultantType?: ConsultantType;
  avatar?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
  role: 'owner' | 'manager' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on_hold' | 'completed';
  startDate: string;
  endDate?: string;
  team: User[];
  thumbnail?: string;
  progress: number;
  budget: {
    planned: number;
    actual: number;
  };
}

export interface Activity {
  id: string;
  projectId: string;
  type: ActivityType;
  title: string;
  description?: string;
  user: User;
  timestamp: string;
  metadata?: Record<string, unknown>;
  // Linked entities
  relatedDecisionId?: string;
  relatedTaskId?: string;
  relatedFileId?: string;
  relatedBudgetItemId?: string;
  attachments?: FileAttachment[];
  mentions?: string[];
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: DecisionStatus;
  createdBy: User;
  responsibleUsers: User[];
  deadline: string;
  createdAt: string;
  updatedAt: string;
  attachments: FileAttachment[];
  comments: Comment[];
  // Linked entities for automations
  linkedTaskId?: string;
  linkedBudgetItemId?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  relatedDecisionId?: string;
  dependencies?: string[];
}

export interface FileAttachment {
  id: string;
  projectId?: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
  version: number;
  tags?: string[];
  folder?: string;
}

export interface BudgetItem {
  id: string;
  projectId: string;
  name: string;
  category: string;
  planned: number;
  actual: number;
  status: BudgetItemStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  linkedDecisionId?: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  mentions?: string[];
}
