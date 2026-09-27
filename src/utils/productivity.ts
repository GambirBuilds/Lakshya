import { Task, Habit, FocusSession } from '../types';
import { isDateOverdue, isDateToday, formatDateToYYYYMMDD } from './dates';

export interface ProductivityBreakdown {
  score: number; // 0 - 100
  taskScore: number;
  focusScore: number;
  habitScore: number;
  tasksCompletedToday: number;
  focusMinutesToday: number;
  habitsCompletedToday: number;
}

export function calculateDailyProductivityScore(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[]
): ProductivityBreakdown {
  const todayStr = formatDateToYYYYMMDD(new Date());

  // Completed tasks today
  const completedToday = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    return t.completedAt.startsWith(todayStr);
  });

  // Focus time today
  const focusToday = focusSessions.filter((s) => s.completedAt.startsWith(todayStr));
  const focusMinutes = focusToday.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Habits completed today
  const habitsDone = habits.filter((h) => !!h.logs[todayStr]);

  // Scoring weights:
  // - Tasks: max 40 pts (up to 4 tasks = 10 pts each, bonus for urgent/high)
  let taskPoints = 0;
  completedToday.forEach((t) => {
    if (t.priority === 'urgent') taskPoints += 12;
    else if (t.priority === 'high') taskPoints += 10;
    else if (t.priority === 'medium') taskPoints += 8;
    else taskPoints += 6;
  });
  const normalizedTaskScore = Math.min(40, taskPoints);

  // - Focus Time: max 35 pts (60 mins = ~25 pts, 90 mins = 35 pts)
  const normalizedFocusScore = Math.min(35, Math.round((focusMinutes / 90) * 35));

  // - Habits: max 25 pts (e.g. 3 habits = 25 pts)
  const habitTarget = Math.max(1, habits.length);
  const normalizedHabitScore = Math.min(25, Math.round((habitsDone.length / habitTarget) * 25));

  const totalScore = Math.min(100, normalizedTaskScore + normalizedFocusScore + normalizedHabitScore);

  return {
    score: totalScore,
    taskScore: normalizedTaskScore,
    focusScore: normalizedFocusScore,
    habitScore: normalizedHabitScore,
    tasksCompletedToday: completedToday.length,
    focusMinutesToday: focusMinutes,
    habitsCompletedToday: habitsDone.length,
  };
}

export interface SmartPriorityResult {
  task: Task;
  score: number;
  reasons: string[];
}

export function calculateFocusNextTask(tasks: Task[]): SmartPriorityResult | null {
  const openTasks = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress');
  if (openTasks.length === 0) return null;

  const scored = openTasks.map((t) => {
    let score = 0;
    const reasons: string[] = [];

    // Daily Top 3
    if (t.isDailyTop3) {
      score += 40;
      reasons.push('Selected in Daily Top 3 priorities');
    }

    // Overdue or Due Today
    if (isDateOverdue(t.dueDate)) {
      score += 50;
      reasons.push('Overdue — needs urgent attention');
    } else if (isDateToday(t.dueDate)) {
      score += 35;
      reasons.push('Due today');
    }

    // Priority
    if (t.priority === 'urgent') {
      score += 35;
      reasons.push('Urgent priority');
    } else if (t.priority === 'high') {
      score += 25;
      reasons.push('High priority');
    } else if (t.priority === 'medium') {
      score += 10;
    }

    // Eisenhower quadrant
    if (t.quadrant === 'do_now') {
      score += 20;
      reasons.push('Classified in Do Now quadrant');
    }

    // In Progress
    if (t.status === 'in_progress') {
      score += 15;
      reasons.push('Already in progress');
    }

    // Connected to project
    if (t.projectId) {
      score += 10;
      reasons.push('Connected to active project milestone');
    }

    // Ideal duration for a focus block (20 - 90 min)
    if (t.estimatedDuration >= 25 && t.estimatedDuration <= 90) {
      score += 10;
      reasons.push(`Estimated ${t.estimatedDuration}m fits a deep work block`);
    }

    return {
      task: t,
      score,
      reasons: reasons.slice(0, 4), // max 4 crisp reasons
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}
