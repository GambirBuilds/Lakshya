import { Task, Habit, FocusSession } from '../types';
import { formatDateToYYYYMMDD } from './dates';

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // total activity count
  level: 0 | 1 | 2 | 3 | 4;
  tasksCompleted: number;
  focusMinutes: number;
  habitsChecked: number;
}

export function buildActivityHeatmap(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  weeks = 16
): HeatmapDay[] {
  const dayMap: Record<string, { tasks: number; focus: number; habits: number }> = {};

  // Aggregate tasks
  tasks.forEach((t) => {
    if (t.status === 'completed' && t.completedAt) {
      const d = t.completedAt.split('T')[0];
      if (!dayMap[d]) dayMap[d] = { tasks: 0, focus: 0, habits: 0 };
      dayMap[d].tasks += 1;
    }
  });

  // Aggregate focus sessions
  focusSessions.forEach((s) => {
    const d = s.completedAt.split('T')[0];
    if (!dayMap[d]) dayMap[d] = { tasks: 0, focus: 0, habits: 0 };
    dayMap[d].focus += s.durationMinutes;
  });

  // Aggregate habits
  habits.forEach((h) => {
    Object.keys(h.logs).forEach((d) => {
      if (h.logs[d]) {
        if (!dayMap[d]) dayMap[d] = { tasks: 0, focus: 0, habits: 0 };
        dayMap[d].habits += 1;
      }
    });
  });

  const days: HeatmapDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = weeks * 7;
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - totalDays + 1);

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = formatDateToYYYYMMDD(d);
    const rec = dayMap[dateStr] || { tasks: 0, focus: 0, habits: 0 };

    // Activity points
    const activityPoints = rec.tasks * 2 + Math.floor(rec.focus / 25) * 2 + rec.habits;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (activityPoints >= 8) level = 4;
    else if (activityPoints >= 5) level = 3;
    else if (activityPoints >= 3) level = 2;
    else if (activityPoints >= 1) level = 1;

    days.push({
      date: dateStr,
      count: activityPoints,
      level,
      tasksCompleted: rec.tasks,
      focusMinutes: rec.focus,
      habitsChecked: rec.habits,
    });
  }

  return days;
}

export function calculateCurrentStreak(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[]
): { current: number; best: number } {
  const activeDates = new Set<string>();

  tasks.forEach((t) => {
    if (t.status === 'completed' && t.completedAt) {
      activeDates.add(t.completedAt.split('T')[0]);
    }
  });

  focusSessions.forEach((s) => {
    activeDates.add(s.completedAt.split('T')[0]);
  });

  habits.forEach((h) => {
    Object.keys(h.logs).forEach((d) => {
      if (h.logs[d]) activeDates.add(d);
    });
  });

  const today = new Date();
  const todayStr = formatDateToYYYYMMDD(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateToYYYYMMDD(yesterday);

  let current = 0;
  // If active today, count backwards from today; if not active today yet, check yesterday
  let checkDate = activeDates.has(todayStr) ? new Date(today) : new Date(yesterday);

  if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
    return { current: 0, best: 14 }; // fallback baseline
  }

  while (true) {
    const ds = formatDateToYYYYMMDD(checkDate);
    if (activeDates.has(ds)) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    current: Math.max(1, current),
    best: Math.max(14, current),
  };
}
