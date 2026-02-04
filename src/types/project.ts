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
  | 'blocked';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  consultantType?: ConsultantType;
  avatar?: string;
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
  relatedDecisionId?: string;
  relatedTaskId?: string;
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
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  relatedDecisionId?: string;
  dependencies?: string[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
  version: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  mentions?: string[];
}
