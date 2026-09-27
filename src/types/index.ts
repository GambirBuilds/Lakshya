// Lakshya - Core Data Types & Interfaces

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';

export type EisenhowerQuadrant = 'do_now' | 'schedule' | 'delegate' | 'eliminate';

export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'custom';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  tags: string[];
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedDuration: number; // in minutes
  actualDuration: number; // in minutes
  projectId?: string;
  goalId?: string;
  subtasks: Subtask[];
  notes?: string;
  recurrence: RecurrenceType;
  recurrenceDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  status: TaskStatus;
  quadrant: EisenhowerQuadrant;
  isDailyTop3?: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'active' | 'completed' | 'on_hold';
  deadline?: string;
  goalId?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  order: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  createdAt: string;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekly';
  targetDaysPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  logs: Record<string, boolean>; // 'YYYY-MM-DD': true
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  type: 'work' | 'break';
  completedAt: string; // ISO string
  xpEarned: number;
}

export type PlantStage = 'seed' | 'sprout' | 'plant' | 'flower' | 'sapling' | 'tree' | 'ancient_tree';

export interface GardenPlant {
  id: string;
  species: 'Bonsai' | 'Oak' | 'Sakura' | 'Lotus' | 'Redwood' | 'Bamboo';
  stage: PlantStage;
  sessionCount: number;
  totalMinutes: number;
  plantedAt: string;
  lastWatered: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  type: 'tasks' | 'focus_time' | 'habits';
}

export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'exhausted';

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  note?: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood?: MoodType;
  productivityScore: number;
  focusMinutes: number;
  tasksCompleted: number;
  accomplishments: string[];
  createdAt: string;
}

export interface DailyReview {
  id: string;
  date: string; // YYYY-MM-DD
  tasksCompletedCount: number;
  focusTimeMinutes: number;
  habitCompletionRate: number;
  productivityScore: number;
  xpEarned: number;
  reflection: string;
  tomorrowFocus: string;
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  taskId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color?: string;
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: 'amber' | 'emerald' | 'sky' | 'rose' | 'violet';
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
  category: 'Project Ideas' | 'Startup Ideas' | 'App Ideas' | 'Game Ideas' | 'Design Ideas' | 'Learning Ideas' | 'Football Ideas' | 'Other';
  status: 'Idea' | 'Exploring' | 'Planning' | 'Building' | 'Completed' | 'Archived';
  tags: string[];
  notes?: string;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  tasks: Array<{
    title: string;
    priority: Priority;
    estimatedDuration: number;
    subtasks?: string[];
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'tasks' | 'focus' | 'habits' | 'streak' | 'levels';
}

export interface PersonalBests {
  longestStreak: number;
  longestFocusSessionMinutes: number;
  mostTasksInOneDay: number;
  mostFocusTimeInOneDayMinutes: number;
  mostXpInOneDay: number;
  mostProductiveWeekScore: number;
}

export type ThemeMode = 'dark' | 'light';
export type ThemeAccent = 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose';
export type BackgroundStyle = 'minimal' | 'gradient' | 'abstract' | 'forest' | 'space' | 'custom';

export interface AppSettings {
  themeMode: ThemeMode;
  themeAccent: ThemeAccent;
  backgroundStyle: BackgroundStyle;
  customBackgroundUrl?: string;
  bgOpacity: number; // 0.1 to 1.0
  bgBlur: number; // 0 to 20 px
  workDuration: number; // minutes, default 25
  breakDuration: number; // minutes, default 5
  longBreakDuration: number; // minutes, default 15
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  userName: string;
  userTitle: string;
  dashboardWidgets: {
    dailyTop3: boolean;
    focusNext: boolean;
    productivityStats: boolean;
    activityHeatmap: boolean;
    focusGarden: boolean;
    dailyChallenges: boolean;
    habits: boolean;
    timeBlocking: boolean;
    weather: boolean;
    worldClock: boolean;
    stickyNotes: boolean;
    upcomingTasks: boolean;
  };
  worldClockCities: string[];
  weatherCity: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'achievement';
  title: string;
  message?: string;
  duration?: number;
}
