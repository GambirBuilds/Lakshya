import { Priority } from '../types';

export interface ParsedTaskResult {
  title: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  tags: string[];
  estimatedDuration: number; // in minutes
  category?: string;
}

export function parseNaturalLanguageTask(input: string): ParsedTaskResult {
  let text = input.trim();
  let priority: Priority = 'medium';
  let estimatedDuration = 30; // default 30 mins
  let dueDate: string | undefined = undefined;
  let dueTime: string | undefined = undefined;
  const tags: string[] = [];

  // Extract tags: #tagname
  const tagMatches = text.match(/#(\w+)/g);
  if (tagMatches) {
    tagMatches.forEach((t) => tags.push(t.replace('#', '').toLowerCase()));
    text = text.replace(/#(\w+)/g, '');
  }

  // Extract priority markers: !urgent, !high, high priority, urgent, etc.
  if (/\b(!urgent|urgent|asap|critical)\b/i.test(text)) {
    priority = 'urgent';
    text = text.replace(/\b(!urgent|urgent|asap|critical)\b/gi, '');
  } else if (/\b(!high|high priority|high)\b/i.test(text)) {
    priority = 'high';
    text = text.replace(/\b(!high|high priority)\b/gi, '');
  } else if (/\b(!low|low priority|low)\b/i.test(text)) {
    priority = 'low';
    text = text.replace(/\b(!low|low priority)\b/gi, '');
  } else if (/\b(!med|medium priority)\b/i.test(text)) {
    priority = 'medium';
    text = text.replace(/\b(!med|medium priority)\b/gi, '');
  }

  // Extract estimated duration: ~45m, for 2 hours, 1.5h, 30 mins, 45 min
  const hourMatch = text.match(/(?:for\s+)?(\d+(?:\.\d+)?)\s*(?:hours|hour|hrs|hr|h)\b/i);
  if (hourMatch) {
    estimatedDuration = Math.round(parseFloat(hourMatch[1]) * 60);
    text = text.replace(hourMatch[0], '');
  } else {
    const minMatch = text.match(/(?:for\s+)?~?(\d+)\s*(?:minutes|minute|mins|min|m)\b/i);
    if (minMatch) {
      estimatedDuration = parseInt(minMatch[1], 10);
      text = text.replace(minMatch[0], '');
    }
  }

  // Extract time: at 7 PM, 7:30 pm, 19:00, 6am, at 3:15
  const timeMatch = text.match(/(?:at\s+)?(\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\b\d{1,2}:\d{2}\b)/i);
  if (timeMatch) {
    const rawTime = timeMatch[1].trim();
    dueTime = normalizeTime(rawTime);
    text = text.replace(timeMatch[0], '');
  }

  // Extract date: today, tomorrow, day after tomorrow, Monday..Sunday, next week, etc.
  const today = new Date();
  if (/\bday after tomorrow\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    dueDate = formatDate(d);
    text = text.replace(/\bday after tomorrow\b/gi, '');
  } else if (/\btomorrow\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    dueDate = formatDate(d);
    text = text.replace(/\btomorrow\b/gi, '');
  } else if (/\btoday\b/i.test(text)) {
    dueDate = formatDate(today);
    text = text.replace(/\btoday\b/gi, '');
  } else {
    // Weekday names
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      const regex = new RegExp(`\\b(?:next\\s+)?${days[i]}\\b`, 'i');
      if (regex.test(text)) {
        const targetDay = i;
        const currentDay = today.getDay();
        let diff = targetDay - currentDay;
        if (diff <= 0) diff += 7; // next upcoming day
        const d = new Date(today);
        d.setDate(d.getDate() + diff);
        dueDate = formatDate(d);
        text = text.replace(regex, '');
        break;
      }
    }
  }

  // Clean extra punctuation and double spaces
  let cleanedTitle = text
    .replace(/[,\s]+/g, ' ')
    .replace(/^[,.\s-]+|[,.\s-]+$/g, '')
    .trim();

  if (!cleanedTitle) {
    cleanedTitle = 'Untitled Task';
  }

  // Capitalize first letter
  cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);

  return {
    title: cleanedTitle,
    dueDate,
    dueTime,
    priority,
    tags,
    estimatedDuration: Math.max(5, estimatedDuration),
    category: tags[0] ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1) : 'General',
  };
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeTime(timeStr: string): string {
  const isPM = /pm/i.test(timeStr);
  const isAM = /am/i.test(timeStr);
  const clean = timeStr.replace(/(am|pm|\s)/gi, '');
  const parts = clean.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] ? parseInt(parts[1], 10) : 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
