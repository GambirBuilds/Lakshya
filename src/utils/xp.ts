// Lakshya Gamification & XP Engine

export interface LevelInfo {
  level: number;
  title: 'Beginner' | 'Focused' | 'Productive' | 'Elite' | 'Master' | 'Legend';
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, maxXp: 300, title: 'Beginner' as const },
  { level: 2, minXp: 300, maxXp: 800, title: 'Focused' as const },
  { level: 3, minXp: 800, maxXp: 1600, title: 'Productive' as const },
  { level: 4, minXp: 1600, maxXp: 2800, title: 'Elite' as const },
  { level: 5, minXp: 2800, maxXp: 4500, title: 'Master' as const },
  { level: 6, minXp: 4500, maxXp: 99999, title: 'Legend' as const },
];

export function getLevelInfo(totalXp: number): LevelInfo {
  for (const tier of LEVEL_THRESHOLDS) {
    if (totalXp >= tier.minXp && (totalXp < tier.maxXp || tier.level === 6)) {
      const span = tier.maxXp - tier.minXp;
      const gainedInTier = totalXp - tier.minXp;
      const progressPercent = tier.level === 6 ? 100 : Math.min(100, Math.round((gainedInTier / span) * 100));
      return {
        level: tier.level,
        title: tier.title,
        currentLevelXp: gainedInTier,
        nextLevelXp: span,
        progressPercent,
      };
    }
  }
  return {
    level: 1,
    title: 'Beginner',
    currentLevelXp: 0,
    nextLevelXp: 300,
    progressPercent: 0,
  };
}

export const XP_REWARDS = {
  TASK_LOW: 15,
  TASK_MEDIUM: 25,
  TASK_HIGH: 45,
  TASK_URGENT: 65,
  FOCUS_SESSION_25: 35,
  FOCUS_SESSION_50: 75,
  FOCUS_SESSION_90: 140,
  HABIT_CHECK: 20,
  DAILY_TOP3_BONUS: 60,
  DAILY_CHALLENGE: 50,
  GOAL_MILESTONE: 80,
  GOAL_COMPLETED: 200,
  DAILY_REVIEW: 40,
} as const;
