
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  startTime?: string; // "HH:mm" 형식
  endTime?: string;   // "HH:mm" 형식
  priority: Priority;
  status: Status;
  estimatedHours: number;
}

export interface HourlyPlan {
  hour: number; // 0-23
  subject: string;
  plan: string;
}

export interface DayPlan {
  date: string; // ISO string YYYY-MM-DD
  hourlyPlans: HourlyPlan[];
}

export interface StudyPlanItem {
  time: string;
  activity: string;
  focus: string;
}

export interface GeneratedPlan {
  title: string;
  goal: string;
  schedule: StudyPlanItem[];
  tips: string[];
}

export type View = 'dashboard' | 'monthly' | 'weekly' | 'daily' | 'stats' | 'ai-assistant';
