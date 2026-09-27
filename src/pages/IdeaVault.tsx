import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IdeaItem } from '../types';
import {
  Lightbulb,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ArrowRight,
  CheckSquare,
  FolderKanban,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

export const IdeaVault: React.FC = () => {
  const {
    ideas,
    addIdea,
    updateIdea,
    deleteIdea,
    convertIdeaToTask,
    convertIdeaToProject,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Idea Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaItem['category']>('Project Ideas');
  const [status, setStatus] = useState<IdeaItem['status']>('Idea');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  const categories: Array<IdeaItem['category']> = [
    'Project Ideas',
    'Startup Ideas',
    'App Ideas',
    'Game Ideas',
    'Design Ideas',
    'Learning Ideas',
    'Football Ideas',
    'Other',
  ];

  const statuses: Array<IdeaItem['status']> = [
    'Idea',
    'Exploring',
    'Planning',
    'Building',
    'Completed',
    'Archived',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/#/g, ''))
      .filter(Boolean);

    addIdea({
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      tags,
      notes: notes.trim(),
    });

    setTitle('');
    setDescription('');
    setTagsInput('');
    setNotes('');
    setIsModalOpen(false);
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (selectedCategory !== 'All' && idea.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && idea.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = idea.title.toLowerCase().includes(q);
      const matchDesc = idea.description?.toLowerCase().includes(q);
      const matchTags = idea.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Idea Vault</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {ideas.length} Concepts
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Incubate startups, app concepts, creative designs, and football tactics
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Capture Idea</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or #tags..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No ideas found</h4>
            <p className="text-xs text-slate-400 mt-1">Capture your next creative spark in the vault.</p>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-semibold">
                    {idea.category}
                  </span>
                  <select
                    value={idea.status}
                    onChange={(e) =>
                      updateIdea(idea.id, { status: e.target.value as IdeaItem['status'] })
                    }
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mt-2">
                  {idea.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {idea.description}
                </p>

                {idea.notes && (
                  <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2">
                    Note: {idea.notes}
                  </p>
                )}

                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {idea.tags.map((t) => (
                      <span key={t} className="text-[10px] text-amber-300 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversion Buttons: Turn Idea into Task or Project */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => convertIdeaToTask(idea.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1"
                    title="Convert into actionable task"
                  >
                    <CheckSquare className="w-3 h-3 text-emerald-400" />
                    <span>→ Task</span>
                  </button>

                  <button
                    onClick={() => convertIdeaToProject(idea.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1"
                    title="Promote to strategic project"
                  >
                    <FolderKanban className="w-3 h-3 text-amber-400" />
                    <span>→ Project</span>
                  </button>
                </div>

                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  title="Delete idea"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Idea Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Capture Creative Concept</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Concept Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI AST Visualizer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is the breakthrough value or core feature?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IdeaItem['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as IdeaItem['status'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="ast, typescript, tools"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-xs text-slate-950 font-bold"
                >
                  Save Concept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
