import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Goal, Milestone } from '../types';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  Flag,
} from 'lucide-react';

export const Goals: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    milestones,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    tasks,
  } = useApp();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  // Goal Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career & Craft');
  const [deadline, setDeadline] = useState('');

  const activeGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const g = addGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      deadline: deadline || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'in_progress',
    });

    setSelectedGoalId(g.id);
    setTitle('');
    setDescription('');
    setIsGoalModalOpen(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !activeGoal) return;

    const currentOrder = milestones.filter((m) => m.goalId === activeGoal.id).length + 1;
    addMilestone({
      goalId: activeGoal.id,
      title: newMilestoneTitle.trim(),
      completed: false,
      order: currentOrder,
    });
    setNewMilestoneTitle('');
  };

  const activeMilestones = milestones
    .filter((m) => m.goalId === activeGoal?.id)
    .sort((a, b) => a.order - b.order);

  const completedMilestones = activeMilestones.filter((m) => m.completed).length;
  const progressPercent = activeMilestones.length > 0
    ? Math.round((completedMilestones / activeMilestones.length) * 100)
    : 0;

  const linkedTasks = tasks.filter((t) => t.goalId === activeGoal?.id);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Lakshya Ambition & Roadmap</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {goals.length} Goals Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hierarchical strategic execution: Goal → Projects → Milestones → Tasks
          </p>
        </div>

        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Goal Selector Pills */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar">
        {goals.map((g) => {
          const isSelected = g.id === (activeGoal?.id || '');
          const gMilestones = milestones.filter((m) => m.goalId === g.id);
          const gDone = gMilestones.filter((m) => m.completed).length;
          const gPct = gMilestones.length > 0 ? Math.round((gDone / gMilestones.length) * 100) : 0;

          return (
            <button
              key={g.id}
              onClick={() => setSelectedGoalId(g.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="truncate max-w-[200px]">{g.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono">
                {gPct}%
              </span>
            </button>
          );
        })}
      </div>

      {activeGoal ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Roadmap Card (2 Cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {activeGoal.category}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Target: {activeGoal.deadline}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3">
                {activeGoal.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {activeGoal.description}
              </p>

              {/* Progress Overview Bar */}
              <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Overall Roadmap Progress
                  </span>
                  <span className="text-amber-400 font-bold text-sm">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block font-mono">
                  {completedMilestones} of {activeMilestones.length} milestones conquered
                </span>
              </div>

              {/* Visual Roadmap Flow */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  Milestone Sequence
                </h4>

                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {activeMilestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`relative flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        m.completed
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {/* Node point */}
                      <span
                        className={`absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                          m.completed
                            ? 'bg-emerald-500 border-slate-900'
                            : 'bg-slate-950 border-amber-400'
                        }`}
                      />

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMilestone(m.id)}
                          className="text-slate-400 hover:text-emerald-400"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div>
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              m.completed ? 'line-through text-slate-500' : 'text-white'
                            }`}
                          >
                            Step {idx + 1}: {m.title}
                          </span>
                          {m.completedAt && (
                            <span className="text-[10px] text-emerald-400/80 block font-mono">
                              Completed on {m.completedAt.split('T')[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMilestone(m.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Milestone Form */}
              <form onSubmit={handleAddMilestone} className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="Add next sequential milestone..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                >
                  + Add Step
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 flex justify-end">
              <button
                onClick={() => deleteGoal(activeGoal.id)}
                className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Goal</span>
              </button>
            </div>
          </div>

          {/* Right Col: Linked Tasks & Strategy */}
          <div className="space-y-5">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Linked Execution Tasks
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Operational tasks driving this goal forward
              </p>

              <div className="space-y-2">
                {linkedTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No tasks linked to this goal yet. Link tasks from the Task Workspace.
                  </p>
                ) : (
                  linkedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate max-w-[180px]">
                          {t.title}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400">
                          {t.priority}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Status: {t.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Set Long-Term Lakshya Goal</h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Goal Ambition *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Become an Elite Full-Stack Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Strategic Scope & Intent
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why does this matter and what does success look like?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Career & Craft">Career & Craft</option>
                    <option value="Academics">Academics</option>
                    <option value="Health & Sports">Health & Sports</option>
                    <option value="Finance & Growth">Finance & Growth</option>
                    <option value="Personal Mastery">Personal Mastery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-xs text-slate-950 font-bold"
                >
                  Set Lakshya Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
