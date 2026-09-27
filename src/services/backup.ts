import { STORAGE_KEYS, saveToStorage } from './storage';

export interface BackupPayload {
  version: string;
  exportedAt: string;
  app: string;
  author: string;
  section: string;
  submittedTo: string;
  data: {
    tasks: unknown[];
    projects: unknown[];
    goals: unknown[];
    milestones: unknown[];
    habits: unknown[];
    journal: unknown[];
    reviews: unknown[];
    ideas: unknown[];
    notes: unknown[];
    templates: unknown[];
    settings: unknown;
    xp: number;
    streaks: unknown;
    personalBests: unknown;
    garden: unknown[];
    challenges: unknown[];
    moods: unknown[];
    timeblocks: unknown[];
    achievements: unknown[];
    focusSessions: unknown[];
  };
}

export function exportBackupData(): void {
  try {
    const payload: BackupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      app: 'Lakshya — Aim. Focus. Achieve.',
      author: 'Gambir Jung Karki',
      section: 'F258',
      submittedTo: 'Prashant Bhattarai Sir',
      data: {
        tasks: JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]'),
        projects: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]'),
        goals: JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]'),
        milestones: JSON.parse(localStorage.getItem(STORAGE_KEYS.MILESTONES) || '[]'),
        habits: JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]'),
        journal: JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]'),
        reviews: JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]'),
        ideas: JSON.parse(localStorage.getItem(STORAGE_KEYS.IDEAS) || '[]'),
        notes: JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]'),
        templates: JSON.parse(localStorage.getItem(STORAGE_KEYS.TEMPLATES) || '[]'),
        settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
        xp: JSON.parse(localStorage.getItem(STORAGE_KEYS.XP) || '0'),
        streaks: JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAKS) || '{}'),
        personalBests: JSON.parse(localStorage.getItem(STORAGE_KEYS.PERSONAL_BESTS) || '{}'),
        garden: JSON.parse(localStorage.getItem(STORAGE_KEYS.GARDEN) || '[]'),
        challenges: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHALLENGES) || '[]'),
        moods: JSON.parse(localStorage.getItem(STORAGE_KEYS.MOODS) || '[]'),
        timeblocks: JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMEBLOCKS) || '[]'),
        achievements: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || '[]'),
        focusSessions: JSON.parse(localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS) || '[]'),
      },
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `lakshya-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export backup:', err);
    throw new Error('Could not create backup file. Please try again.');
  }
}

export interface BackupValidationResult {
  valid: boolean;
  error?: string;
  summary?: {
    tasksCount: number;
    projectsCount: number;
    goalsCount: number;
    habitsCount: number;
    notesCount: number;
    ideasCount: number;
    journalCount: number;
    exportedAt: string;
  };
  payload?: BackupPayload;
}

export function validateBackupFile(fileContent: string): BackupValidationResult {
  try {
    const parsed = JSON.parse(fileContent) as BackupPayload;
    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      return { valid: false, error: 'Invalid backup file structure: missing data payload' };
    }

    const { data } = parsed;
    if (!Array.isArray(data.tasks)) {
      return { valid: false, error: 'Invalid format: tasks list is missing or corrupted' };
    }

    return {
      valid: true,
      summary: {
        tasksCount: data.tasks.length,
        projectsCount: Array.isArray(data.projects) ? data.projects.length : 0,
        goalsCount: Array.isArray(data.goals) ? data.goals.length : 0,
        habitsCount: Array.isArray(data.habits) ? data.habits.length : 0,
        notesCount: Array.isArray(data.notes) ? data.notes.length : 0,
        ideasCount: Array.isArray(data.ideas) ? data.ideas.length : 0,
        journalCount: Array.isArray(data.journal) ? data.journal.length : 0,
        exportedAt: parsed.exportedAt || 'Unknown date',
      },
      payload: parsed,
    };
  } catch (e) {
    return { valid: false, error: `JSON Parse error: ${(e as Error).message}` };
  }
}

export function restoreBackupData(payload: BackupPayload): void {
  const d = payload.data;
  if (d.tasks) saveToStorage(STORAGE_KEYS.TASKS, d.tasks);
  if (d.projects) saveToStorage(STORAGE_KEYS.PROJECTS, d.projects);
  if (d.goals) saveToStorage(STORAGE_KEYS.GOALS, d.goals);
  if (d.milestones) saveToStorage(STORAGE_KEYS.MILESTONES, d.milestones);
  if (d.habits) saveToStorage(STORAGE_KEYS.HABITS, d.habits);
  if (d.journal) saveToStorage(STORAGE_KEYS.JOURNAL, d.journal);
  if (d.reviews) saveToStorage(STORAGE_KEYS.REVIEWS, d.reviews);
  if (d.ideas) saveToStorage(STORAGE_KEYS.IDEAS, d.ideas);
  if (d.notes) saveToStorage(STORAGE_KEYS.NOTES, d.notes);
  if (d.templates) saveToStorage(STORAGE_KEYS.TEMPLATES, d.templates);
  if (d.settings) saveToStorage(STORAGE_KEYS.SETTINGS, d.settings);
  if (d.xp !== undefined) saveToStorage(STORAGE_KEYS.XP, d.xp);
  if (d.streaks) saveToStorage(STORAGE_KEYS.STREAKS, d.streaks);
  if (d.personalBests) saveToStorage(STORAGE_KEYS.PERSONAL_BESTS, d.personalBests);
  if (d.garden) saveToStorage(STORAGE_KEYS.GARDEN, d.garden);
  if (d.challenges) saveToStorage(STORAGE_KEYS.CHALLENGES, d.challenges);
  if (d.moods) saveToStorage(STORAGE_KEYS.MOODS, d.moods);
  if (d.timeblocks) saveToStorage(STORAGE_KEYS.TIMEBLOCKS, d.timeblocks);
  if (d.achievements) saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, d.achievements);
  if (d.focusSessions) saveToStorage(STORAGE_KEYS.FOCUS_SESSIONS, d.focusSessions);
}
