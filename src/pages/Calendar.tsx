import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDateToYYYYMMDD } from '../utils/dates';
import { TimeBlock } from '../types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  X,
  CheckCircle2,
  Play,
} from 'lucide-react';

export const Calendar: React.FC = () => {
  const { timeBlocks, addTimeBlock, deleteTimeBlock, tasks, startFocusWithTask } = useApp();

  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  // Form State for new time block
  const [blockTitle, setBlockTitle] = useState('');
  const [blockTaskId, setBlockTaskId] = useState('');
  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('10:30');
  const [blockColor, setBlockColor] = useState('#f59e0b');

  const selectedDateStr = formatDateToYYYYMMDD(selectedDate);

  // Hours: 06:00 to 22:00
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - (viewMode === 'day' ? 1 : 7));
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (viewMode === 'day' ? 1 : 7));
    setSelectedDate(d);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim()) return;

    addTimeBlock({
      title: blockTitle.trim(),
      taskId: blockTaskId || undefined,
      date: selectedDateStr,
      startTime: blockStartTime,
      endTime: blockEndTime,
      color: blockColor,
    });

    setBlockTitle('');
    setBlockTaskId('');
    setIsAddBlockOpen(false);
  };

  // Filter blocks for current day
  const dayBlocks = timeBlocks.filter((b) => b.date === selectedDateStr);

  // Week days calculation
  const getWeekDays = (curr: Date) => {
    const startOfWeek = new Date(curr);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Time Blocking Calendar</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Day & Week View
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Map out intentional blocks of deep work and prevent cognitive fragmentation
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Day / Week Switcher */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => setIsAddBlockOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Block Time</span>
          </button>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
          >
            Today
          </button>
          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white font-mono">
          {viewMode === 'day'
            ? selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : `Week of ${weekDays[0].toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })} — ${weekDays[6].toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}`}
        </h3>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {dayBlocks.length} Scheduled Blocks
        </span>
      </div>

      {/* Day Schedule View */}
      {viewMode === 'day' ? (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-hidden p-6 shadow-xl">
          <div className="relative divide-y divide-slate-800/50">
            {hours.map((hour) => {
              const hourFormatted = `${String(hour).padStart(2, '0')}:00`;
              const blocksInHour = dayBlocks.filter((b) => {
                const startH = parseInt(b.startTime.split(':')[0], 10);
                return startH === hour;
              });

              return (
                <div key={hour} className="flex min-h-[64px] group py-1">
                  {/* Hour label */}
                  <div className="w-20 pr-4 text-right text-xs font-mono text-slate-500 font-medium pt-1 shrink-0">
                    {hourFormatted}
                  </div>

                  {/* Slot area */}
                  <div className="flex-1 relative border-l border-slate-800 pl-4 space-y-2">
                    {blocksInHour.map((b) => {
                      const linkedTask = tasks.find((t) => t.id === b.taskId);
                      return (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-3 rounded-2xl border text-xs shadow-md transition-all hover:scale-[1.01]"
                          style={{
                            backgroundColor: `${b.color || '#f59e0b'}15`,
                            borderColor: `${b.color || '#f59e0b'}50`,
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: b.color || '#f59e0b' }}
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white truncate text-xs sm:text-sm">
                                {b.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {b.startTime} - {b.endTime}
                                {linkedTask && (
                                  <span className="text-amber-400 ml-2">
                                    • Linked: {linkedTask.title}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {linkedTask && linkedTask.status !== 'completed' && (
                              <button
                                onClick={() => startFocusWithTask(linkedTask)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-sm"
                              >
                                <Play className="w-3 h-3 fill-slate-950" />
                                <span>Focus</span>
                              </button>
                            )}
                            <button
                              onClick={() => deleteTimeBlock(b.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              title="Delete time block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Week View Grid */
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-x-auto p-4 shadow-xl">
          <div className="grid grid-cols-7 gap-2 min-w-[750px]">
            {weekDays.map((d) => {
              const dStr = formatDateToYYYYMMDD(d);
              const isToday = dStr === formatDateToYYYYMMDD(new Date());
              const bList = timeBlocks.filter((b) => b.date === dStr);

              return (
                <div
                  key={dStr}
                  className={`p-3 rounded-2xl border min-h-[420px] flex flex-col justify-between ${
                    isToday ? 'bg-amber-500/5 border-amber-500/40' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-center pb-2 border-b border-slate-800 mb-2">
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span
                        className={`text-sm font-bold block ${
                          isToday ? 'text-amber-400 font-extrabold' : 'text-white'
                        }`}
                      >
                        {d.getDate()}
                      </span>
                    </div>

                    {/* Day blocks */}
                    <div className="space-y-1.5">
                      {bList.map((b) => (
                        <div
                          key={b.id}
                          className="p-2 rounded-xl text-[11px] border"
                          style={{
                            backgroundColor: `${b.color || '#f59e0b'}15`,
                            borderColor: `${b.color || '#f59e0b'}40`,
                          }}
                        >
                          <p className="font-semibold text-white truncate">{b.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {b.startTime}-{b.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDate(d);
                      setViewMode('day');
                    }}
                    className="w-full mt-2 py-1 text-[10px] text-amber-400/80 hover:text-amber-300 font-semibold"
                  >
                    View Day →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Time Block Modal */}
      {isAddBlockOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Schedule Focus Time Block</h3>
              <button
                onClick={() => setIsAddBlockOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Block Title *
                </label>
                <input
                  type="text"
                  required
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  placeholder="e.g. Deep Work: Database Normalization"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Attach to Existing Task (Optional)
                </label>
                <select
                  value={blockTaskId}
                  onChange={(e) => {
                    const tid = e.target.value;
                    setBlockTaskId(tid);
                    const t = tasks.find((item) => item.id === tid);
                    if (t && !blockTitle) setBlockTitle(t.title);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">No task linked</option>
                  {tasks
                    .filter((t) => t.status !== 'completed')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.estimatedDuration}m)
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Block Color
                </label>
                <div className="flex gap-2">
                  {['#f59e0b', '#38bdf8', '#10b981', '#a855f7', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBlockColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        blockColor === c ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBlockOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-xs text-slate-950 font-bold"
                >
                  Add Time Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
