// Date handling utilities for Lakshya

export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return 'No date';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(d);
      target.setHours(0, 0, 0, 0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
      if (diffDays <= 6) {
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function isDateOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      target.setHours(0, 0, 0, 0);
      return target.getTime() < today.getTime();
    }
    return false;
  } catch {
    return false;
  }
}

export function isDateToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const todayStr = formatDateToYYYYMMDD(new Date());
  return dateStr === todayStr;
}

export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  let greet = 'Good evening';
  if (hour < 12) greet = 'Good morning';
  else if (hour < 17) greet = 'Good afternoon';
  return name ? `${greet}, ${name.split(' ')[0]}` : greet;
}
