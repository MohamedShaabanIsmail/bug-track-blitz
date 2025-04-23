
export type UserRole = "tester" | "developer" | "manager";

export type BugSeverity = "low" | "medium" | "high" | "critical";

export type BugStatus = "new" | "in-progress" | "resolved" | "closed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  reportedBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface DashboardStats {
  totalBugs: number;
  openBugs: number;
  closedBugs: number;
  criticalBugs: number;
  highBugs: number;
  mediumBugs: number;
  lowBugs: number;
  bugsByStatus: {
    new: number;
    "in-progress": number;
    resolved: number;
    closed: number;
  };
  topDevelopers: {
    name: string;
    resolvedBugs: number;
  }[];
}
