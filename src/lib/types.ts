export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export type Project = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  memberIds: string[];
  createdAt: Date;
};

export type Member = {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: Date;
  phone: string;
  projectId?: string;
  isActive: boolean;
};

export type Task = {
  id: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  userId: string;
  dateline: Date;
};

export type Settings = {
  denseUI: boolean;
  emailNotifications: boolean;
  themeName: "default" | "emerald" | "violet";
};
