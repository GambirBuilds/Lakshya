import {
  Task,
  Project,
  Goal,
  Milestone,
  Habit,
  JournalEntry,
  DailyReview,
  IdeaItem,
  StickyNote,
  TaskTemplate,
  AppSettings,
  PersonalBests,
  GardenPlant,
  DailyChallenge,
  MoodEntry,
  TimeBlock,
  Achievement
} from '../types';

export const STORAGE_KEYS = {
  TASKS: 'lakshya_tasks',
  PROJECTS: 'lakshya_projects',
  GOALS: 'lakshya_goals',
  MILESTONES: 'lakshya_milestones',
  HABITS: 'lakshya_habits',
  JOURNAL: 'lakshya_journal',
  REVIEWS: 'lakshya_reviews',
  IDEAS: 'lakshya_ideas',
  NOTES: 'lakshya_notes',
  TEMPLATES: 'lakshya_templates',
  SETTINGS: 'lakshya_settings',
  XP: 'lakshya_xp',
  STREAKS: 'lakshya_streaks',
  PERSONAL_BESTS: 'lakshya_personal_bests',
  BRAIN_DUMP: 'lakshya_brain_dump',
  GARDEN: 'lakshya_garden',
  CHALLENGES: 'lakshya_challenges',
  MOODS: 'lakshya_moods',
  TIMEBLOCKS: 'lakshya_timeblocks',
  ACHIEVEMENTS: 'lakshya_achievements',
  FOCUS_SESSIONS: 'lakshya_focus_sessions',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  themeAccent: 'amber',
  backgroundStyle: 'minimal',
  customBackgroundUrl: '',
  bgOpacity: 0.85,
  bgBlur: 8,
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  notificationsEnabled: true,
  userName: 'Gambir Jung Karki',
  userTitle: 'Full-Stack Craftsman',
  dashboardWidgets: {
    dailyTop3: true,
    focusNext: true,
    productivityStats: true,
    activityHeatmap: true,
    focusGarden: true,
    dailyChallenges: true,
    habits: true,
    timeBlocking: true,
    weather: true,
    worldClock: true,
    stickyNotes: true,
    upcomingTasks: true,
  },
  worldClockCities: ['Kathmandu', 'London', 'New York', 'Tokyo'],
  weatherCity: 'Kathmandu',
};

export const DEFAULT_PERSONAL_BESTS: PersonalBests = {
  longestStreak: 14,
  longestFocusSessionMinutes: 90,
  mostTasksInOneDay: 9,
  mostFocusTimeInOneDayMinutes: 240,
  mostXpInOneDay: 650,
  mostProductiveWeekScore: 94,
};

export const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tmpl-college',
    title: 'College Assignment Workflow',
    category: 'Academics',
    description: 'Comprehensive workflow for high-grade research papers & projects',
    tasks: [
      { title: 'Research & Literature Review', priority: 'high', estimatedDuration: 60, subtasks: ['Gather 3 sources', 'Summarize key points'] },
      { title: 'Outline & Structure Paper', priority: 'medium', estimatedDuration: 30, subtasks: ['Write thesis statement', 'Section headings'] },
      { title: 'Draft Core Sections', priority: 'high', estimatedDuration: 90, subtasks: ['Introduction', 'Body analysis', 'Conclusion'] },
      { title: 'Proofread & Format References', priority: 'medium', estimatedDuration: 30, subtasks: ['APA/IEEE citations check', 'Grammar review'] },
      { title: 'Final Export & Submit to LMS', priority: 'urgent', estimatedDuration: 15, subtasks: ['Verify submission receipt'] },
    ],
  },
  {
    id: 'tmpl-morning',
    title: 'High-Performance Morning Routine',
    category: 'Daily Routine',
    description: 'Energizing protocol to conquer the day with clarity and momentum',
    tasks: [
      { title: 'Hydration & Mindful Stretching', priority: 'low', estimatedDuration: 15 },
      { title: 'Lakshya Morning Review & Top 3 Setup', priority: 'high', estimatedDuration: 10 },
      { title: 'Nutritious Breakfast & Focus Tea', priority: 'medium', estimatedDuration: 20 },
      { title: '90-Minute Unbroken Deep Work Block', priority: 'urgent', estimatedDuration: 90 },
    ],
  },
  {
    id: 'tmpl-feature',
    title: 'Software Feature Delivery Sprint',
    category: 'Engineering',
    description: 'Disciplined engineering pipeline from user story to production release',
    tasks: [
      { title: 'Architecture & Schema Specification', priority: 'high', estimatedDuration: 45 },
      { title: 'Write Core Business Logic & State Tests', priority: 'urgent', estimatedDuration: 75 },
      { title: 'Build Responsive Accessible UI Components', priority: 'high', estimatedDuration: 90 },
      { title: 'Cross-browser Verification & Lint Clean', priority: 'medium', estimatedDuration: 30 },
      { title: 'Git Commit, PR Review & Deploy', priority: 'high', estimatedDuration: 20 },
    ],
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-first-task', title: 'First Spark', description: 'Complete your first task in Lakshya', icon: 'Sparkles', unlocked: true, unlockedAt: '2026-09-20T10:00:00Z', category: 'tasks' },
  { id: 'ach-top3-trio', title: 'Triad of Focus', description: 'Complete all Daily Top 3 tasks in a single day', icon: 'Target', unlocked: true, unlockedAt: '2026-09-24T18:00:00Z', category: 'tasks' },
  { id: 'ach-focus-pioneer', title: 'Deep Work Pioneer', description: 'Complete 5 unbroken focus sessions', icon: 'Hourglass', unlocked: true, unlockedAt: '2026-09-22T14:30:00Z', category: 'focus' },
  { id: 'ach-century-focus', title: 'Centurion', description: 'Accumulate 100+ minutes of total focus time', icon: 'Shield', unlocked: true, unlockedAt: '2026-09-25T16:00:00Z', category: 'focus' },
  { id: 'ach-habit-iron', title: 'Iron Discipline', description: 'Maintain any habit streak for 7 consecutive days', icon: 'Flame', unlocked: true, unlockedAt: '2026-09-26T21:00:00Z', category: 'streak' },
  { id: 'ach-garden-bloom', title: 'Green Thumb', description: 'Grow your first tree in the Focus Garden', icon: 'TreePine', unlocked: true, unlockedAt: '2026-09-25T17:00:00Z', category: 'focus' },
  { id: 'ach-matrix-master', title: 'Eisenhower Commander', description: 'Clear all Urgent & Important tasks before noon', icon: 'CheckCircle2', unlocked: false, category: 'tasks' },
  { id: 'ach-night-zen', title: 'Evening Solitude', description: 'Perform 3 Daily Shutdown reviews', icon: 'Moon', unlocked: false, category: 'habits' },
  { id: 'ach-level-elite', title: 'Ascension', description: 'Reach Level 4 (Elite Productive)', icon: 'Award', unlocked: false, category: 'levels' },
  { id: 'ach-vault-visionary', title: 'Visionary Mind', description: 'Capture 5 creative concepts in the Idea Vault', icon: 'Lightbulb', unlocked: true, unlockedAt: '2026-09-23T11:00:00Z', category: 'tasks' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-fullstack',
    name: 'Full-Stack Mastery & Capstone',
    description: 'Master modern TypeScript, distributed architectures, and UI/UX design',
    color: '#f59e0b',
    icon: 'Code',
    status: 'active',
    deadline: '2026-11-30',
    goalId: 'goal-developer',
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'proj-football',
    name: 'Athletic Conditioning & Football',
    description: 'Agility drills, match tactical awareness, and endurance training',
    color: '#10b981',
    icon: 'Activity',
    status: 'active',
    deadline: '2026-12-15',
    goalId: 'goal-fitness',
    createdAt: '2026-09-12T09:00:00Z',
  },
  {
    id: 'proj-academic',
    name: 'Computer Science Semester VI',
    description: 'Advanced Database Systems, Operating Systems & Algorithms',
    color: '#38bdf8',
    icon: 'GraduationCap',
    status: 'active',
    deadline: '2026-10-25',
    goalId: 'goal-academics',
    createdAt: '2026-09-01T08:00:00Z',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-developer',
    title: 'Become an Elite Full-Stack Product Architect',
    description: 'Build enterprise-grade software products with world-class UX, resilient backend architecture, and high performance',
    category: 'Career & Craft',
    deadline: '2026-12-31',
    status: 'in_progress',
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'goal-academics',
    title: 'Graduate with Distinction (GPA 3.9+)',
    description: 'Excel in academic assignments, theoretical foundations, and capstone presentation for Prashant Bhattarai Sir',
    category: 'Academics',
    deadline: '2026-12-20',
    status: 'in_progress',
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'goal-fitness',
    title: 'Peak Football Match Fitness & Speed',
    description: 'Achieve sub-12s sprint agility, 90-minute stamina, and flawless ball control drills',
    category: 'Health & Sports',
    deadline: '2026-11-15',
    status: 'in_progress',
    createdAt: '2026-09-05T00:00:00Z',
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'm-1', goalId: 'goal-developer', title: 'Complete HTML5/CSS3 Semantic Foundation', completed: true, completedAt: '2026-09-10T12:00:00Z', order: 1 },
  { id: 'm-2', goalId: 'goal-developer', title: 'Deep JavaScript & TypeScript Async Patterns (65%)', completed: false, order: 2 },
  { id: 'm-3', goalId: 'goal-developer', title: 'Production React 19 Architecture & State Management (40%)', completed: false, order: 3 },
  { id: 'm-4', goalId: 'goal-developer', title: 'Distributed Systems & Database Query Optimization (0%)', completed: false, order: 4 },
  { id: 'm-5', goalId: 'goal-academics', title: 'Database Normalization & Indexing Case Study', completed: true, completedAt: '2026-09-22T15:00:00Z', order: 1 },
  { id: 'm-6', goalId: 'goal-academics', title: 'Submit Lakshya Productivity Platform for Evaluation', completed: false, order: 2 },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Database Systems ER-Diagram & SQL Queries',
    description: 'Finalize schema normalization 3NF and test indexed JOIN queries for semester project.',
    priority: 'urgent',
    category: 'Academics',
    tags: ['college', 'sql', 'dbms'],
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '17:00',
    estimatedDuration: 60,
    actualDuration: 45,
    projectId: 'proj-academic',
    goalId: 'goal-academics',
    subtasks: [
      { id: 'st-1', title: 'Draw ER Diagram in draw.io', completed: true },
      { id: 'st-2', title: 'Write DDL statements', completed: true },
      { id: 'st-3', title: 'Verify foreign key cascade integrity', completed: false },
    ],
    notes: 'Remember to mention B-Tree indexing strategy for the user lookups.',
    recurrence: 'none',
    status: 'in_progress',
    quadrant: 'do_now',
    isDailyTop3: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Deliver Lakshya Productivity System Architecture',
    description: 'Ensure all 35+ core features communicate seamlessly with clean local state and zero bloat.',
    priority: 'high',
    category: 'Engineering',
    tags: ['react', 'lakshya', 'frontend'],
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '19:30',
    estimatedDuration: 90,
    actualDuration: 75,
    projectId: 'proj-fullstack',
    goalId: 'goal-developer',
    subtasks: [
      { id: 'st-4', title: 'Web Audio Ambient Engine verification', completed: true },
      { id: 'st-5', title: 'Eisenhower Matrix & Time blocking integration', completed: true },
      { id: 'st-6', title: 'Natural language parsing test suite', completed: true },
    ],
    notes: 'Submitted to Prashant Bhattarai Sir. Section: F258. Author: Gambir Jung Karki.',
    recurrence: 'none',
    status: 'in_progress',
    quadrant: 'do_now',
    isDailyTop3: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Football Interval Sprint Drills & Agility Ladder',
    description: '10x 40m sprint intervals with 30s recovery, followed by cone dribbling.',
    priority: 'medium',
    category: 'Health',
    tags: ['football', 'fitness'],
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    estimatedDuration: 45,
    actualDuration: 0,
    projectId: 'proj-football',
    goalId: 'goal-fitness',
    subtasks: [
      { id: 'st-7', title: 'Warmup & dynamic hamstring stretch', completed: false },
      { id: 'st-8', title: 'Interval sprints', completed: false },
      { id: 'st-9', title: 'Cool down & hydration', completed: false },
    ],
    notes: 'Bring football cleats and electrolytes.',
    recurrence: 'custom',
    recurrenceDays: [1, 3, 5],
    status: 'todo',
    quadrant: 'schedule',
    isDailyTop3: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Review System Design Chapter on Distributed Caching',
    description: 'Study Redis cache invalidation strategies and write-through vs write-back caching.',
    priority: 'medium',
    category: 'Engineering',
    tags: ['system-design', 'learning'],
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '20:00',
    estimatedDuration: 40,
    actualDuration: 0,
    projectId: 'proj-fullstack',
    goalId: 'goal-developer',
    subtasks: [],
    recurrence: 'none',
    status: 'todo',
    quadrant: 'schedule',
    isDailyTop3: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Weekly Task Cleanup & Inbox Zero review',
    description: 'Archive stale tasks, review completed objectives, and set next week targets.',
    priority: 'low',
    category: 'Productivity',
    tags: ['review', 'organization'],
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dueTime: '11:00',
    estimatedDuration: 25,
    actualDuration: 0,
    subtasks: [],
    recurrence: 'weekly',
    status: 'todo',
    quadrant: 'schedule',
    isDailyTop3: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Clean Workspace Desk & Re-cable Monitors',
    description: 'Ensure distraction-free clean physical environment.',
    priority: 'low',
    category: 'Personal',
    tags: ['organization', 'desk'],
    estimatedDuration: 15,
    actualDuration: 15,
    subtasks: [],
    recurrence: 'none',
    status: 'completed',
    quadrant: 'delegate',
    completedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    name: 'Morning Lakshya Review',
    description: 'Plan Top 3 priorities and review calendar before opening email or social media',
    icon: 'Compass',
    color: '#f59e0b',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 8,
    bestStreak: 14,
    logs: {
      [new Date().toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 259200000).toISOString().split('T')[0]]: true,
    },
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'h-2',
    name: '90-Min Deep Work Session',
    description: 'Uninterrupted flow state session with phone on Do Not Disturb',
    icon: 'Zap',
    color: '#38bdf8',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    currentStreak: 5,
    bestStreak: 12,
    logs: {
      [new Date().toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
    },
    createdAt: '2026-09-02T00:00:00Z',
  },
  {
    id: 'h-3',
    name: 'Football / Fitness Conditioning',
    description: 'Minimum 30 minutes active physical training or agility work',
    icon: 'Activity',
    color: '#10b981',
    frequency: 'weekdays',
    targetDaysPerWeek: 5,
    currentStreak: 4,
    bestStreak: 9,
    logs: {
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
    },
    createdAt: '2026-09-05T00:00:00Z',
  },
  {
    id: 'h-4',
    name: 'Night Reflection & Daily Shutdown',
    description: 'Log accomplishments, triage remaining tasks, and clear mind before sleep',
    icon: 'Moon',
    color: '#a855f7',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 7,
    bestStreak: 11,
    logs: {
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
    },
    createdAt: '2026-09-01T00:00:00Z',
  },
];

export const INITIAL_GARDEN: GardenPlant[] = [
  { id: 'p-1', species: 'Bonsai', stage: 'ancient_tree', sessionCount: 8, totalMinutes: 200, plantedAt: '2026-09-18T09:00:00Z', lastWatered: new Date().toISOString() },
  { id: 'p-2', species: 'Sakura', stage: 'tree', sessionCount: 5, totalMinutes: 125, plantedAt: '2026-09-22T10:00:00Z', lastWatered: new Date().toISOString() },
  { id: 'p-3', species: 'Oak', stage: 'plant', sessionCount: 3, totalMinutes: 75, plantedAt: '2026-09-25T14:00:00Z', lastWatered: new Date().toISOString() },
  { id: 'p-4', species: 'Lotus', stage: 'sprout', sessionCount: 1, totalMinutes: 25, plantedAt: new Date().toISOString(), lastWatered: new Date().toISOString() },
];

export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: 'sn-1',
    title: 'Key Evaluation Criteria',
    content: 'Prashant Bhattarai Sir review: Verify zero dummy placeholders, real Web Audio synthesis, interactive time blocking, and responsive dark-first UI.',
    color: 'amber',
    isPinned: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sn-2',
    title: 'Productivity Philosophy',
    content: '"Aim with intent. Focus without friction. Achieve with consistency." - Lakshya Core Tenet',
    color: 'emerald',
    isPinned: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sn-3',
    title: 'Upcoming Tech Stack Upgrades',
    content: 'Explore WebAssembly vector math, local SQLite via OPFS for multi-gigabyte archival, and custom synthesized wave shapes.',
    color: 'sky',
    isPinned: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea-1',
    title: 'AI Code Reviewer with AST Graph Visualizer',
    description: 'Tool that scans Git PRs and highlights structural complexity hotspots using 3D graph diagrams.',
    category: 'App Ideas',
    status: 'Planning',
    tags: ['typescript', 'ast', 'developer-tools'],
    notes: 'Can integrate with tree-sitter for instant multilingual parse trees.',
    createdAt: '2026-09-20T14:00:00Z',
  },
  {
    id: 'idea-2',
    title: 'Football Tactical Playbook Simulator',
    description: 'Interactive pitch strategy board for amateur squads to rehearse pressing traps and set-piece routines.',
    category: 'Football Ideas',
    status: 'Exploring',
    tags: ['football', 'tactics', 'canvas'],
    notes: 'Add physics-based pass velocity calculation.',
    createdAt: '2026-09-22T17:00:00Z',
  },
  {
    id: 'idea-3',
    title: 'Decentralized Micro-Grant Crowdfunder',
    description: 'Hyper-local funding platform for student engineering capstones and grassroots sports academies.',
    category: 'Startup Ideas',
    status: 'Idea',
    tags: ['fintech', 'students', 'community'],
    createdAt: '2026-09-24T11:00:00Z',
  },
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    title: 'Momentum in Full Swing & Database Deep Dive',
    content: 'Had a strong 4-hour focus rhythm today. Concluded the schema normalization and practiced complex queries. Running interval sprints in the evening restored mental clarity. Looking forward to completing the Lakshya capstone project tomorrow.',
    mood: 'great',
    productivityScore: 88,
    focusMinutes: 165,
    tasksCompleted: 4,
    accomplishments: [
      'Normalised database schema to 3NF',
      'Completed 4 deep work focus blocks',
      'Completed interval sprint session',
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_TIMEBLOCKS: TimeBlock[] = [
  { id: 'tb-1', taskId: 'task-1', title: 'Database ER-Diagram & SQL Work', date: new Date().toISOString().split('T')[0], startTime: '09:30', endTime: '11:00', color: '#f59e0b' },
  { id: 'tb-2', taskId: 'task-2', title: 'Lakshya Architecture & Testing', date: new Date().toISOString().split('T')[0], startTime: '13:00', endTime: '15:00', color: '#38bdf8' },
  { id: 'tb-3', taskId: 'task-3', title: 'Football Sprint Drills', date: new Date().toISOString().split('T')[0], startTime: '17:30', endTime: '18:30', color: '#10b981' },
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateDailyChallenges(dateStr: string): DailyChallenge[] {
  return [
    {
      id: `dc-tasks-${dateStr}`,
      title: 'Task Conqueror',
      description: 'Complete at least 3 tasks today',
      target: 3,
      current: 0,
      xpReward: 60,
      completed: false,
      type: 'tasks',
    },
    {
      id: `dc-focus-${dateStr}`,
      title: 'Deep Work Champion',
      description: 'Log 50 minutes of uninterrupted focus',
      target: 50,
      current: 0,
      xpReward: 80,
      completed: false,
      type: 'focus_time',
    },
    {
      id: `dc-habits-${dateStr}`,
      title: 'Habit Mastery',
      description: 'Check off at least 2 habits today',
      target: 2,
      current: 0,
      xpReward: 50,
      completed: false,
      type: 'habits',
    },
  ];
}

// Storage helpers with bulletproof error handling
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[Lakshya Storage] Failed to parse ${key}, using fallback:`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`[Lakshya Storage] Error saving to ${key}:`, err);
  }
}
