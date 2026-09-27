import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  Achievement,
  ToastMessage,
  FocusSession,
  Priority,
  EisenhowerQuadrant,
  MoodType,
} from '../types';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_PERSONAL_BESTS,
  DEFAULT_TEMPLATES,
  DEFAULT_ACHIEVEMENTS,
  INITIAL_PROJECTS,
  INITIAL_GOALS,
  INITIAL_MILESTONES,
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_GARDEN,
  INITIAL_STICKY_NOTES,
  INITIAL_IDEAS,
  INITIAL_JOURNAL,
  INITIAL_TIMEBLOCKS,
  generateDailyChallenges,
  getTodayDateString,
  loadFromStorage,
  saveToStorage,
} from '../services/storage';
import { audioService } from '../services/audio';
import { getLevelInfo, XP_REWARDS, LevelInfo } from '../utils/xp';
import { calculateDailyProductivityScore } from '../utils/productivity';
import { fireConfetti } from '../utils/confetti';

export type AppPage =
  | 'dashboard'
  | 'tasks'
  | 'projects'
  | 'calendar'
  | 'goals'
  | 'eisenhower'
  | 'focus'
  | 'garden'
  | 'habits'
  | 'achievements'
  | 'analytics'
  | 'journal'
  | 'braindump'
  | 'ideavault'
  | 'notes'
  | 'templates'
  | 'cleanup'
  | 'settings';

interface AppContextType {
  // Navigation
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;

  // Tasks
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'actualDuration'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleDailyTop3: (id: string) => void;
  setTaskQuadrant: (id: string, quadrant: EisenhowerQuadrant) => void;
  selectedTaskForEdit: Task | null;
  setSelectedTaskForEdit: (t: Task | null) => void;

  // Projects & Goals
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  milestones: Milestone[];
  addMilestone: (m: Omit<Milestone, 'id'>) => Milestone;
  toggleMilestone: (id: string) => void;
  deleteMilestone: (id: string) => void;

  // Habits
  habits: Habit[];
  addHabit: (h: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'logs' | 'createdAt'>) => Habit;
  toggleHabitToday: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  // Focus & Timer
  activeFocusTask: Task | null;
  setActiveFocusTask: (t: Task | null) => void;
  timerMode: 'work' | 'break';
  timerSecondsLeft: number;
  isTimerRunning: boolean;
  sessionCount: number;
  todayFocusMinutes: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  setCustomTimer: (workMins: number, breakMins: number) => void;
  focusSessions: FocusSession[];

  // Focus Garden
  plants: GardenPlant[];

  // Gamification & Streaks
  xp: number;
  addXp: (amount: number, reason: string) => void;
  levelInfo: LevelInfo;
  personalBests: PersonalBests;
  dailyChallenges: DailyChallenge[];
  claimChallengeReward: (id: string) => void;
  achievements: Achievement[];

  // Moods & Journal & Reviews
  moods: MoodEntry[];
  logTodayMood: (mood: MoodType, note?: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  dailyReviews: DailyReview[];
  saveDailyReview: (review: Omit<DailyReview, 'id' | 'createdAt'>) => void;

  // Brain Dump, Notes, Ideas
  brainDumpText: string;
  setBrainDumpText: (t: string) => void;
  stickyNotes: StickyNote[];
  addStickyNote: (note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;

  ideas: IdeaItem[];
  addIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, updates: Partial<IdeaItem>) => void;
  deleteIdea: (id: string) => void;
  convertIdeaToTask: (ideaId: string) => void;
  convertIdeaToProject: (ideaId: string) => void;

  // Time Blocking
  timeBlocks: TimeBlock[];
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  deleteTimeBlock: (id: string) => void;

  // Templates
  templates: TaskTemplate[];
  applyTemplate: (templateId: string) => void;

  // Settings & Theme
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Audio Player
  isAudioPlaying: boolean;
  currentTrackId: string | null;
  audioVolume: number;
  playTrack: (trackId: string) => void;
  toggleAudio: () => void;
  setAudioVolume: (vol: number) => void;

  // UI Modals & Popups
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isKeyboardHelpOpen: boolean;
  setKeyboardHelpOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  isMorningModalOpen: boolean;
  setMorningModalOpen: (open: boolean) => void;
  isNightModalOpen: boolean;
  setNightModalOpen: (open: boolean) => void;
  isOverdueRecoveryOpen: boolean;
  setOverdueRecoveryOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  isMusicModalOpen: boolean;
  setMusicModalOpen: (open: boolean) => void;
  isDistractionFree: boolean;
  setDistractionFree: (open: boolean) => void;
  levelUpModalInfo: { show: boolean; level: number; title: string } | null;
  setLevelUpModalInfo: (info: { show: boolean; level: number; title: string } | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Quick Action Helpers
  startFocusWithTask: (task: Task) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  // Persistence States
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS));
  const [goals, setGoals] = useState<Goal[]>(() => loadFromStorage(STORAGE_KEYS.GOALS, INITIAL_GOALS));
  const [milestones, setMilestones] = useState<Milestone[]>(() => loadFromStorage(STORAGE_KEYS.MILESTONES, INITIAL_MILESTONES));
  const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage(STORAGE_KEYS.HABITS, INITIAL_HABITS));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => loadFromStorage(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL));
  const [dailyReviews, setDailyReviews] = useState<DailyReview[]>(() => loadFromStorage(STORAGE_KEYS.REVIEWS, []));
  const [ideas, setIdeas] = useState<IdeaItem[]>(() => loadFromStorage(STORAGE_KEYS.IDEAS, INITIAL_IDEAS));
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(() => loadFromStorage(STORAGE_KEYS.NOTES, INITIAL_STICKY_NOTES));
  const [templates] = useState<TaskTemplate[]>(() => loadFromStorage(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES));
  const [settings, setSettings] = useState<AppSettings>(() => loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
  const [xp, setXp] = useState<number>(() => loadFromStorage(STORAGE_KEYS.XP, 350));
  const [personalBests, setPersonalBests] = useState<PersonalBests>(() => loadFromStorage(STORAGE_KEYS.PERSONAL_BESTS, DEFAULT_PERSONAL_BESTS));
  const [plants, setPlants] = useState<GardenPlant[]>(() => loadFromStorage(STORAGE_KEYS.GARDEN, INITIAL_GARDEN));
  const [moods, setMoods] = useState<MoodEntry[]>(() => loadFromStorage(STORAGE_KEYS.MOODS, []));
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => loadFromStorage(STORAGE_KEYS.TIMEBLOCKS, INITIAL_TIMEBLOCKS));
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => loadFromStorage(STORAGE_KEYS.FOCUS_SESSIONS, []));
  const [brainDumpText, setBrainDumpTextState] = useState<string>(() => loadFromStorage(STORAGE_KEYS.BRAIN_DUMP, ''));

  // Challenges initialized per today
  const todayStr = getTodayDateString();
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => {
    const saved = loadFromStorage<DailyChallenge[]>(`${STORAGE_KEYS.CHALLENGES}_${todayStr}`, []);
    if (saved && saved.length > 0) return saved;
    return generateDailyChallenges(todayStr);
  });

  // Focus Timer States
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [timerDuration, setTimerDuration] = useState<number>(settings.workDuration * 60);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(settings.workDuration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);

  // Audio States
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>('deep-focus');
  const [audioVolume, setAudioVolumeState] = useState<number>(0.5);

  // UI Modals
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isKeyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [isMorningModalOpen, setMorningModalOpen] = useState(false);
  const [isNightModalOpen, setNightModalOpen] = useState(false);
  const [isOverdueRecoveryOpen, setOverdueRecoveryOpen] = useState(false);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isMusicModalOpen, setMusicModalOpen] = useState(false);
  const [isDistractionFree, setDistractionFree] = useState(false);
  const [levelUpModalInfo, setLevelUpModalInfo] = useState<{ show: boolean; level: number; title: string } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to Storage on changes
  useEffect(() => saveToStorage(STORAGE_KEYS.TASKS, tasks), [tasks]);
  useEffect(() => saveToStorage(STORAGE_KEYS.PROJECTS, projects), [projects]);
  useEffect(() => saveToStorage(STORAGE_KEYS.GOALS, goals), [goals]);
  useEffect(() => saveToStorage(STORAGE_KEYS.MILESTONES, milestones), [milestones]);
  useEffect(() => saveToStorage(STORAGE_KEYS.HABITS, habits), [habits]);
  useEffect(() => saveToStorage(STORAGE_KEYS.JOURNAL, journalEntries), [journalEntries]);
  useEffect(() => saveToStorage(STORAGE_KEYS.REVIEWS, dailyReviews), [dailyReviews]);
  useEffect(() => saveToStorage(STORAGE_KEYS.IDEAS, ideas), [ideas]);
  useEffect(() => saveToStorage(STORAGE_KEYS.NOTES, stickyNotes), [stickyNotes]);
  useEffect(() => saveToStorage(STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => saveToStorage(STORAGE_KEYS.XP, xp), [xp]);
  useEffect(() => saveToStorage(STORAGE_KEYS.PERSONAL_BESTS, personalBests), [personalBests]);
  useEffect(() => saveToStorage(STORAGE_KEYS.GARDEN, plants), [plants]);
  useEffect(() => saveToStorage(STORAGE_KEYS.MOODS, moods), [moods]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TIMEBLOCKS, timeBlocks), [timeBlocks]);
  useEffect(() => saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements), [achievements]);
  useEffect(() => saveToStorage(STORAGE_KEYS.FOCUS_SESSIONS, focusSessions), [focusSessions]);
  useEffect(() => saveToStorage(`${STORAGE_KEYS.CHALLENGES}_${todayStr}`, dailyChallenges), [dailyChallenges, todayStr]);

  const setBrainDumpText = (txt: string) => {
    setBrainDumpTextState(txt);
    saveToStorage(STORAGE_KEYS.BRAIN_DUMP, txt);
  };

  // Toast dispatch
  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...msg, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, msg.duration || 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Level & XP Management
  const levelInfo = useMemo(() => getLevelInfo(xp), [xp]);

  const addXp = useCallback(
    (amount: number, reason: string) => {
      setXp((prev) => {
        const nextXp = prev + amount;
        const currentTier = getLevelInfo(prev);
        const nextTier = getLevelInfo(nextXp);

        if (nextTier.level > currentTier.level) {
          // Level up!
          audioService.playChime('level_up');
          fireConfetti(3000);
          setLevelUpModalInfo({ show: true, level: nextTier.level, title: nextTier.title });
          addToast({
            type: 'achievement',
            title: `Ascended to Level ${nextTier.level} — ${nextTier.title}!`,
            message: `Congratulations! Your momentum reached a new milestone.`,
          });
        } else {
          addToast({
            type: 'info',
            title: `+${amount} XP`,
            message: reason,
            duration: 2200,
          });
        }
        return nextXp;
      });
    },
    [addToast]
  );

  // Audio Controls
  const playTrack = useCallback((trackId: string) => {
    audioService.playTrack(trackId);
    setCurrentTrackId(trackId);
    setIsAudioPlaying(true);
  }, []);

  const toggleAudio = useCallback(() => {
    if (isAudioPlaying) {
      audioService.stop();
      setIsAudioPlaying(false);
    } else {
      if (currentTrackId) {
        audioService.playTrack(currentTrackId);
      } else {
        audioService.playTrack('deep-focus');
        setCurrentTrackId('deep-focus');
      }
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying, currentTrackId]);

  const setAudioVolume = (vol: number) => {
    setAudioVolumeState(vol);
    audioService.setVolume(vol);
  };

  // Focus Timer Logic
  const todayFocusMinutes = useMemo(() => {
    const today = getTodayDateString();
    return focusSessions
      .filter((s) => s.completedAt.startsWith(today))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [focusSessions]);

  const handleSessionCompleted = useCallback(() => {
    audioService.playChime('complete');
    fireConfetti(2500);

    const minutes = Math.round(timerDuration / 60);

    if (timerMode === 'work') {
      const xpEarned = minutes >= 90 ? XP_REWARDS.FOCUS_SESSION_90 : minutes >= 50 ? XP_REWARDS.FOCUS_SESSION_50 : XP_REWARDS.FOCUS_SESSION_25;
      
      const newSession: FocusSession = {
        id: `fs-${Date.now()}`,
        taskId: activeFocusTask?.id,
        taskTitle: activeFocusTask?.title || 'Deep Focus Session',
        durationMinutes: minutes,
        type: 'work',
        completedAt: new Date().toISOString(),
        xpEarned,
      };

      setFocusSessions((prev) => [newSession, ...prev]);
      setSessionCount((prev) => prev + 1);

      // Award XP
      addXp(xpEarned, `Completed ${minutes}m Focus Session`);

      // Update Garden
      setPlants((prev) => {
        if (prev.length === 0) return INITIAL_GARDEN;
        const updated = [...prev];
        const target = updated[updated.length - 1];
        target.sessionCount += 1;
        target.totalMinutes += minutes;
        target.lastWatered = new Date().toISOString();

        if (target.totalMinutes >= 200) target.stage = 'ancient_tree';
        else if (target.totalMinutes >= 120) target.stage = 'tree';
        else if (target.totalMinutes >= 60) target.stage = 'sapling';
        else if (target.totalMinutes >= 35) target.stage = 'plant';
        else if (target.totalMinutes >= 15) target.stage = 'sprout';

        return updated;
      });

      // Update Task actual duration if linked
      if (activeFocusTask) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeFocusTask.id
              ? { ...t, actualDuration: t.actualDuration + minutes, updatedAt: new Date().toISOString() }
              : t
          )
        );
      }

      // Update challenges
      setDailyChallenges((prev) =>
        prev.map((c) => {
          if (c.type === 'focus_time') {
            const nextVal = c.current + minutes;
            const completed = nextVal >= c.target;
            return { ...c, current: nextVal, completed };
          }
          return c;
        })
      );

      // Check Personal Best for focus
      setPersonalBests((prev) => {
        if (minutes > prev.longestFocusSessionMinutes) {
          addToast({
            type: 'achievement',
            title: 'New Personal Best!',
            message: `Longest Focus Session: ${minutes} minutes!`,
          });
          return { ...prev, longestFocusSessionMinutes: minutes };
        }
        return prev;
      });

      // Switch to break
      setTimerMode('break');
      const breakSecs = (sessionCount + 1) % 4 === 0 ? settings.longBreakDuration * 60 : settings.breakDuration * 60;
      setTimerDuration(breakSecs);
      setTimerSecondsLeft(breakSecs);
      setIsTimerRunning(settings.autoStartBreaks);

      addToast({
        type: 'success',
        title: 'Deep Work Block Completed!',
        message: `Great job! Take a well-deserved ${Math.round(breakSecs / 60)}-minute break.`,
      });
    } else {
      // Break completed
      setTimerMode('work');
      const workSecs = settings.workDuration * 60;
      setTimerDuration(workSecs);
      setTimerSecondsLeft(workSecs);
      setIsTimerRunning(settings.autoStartFocus);

      addToast({
        type: 'info',
        title: 'Break Over!',
        message: 'Ready to dive back into the flow?',
      });
    }
  }, [
    timerDuration,
    timerMode,
    activeFocusTask,
    sessionCount,
    settings,
    addXp,
    addToast,
  ]);

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = window.setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft, handleSessionCompleted]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerDuration);
  };
  const skipTimer = () => {
    setIsTimerRunning(false);
    handleSessionCompleted();
  };

  const setCustomTimer = (workMins: number, breakMins: number) => {
    setIsTimerRunning(false);
    setTimerMode('work');
    const secs = workMins * 60;
    setTimerDuration(secs);
    setTimerSecondsLeft(secs);
    setSettings((prev) => ({ ...prev, workDuration: workMins, breakDuration: breakMins }));
  };

  const startFocusWithTask = (task: Task) => {
    setActiveFocusTask(task);
    setCurrentPage('focus');
    setTimerMode('work');
    const secs = settings.workDuration * 60;
    setTimerDuration(secs);
    setTimerSecondsLeft(secs);
    setIsTimerRunning(true);
    if (!isAudioPlaying && settings.soundEnabled) {
      playTrack('deep-focus');
    }
    addToast({
      type: 'info',
      title: 'Focus Initialized',
      message: `Locked in: "${task.title}"`,
    });
  };

  // Task Operations
  const createTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'actualDuration'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      actualDuration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast({ type: 'success', title: 'Task Created', message: newTask.title });
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast({ type: 'info', title: 'Task Removed' });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isDone = t.status === 'completed';
        const nextStatus = isDone ? 'todo' : 'completed';
        const completedAt = isDone ? undefined : new Date().toISOString();

        if (!isDone) {
          audioService.playChime('task_done');
          // Award XP based on priority
          const xpGained =
            t.priority === 'urgent'
              ? XP_REWARDS.TASK_URGENT
              : t.priority === 'high'
              ? XP_REWARDS.TASK_HIGH
              : t.priority === 'medium'
              ? XP_REWARDS.TASK_MEDIUM
              : XP_REWARDS.TASK_LOW;

          addXp(xpGained, `Completed task: ${t.title}`);

          // Update daily challenge
          setDailyChallenges((challs) =>
            challs.map((c) => {
              if (c.type === 'tasks') {
                const n = c.current + 1;
                return { ...c, current: n, completed: n >= c.target };
              }
              return c;
            })
          );
        }

        return { ...t, status: nextStatus, completedAt, updatedAt: new Date().toISOString() };
      })
    );
  };

  const toggleDailyTop3 = (id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      const willBeTop3 = !target.isDailyTop3;
      const currentTop3Count = prev.filter((t) => t.isDailyTop3 && t.id !== id).length;

      if (willBeTop3 && currentTop3Count >= 3) {
        addToast({ type: 'warning', title: 'Daily Top 3 Limit', message: 'You can only have 3 primary priorities. Deselect one first.' });
        return prev;
      }

      return prev.map((t) => (t.id === id ? { ...t, isDailyTop3: willBeTop3 } : t));
    });
  };

  const setTaskQuadrant = (id: string, quadrant: EisenhowerQuadrant) => {
    updateTask(id, { quadrant });
  };

  // Habit operations
  const toggleHabitToday = (id: string) => {
    const today = getTodayDateString();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const alreadyDone = !!h.logs[today];
        const nextLogs = { ...h.logs, [today]: !alreadyDone };
        let nextStreak = h.currentStreak;

        if (!alreadyDone) {
          audioService.playChime('task_done');
          nextStreak += 1;
          addXp(XP_REWARDS.HABIT_CHECK, `Habit completed: ${h.name}`);

          setDailyChallenges((challs) =>
            challs.map((c) => {
              if (c.type === 'habits') {
                const n = c.current + 1;
                return { ...c, current: n, completed: n >= c.target };
              }
              return c;
            })
          );
        } else {
          nextStreak = Math.max(0, nextStreak - 1);
        }

        const nextBest = Math.max(h.bestStreak, nextStreak);
        return { ...h, logs: nextLogs, currentStreak: nextStreak, bestStreak: nextBest };
      })
    );
  };

  const addHabit = (h: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'logs' | 'createdAt'>): Habit => {
    const newHabit: Habit = {
      ...h,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      bestStreak: 0,
      logs: {},
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    addToast({ type: 'success', title: 'Habit Initialized', message: newHabit.name });
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    addToast({ type: 'info', title: 'Habit Deleted' });
  };

  // Projects
  const addProject = (proj: Omit<Project, 'id' | 'createdAt'>): Project => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProj]);
    addToast({ type: 'success', title: 'Project Created', message: newProj.name });
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast({ type: 'info', title: 'Project Deleted' });
  };

  // Goals & Milestones
  const addGoal = (g: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      ...g,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    addToast({ type: 'success', title: 'Lakshya Goal Set', message: newGoal.title });
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setMilestones((prev) => prev.filter((m) => m.goalId !== id));
    addToast({ type: 'info', title: 'Goal Removed' });
  };

  const addMilestone = (m: Omit<Milestone, 'id'>): Milestone => {
    const newM: Milestone = { ...m, id: `milestone-${Date.now()}` };
    setMilestones((prev) => [...prev, newM]);
    return newM;
  };

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextState = !m.completed;
        if (nextState) {
          audioService.playChime('task_done');
          addXp(XP_REWARDS.GOAL_MILESTONE, `Completed Milestone: ${m.title}`);
        }
        return {
          ...m,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const deleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Challenges claim
  const claimChallengeReward = (id: string) => {
    const ch = dailyChallenges.find((c) => c.id === id);
    if (!ch || !ch.completed) return;
    addXp(ch.xpReward, `Completed challenge: ${ch.title}`);
    fireConfetti(2000);
    setDailyChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  // Moods
  const logTodayMood = (mood: MoodType, note?: string) => {
    const today = getTodayDateString();
    const newEntry: MoodEntry = {
      date: today,
      mood,
      note,
      timestamp: new Date().toISOString(),
    };
    setMoods((prev) => [newEntry, ...prev.filter((m) => m.date !== today)]);
    addToast({ type: 'success', title: 'Mood Recorded', message: `Today feeling ${mood}` });
  };

  // Journal
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    addXp(30, 'Reflection written in Journal');
    addToast({ type: 'success', title: 'Journal Saved' });
  };

  // Daily Shutdown / Night Review
  const saveDailyReview = (review: Omit<DailyReview, 'id' | 'createdAt'>) => {
    const newRev: DailyReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDailyReviews((prev) => [newRev, ...prev]);
    addXp(XP_REWARDS.DAILY_REVIEW, 'Completed Daily Shutdown Review');
    fireConfetti(3000);
    audioService.playChime('complete');
    addToast({ type: 'success', title: 'Daily Shutdown Completed', message: 'Rest well! Tomorrow is primed for victory.' });
  };

  // Sticky notes
  const addStickyNote = (note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: StickyNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStickyNotes((prev) => [newNote, ...prev]);
  };

  const updateStickyNote = (id: string, updates: Partial<StickyNote>) => {
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Ideas
  const addIdea = (idea: Omit<IdeaItem, 'id' | 'createdAt'>) => {
    const newIdea: IdeaItem = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setIdeas((prev) => [newIdea, ...prev]);
    addToast({ type: 'success', title: 'Idea Captured in Vault', message: newIdea.title });
  };

  const updateIdea = (id: string, updates: Partial<IdeaItem>) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  const convertIdeaToTask = (ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    createTask({
      title: idea.title,
      description: idea.description,
      priority: 'high',
      category: idea.category.replace(' Ideas', ''),
      tags: [...idea.tags, 'from-idea'],
      estimatedDuration: 45,
      subtasks: [],
      recurrence: 'none',
      status: 'todo',
      quadrant: 'schedule',
    });
    updateIdea(ideaId, { status: 'Planning' });
    addToast({ type: 'success', title: 'Converted to Task', message: `"${idea.title}" is now actionable!` });
  };

  const convertIdeaToProject = (ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    addProject({
      name: idea.title,
      description: idea.description,
      color: '#f59e0b',
      icon: 'Lightbulb',
      status: 'active',
    });
    updateIdea(ideaId, { status: 'Building' });
    addToast({ type: 'success', title: 'Project Initiated', message: `Created project from "${idea.title}"` });
  };

  // Time Blocking
  const addTimeBlock = (block: Omit<TimeBlock, 'id'>) => {
    const newBlock: TimeBlock = { ...block, id: `tb-${Date.now()}` };
    setTimeBlocks((prev) => [...prev, newBlock]);
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Templates
  const applyTemplate = (templateId: string) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl) return;
    tmpl.tasks.forEach((item, idx) => {
      createTask({
        title: item.title,
        priority: item.priority,
        category: tmpl.category,
        tags: [tmpl.category.toLowerCase().replace(/\s+/g, '-')],
        dueDate: getTodayDateString(),
        estimatedDuration: item.estimatedDuration,
        subtasks: item.subtasks ? item.subtasks.map((st, i) => ({ id: `st-${Date.now()}-${idx}-${i}`, title: st, completed: false })) : [],
        recurrence: 'none',
        status: 'todo',
        quadrant: item.priority === 'urgent' ? 'do_now' : 'schedule',
      });
    });
    addToast({ type: 'success', title: 'Template Applied', message: `Instantiated ${tmpl.tasks.length} tasks from ${tmpl.title}` });
  };

  // Settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Ctrl + Shift + F: Distraction-free mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setDistractionFree((prev) => !prev);
        return;
      }

      // Ctrl + K or Cmd + K: Command Palette
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setSelectedTaskForEdit(null);
        setTaskModalOpen(true);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setCurrentPage('focus');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setCurrentPage('dashboard');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setNightModalOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMusicModalOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setKeyboardHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        tasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        toggleDailyTop3,
        setTaskQuadrant,
        selectedTaskForEdit,
        setSelectedTaskForEdit,
        projects,
        addProject,
        updateProject,
        deleteProject,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        milestones,
        addMilestone,
        toggleMilestone,
        deleteMilestone,
        habits,
        addHabit,
        toggleHabitToday,
        updateHabit,
        deleteHabit,
        activeFocusTask,
        setActiveFocusTask,
        timerMode,
        timerSecondsLeft,
        isTimerRunning,
        sessionCount,
        todayFocusMinutes,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        setCustomTimer,
        focusSessions,
        plants,
        xp,
        addXp,
        levelInfo,
        personalBests,
        dailyChallenges,
        claimChallengeReward,
        achievements,
        moods,
        logTodayMood,
        journalEntries,
        addJournalEntry,
        dailyReviews,
        saveDailyReview,
        brainDumpText,
        setBrainDumpText,
        stickyNotes,
        addStickyNote,
        updateStickyNote,
        deleteStickyNote,
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        convertIdeaToTask,
        convertIdeaToProject,
        timeBlocks,
        addTimeBlock,
        deleteTimeBlock,
        templates,
        applyTemplate,
        settings,
        updateSettings,
        isAudioPlaying,
        currentTrackId,
        audioVolume,
        playTrack,
        toggleAudio,
        setAudioVolume,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isKeyboardHelpOpen,
        setKeyboardHelpOpen,
        isTaskModalOpen,
        setTaskModalOpen,
        isMorningModalOpen,
        setMorningModalOpen,
        isNightModalOpen,
        setNightModalOpen,
        isOverdueRecoveryOpen,
        setOverdueRecoveryOpen,
        isVoiceModalOpen,
        setVoiceModalOpen,
        isMusicModalOpen,
        setMusicModalOpen,
        isDistractionFree,
        setDistractionFree,
        levelUpModalInfo,
        setLevelUpModalInfo,
        toasts,
        addToast,
        removeToast,
        startFocusWithTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
