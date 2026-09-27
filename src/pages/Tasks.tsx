import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, Priority } from '../types';
import { formatFriendlyDate, isDateOverdue } from '../utils/dates';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Play,
  Star,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Tag,
  CheckSquare,
  AlertTriangle,
  FolderKanban,
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const {
    tasks,
    toggleTaskCompletion,
    toggleDailyTop3,
    deleteTask,
    setSelectedTaskForEdit,
    setTaskModalOpen,
    startFocusWithTask,
    projects,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'top3'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created' | 'duration'>('dueDate');

  // Filter tasks
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    // Tab filter
    if (activeTab === 'today') {
      if (t.status === 'completed' || t.dueDate !== todayStr) return false;
    } else if (activeTab === 'upcoming') {
      if (t.status === 'completed' || !t.dueDate || t.dueDate <= todayStr) return false;
    } else if (activeTab === 'completed') {
      if (t.status !== 'completed') return false;
    } else if (activeTab === 'top3') {
      if (!t.isDailyTop3) return false;
    } else {
      // all: exclude completed from top list if searching/filtering unless completed tab
      // keep all
    }

    // Priority filter
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    // Project filter
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTags = t.tags?.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const weights = { urgent: 4, high: 3, medium: 2, low: 1 };
      return weights[b.priority] - weights[a.priority];
    }
    if (sortBy === 'duration') {
      return b.estimatedDuration - a.estimatedDuration;
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default: dueDate
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">URGENT</span>;
      case 'high':
        return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      case 'medium':
        return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">MED</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-400">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Task Command Workspace</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {tasks.filter((t) => t.status !== 'completed').length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize, prioritize, and initiate deep work focus sessions
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTaskForEdit(null);
            setTaskModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: 'Due Today' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'top3', label: 'Daily Top 3' },
          { id: 'completed', label: 'Completed Archive' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls Bar: Search, Filters, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or #tag..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="duration">Sort by Duration</option>
            <option value="created">Sort by Created Date</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No tasks found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || priorityFilter !== 'all'
                ? 'No tasks match your active filters. Try clearing search criteria.'
                : 'Your task queue is clear! Create your next high-leverage objective.'}
            </p>
            <button
              onClick={() => {
                setSelectedTaskForEdit(null);
                setTaskModalOpen(true);
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
            >
              + Create Task
            </button>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isOverdue = !isDone && isDateOverdue(task.dueDate);
            const project = projects.find((p) => p.id === task.projectId);

            return (
              <div
                key={task.id}
                className={`group p-4 sm:p-5 rounded-3xl border transition-all duration-200 ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isOverdue
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox + Title + Description */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="mt-1 text-slate-400 hover:text-amber-400 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-sm sm:text-base font-bold text-white leading-snug break-words ${
                            isDone ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </h3>
                        {getPriorityBadge(task.priority)}
                        {task.isDailyTop3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                            TOP 3
                          </span>
                        )}
                        {project && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {project.name}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Subtasks summary */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks done
                          </span>
                        </div>
                      )}

                      {/* Meta Tags, Due Date, Duration */}
                      <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-slate-400">
                        {task.dueDate && (
                          <span
                            className={`flex items-center gap-1 font-mono ${
                              isOverdue ? 'text-rose-400 font-bold' : ''
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {formatFriendlyDate(task.dueDate)}
                            {task.dueTime ? ` at ${task.dueTime}` : ''}
                          </span>
                        )}

                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          Est: {task.estimatedDuration}m
                          {task.actualDuration > 0 && (
                            <strong className="text-amber-400 ml-1">
                              (Actual: {task.actualDuration}m)
                            </strong>
                          )}
                        </span>

                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-500" />
                            {task.tags.map((tg) => (
                              <span key={tg} className="text-amber-300/80 font-mono text-[11px]">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {!isDone && (
                      <button
                        onClick={() => startFocusWithTask(task)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-all"
                        title="Start focus timer with this task"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Focus</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleDailyTop3(task.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        task.isDailyTop3
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'border-slate-800 text-slate-500 hover:text-amber-400'
                      }`}
                      title={task.isDailyTop3 ? 'Remove from Top 3' : 'Pin to Daily Top 3'}
                    >
                      <Star className={`w-4 h-4 ${task.isDailyTop3 ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTaskForEdit(task);
                        setTaskModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-xl border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
