import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StickyNote, Plus, Trash2, Pin, PinOff, Edit2, Check } from 'lucide-react';

export const StickyNotesWidget: React.FC = () => {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote, setCurrentPage } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState<'amber' | 'emerald' | 'sky' | 'rose' | 'violet'>('amber');

  const pinnedNotes = stickyNotes.filter((n) => n.isPinned && !n.isArchived).slice(0, 3);

  const handleSaveNew = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    addStickyNote({
      title: newTitle.trim() || 'Quick Note',
      content: newContent.trim(),
      color: newColor,
      isPinned: true,
      isArchived: false,
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200';
      case 'sky':
        return 'bg-sky-950/40 border-sky-500/30 text-sky-200';
      case 'rose':
        return 'bg-rose-950/40 border-rose-500/30 text-rose-200';
      case 'violet':
        return 'bg-purple-950/40 border-purple-500/30 text-purple-200';
      default:
        return 'bg-amber-950/40 border-amber-500/30 text-amber-200';
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <StickyNote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Pinned Sticky Notes</h3>
            <p className="text-[11px] text-slate-400">Persistent micro-memos</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Note</span>
        </button>
      </div>

      {isAdding && (
        <div className="p-3 mb-3 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <textarea
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write key memo or takeaway..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {(['amber', 'emerald', 'sky', 'rose', 'violet'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={`w-4 h-4 rounded-full ${
                    c === 'amber' ? 'bg-amber-400' : c === 'emerald' ? 'bg-emerald-400' : c === 'sky' ? 'bg-sky-400' : c === 'rose' ? 'bg-rose-400' : 'bg-purple-400'
                  } ${newColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNew}
                className="px-3 py-1 rounded bg-amber-500 text-[11px] font-bold text-slate-950"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {pinnedNotes.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-500">
            No pinned sticky notes.
          </div>
        ) : (
          pinnedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-2xl border transition-all ${getColorStyles(note.color)}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold truncate max-w-[200px] text-white">
                  {note.title}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateStickyNote(note.id, { isPinned: false })}
                    className="p-1 opacity-60 hover:opacity-100"
                    title="Unpin note"
                  >
                    <PinOff className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteStickyNote(note.id)}
                    className="p-1 opacity-60 hover:opacity-100 text-rose-300"
                    title="Delete note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs leading-relaxed opacity-90 line-clamp-3">{note.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 text-right">
        <button
          onClick={() => setCurrentPage('notes')}
          className="text-[11px] text-amber-400 hover:underline font-semibold"
        >
          View All Sticky Notes →
        </button>
      </div>
    </div>
  );
};
