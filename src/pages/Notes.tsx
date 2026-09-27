import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StickyNote } from '../types';
import {
  StickyNote as NoteIcon,
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Edit2,
  X,
  Archive,
} from 'lucide-react';

export const Notes: React.FC = () => {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<'amber' | 'emerald' | 'sky' | 'rose' | 'violet'>('amber');
  const [isPinned, setIsPinned] = useState(true);

  const openNew = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setColor('amber');
    setIsPinned(true);
    setIsModalOpen(true);
  };

  const openEdit = (n: StickyNote) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setColor(n.color);
    setIsPinned(n.isPinned);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      updateStickyNote(editingNote.id, {
        title: title.trim() || 'Untitled Memo',
        content: content.trim(),
        color,
        isPinned,
      });
    } else {
      addStickyNote({
        title: title.trim() || 'Untitled Memo',
        content: content.trim(),
        color,
        isPinned,
        isArchived: false,
      });
    }

    setIsModalOpen(false);
  };

  const filteredNotes = stickyNotes.filter((n) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const getColorStyles = (c: string) => {
    switch (c) {
      case 'emerald':
        return 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100';
      case 'sky':
        return 'bg-sky-950/40 border-sky-500/40 text-sky-100';
      case 'rose':
        return 'bg-rose-950/40 border-rose-500/40 text-rose-100';
      case 'violet':
        return 'bg-purple-950/40 border-purple-500/40 text-purple-100';
      default:
        return 'bg-amber-950/40 border-amber-500/40 text-amber-100';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Sticky Notes Workspace</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {stickyNotes.length} Memos
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Color-coded persistent scratch memos and tactical reminders
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search through memos..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`p-5 rounded-3xl border backdrop-blur-md shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01] ${getColorStyles(
              note.color
            )}`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-sm font-bold text-white truncate max-w-[200px]">
                  {note.title}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateStickyNote(note.id, { isPinned: !note.isPinned })}
                    className="p-1 opacity-70 hover:opacity-100"
                    title={note.isPinned ? 'Unpin' : 'Pin to Dashboard'}
                  >
                    {note.isPinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <PinOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(note)}
                    className="p-1 opacity-70 hover:opacity-100"
                    title="Edit memo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteStickyNote(note.id)}
                    className="p-1 opacity-70 hover:opacity-100 hover:text-rose-400"
                    title="Delete memo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-wrap opacity-95">
                {note.content}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between text-[10px] opacity-60 font-mono">
              <span>{note.isPinned ? '📌 Pinned to home' : 'Workspace only'}</span>
              <span>{note.updatedAt ? note.updatedAt.split('T')[0] : ''}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingNote ? 'Edit Memo' : 'New Sticky Note'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Key Evaluation Criteria"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write memo details, quotes, key principles..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Color</label>
                  <div className="flex gap-2">
                    {(['amber', 'emerald', 'sky', 'rose', 'violet'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full ${
                          c === 'amber'
                            ? 'bg-amber-400'
                            : c === 'emerald'
                            ? 'bg-emerald-400'
                            : c === 'sky'
                            ? 'bg-sky-400'
                            : c === 'rose'
                            ? 'bg-rose-400'
                            : 'bg-purple-400'
                        } ${color === c ? 'ring-2 ring-white scale-110' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs text-slate-300 font-semibold">Pin to Home</span>
                </label>
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
