import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, EisenhowerQuadrant, RecurrenceType } from '../../types';
import { parseNaturalLanguageTask } from '../../utils/parser';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  FolderKanban,
  Target,
  Sparkles,
  Zap,
  Repeat,
  FileText,
  Check,
} from 'lucide-react';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setTaskModalOpen,
    selectedTaskForEdit,
    setSelectedTaskForEdit,
    createTask,
    updateTask,
    projects,
    goals,
  } = useApp();

  const [nlInput, setNlInput] = useState('');
  const [showNlHelper, setShowNlHelper] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Academics');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [goalId, setGoalId] = useState<string | undefined>(undefined);
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>('schedule');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [isDailyTop3, setIsDailyTop3] = useState(false);
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (selectedTaskForEdit) {
      setTitle(selectedTaskForEdit.title);
      setDescription(selectedTaskForEdit.description || '');
      setPriority(selectedTaskForEdit.priority);
      setCategory(selectedTaskForEdit.category);
      setTags(selectedTaskForEdit.tags || []);
      setDueDate(selectedTaskForEdit.dueDate || '');
      setDueTime(selectedTaskForEdit.dueTime || '');
      setEstimatedDuration(selectedTaskForEdit.estimatedDuration || 30);
      setProjectId(selectedTaskForEdit.projectId);
      setGoalId(selectedTaskForEdit.goalId);
      setQuadrant(selectedTaskForEdit.quadrant || 'schedule');
      setRecurrence(selectedTaskForEdit.recurrence || 'none');
      setIsDailyTop3(!!selectedTaskForEdit.isDailyTop3);
      setNotes(selectedTaskForEdit.notes || '');
      setSubtasks(selectedTaskForEdit.subtasks || []);
    } else {
      // Defaults for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
      setTags([]);
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('');
      setEstimatedDuration(30);
      setProjectId(projects[0]?.id);
      setGoalId(goals[0]?.id);
      setQuadrant('schedule');
      setRecurrence('none');
      setIsDailyTop3(false);
      setNotes('');
      setSubtasks([]);
      setNlInput('');
    }
  }, [selectedTaskForEdit, isTaskModalOpen, projects, goals]);

  if (!isTaskModalOpen) return null;

  const handleApplyNL = () => {
    if (!nlInput.trim()) return;
    const parsed = parseNaturalLanguageTask(nlInput);
    setTitle(parsed.title);
    if (parsed.dueDate) setDueDate(parsed.dueDate);
    if (parsed.dueTime) setDueTime(parsed.dueTime);
    if (parsed.priority) setPriority(parsed.priority);
    if (parsed.tags && parsed.tags.length > 0) setTags(parsed.tags);
    if (parsed.estimatedDuration) setEstimatedDuration(parsed.estimatedDuration);
    if (parsed.category) setCategory(parsed.category);
    setShowNlHelper(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/#/g, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st-${Date.now()}-${Math.random()}`, title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (selectedTaskForEdit) {
      updateTask(selectedTaskForEdit.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        tags,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        estimatedDuration: Number(estimatedDuration) || 30,
        projectId: projectId || undefined,
        goalId: goalId || undefined,
        quadrant,
        recurrence,
        isDailyTop3,
        notes: notes.trim(),
        subtasks,
      });
    } else {
      createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        tags,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        estimatedDuration: Number(estimatedDuration) || 30,
        projectId: projectId || undefined,
        goalId: goalId || undefined,
        quadrant,
        recurrence,
        status: 'todo',
        isDailyTop3,
        notes: notes.trim(),
        subtasks,
      });
    }

    setTaskModalOpen(false);
    setSelectedTaskForEdit(null);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="font-bold text-white text-lg">
              {selectedTaskForEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
          </div>
          <button
            onClick={() => {
              setTaskModalOpen(false);
              setSelectedTaskForEdit(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Natural Language Smart Input Prompt */}
        {!selectedTaskForEdit && (
          <div className="px-6 pt-4 pb-1 bg-amber-500/5 border-b border-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Natural Language Quick Creator
              </span>
              <button
                type="button"
                onClick={() => setShowNlHelper(!showNlHelper)}
                className="text-[11px] text-amber-300/80 hover:text-amber-200 underline"
              >
                {showNlHelper ? 'Hide examples' : 'Try example'}
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyNL();
                  }
                }}
                placeholder='e.g., "Finish Java assignment tomorrow at 7 PM, high priority #college ~45m"'
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleApplyNL}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
              >
                Parse
              </button>
            </div>
            {showNlHelper && (
              <div className="text-[11px] text-slate-400 pb-2 space-y-1">
                <p>• "Study database for 2 hours Friday high priority #dbms"</p>
                <p>• "Call football coach today at 5pm urgent ~20m"</p>
              </div>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be achieved?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, deliverables, or specifications..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Grid: Priority, Category, Eisenhower */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Eisenhower</label>
              <select
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value as EisenhowerQuadrant)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="do_now">1: Do Now (Urgent + Imp)</option>
                <option value="schedule">2: Schedule (Not Urgent + Imp)</option>
                <option value="delegate">3: Delegate (Urgent + Not Imp)</option>
                <option value="eliminate">4: Eliminate (Neither)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Academics, Work, Sports..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
              </input>
            </div>
          </div>

          {/* Grid: Due Date, Due Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                Est. Duration (mins)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(parseInt(e.target.value, 10) || 30)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Project & Goal linkages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                Linked Project
              </label>
              <select
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value || undefined)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-slate-400" />
                Linked Goal
              </label>
              <select
                value={goalId || ''}
                onChange={(e) => setGoalId(e.target.value || undefined)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">No Goal</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurrence & Daily Top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-slate-400" />
                Recurrence Rule
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="none">One-off Task (No Recurrence)</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Monday to Friday (Weekdays)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer w-full hover:border-amber-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={isDailyTop3}
                  onChange={(e) => setIsDailyTop3(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Pin to Daily Top 3</span>
                  <span className="text-[10px] text-slate-400 block">Highlights this priority on the main dashboard</span>
                </div>
              </label>
            </div>
          </div>

          {/* Subtasks */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Subtasks Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>
            <div className="space-y-1.5 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleSubtask(st.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        st.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                      }`}
                    >
                      {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={st.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {st.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask step and press Enter..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono"
                >
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-rose-400 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Rich Notes */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Rich Notes & Reference Links
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste code snippets, API endpoints, reference URLs, or assignment notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setTaskModalOpen(false);
                setSelectedTaskForEdit(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              {selectedTaskForEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
