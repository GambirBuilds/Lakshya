import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Sparkles, Check, ArrowRight, X, CheckSquare, FolderKanban, Lightbulb, StickyNote } from 'lucide-react';

interface ParsedDumpItem {
  id: string;
  rawText: string;
  type: 'task' | 'project' | 'idea' | 'note';
}

export const BrainDump: React.FC = () => {
  const {
    brainDumpText,
    setBrainDumpText,
    createTask,
    addProject,
    addIdea,
    addStickyNote,
    addToast,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [itemsToProcess, setItemsToProcess] = useState<ParsedDumpItem[]>([]);

  const handleStartProcess = () => {
    const lines = brainDumpText
      .split('\n')
      .map((l) => l.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      addToast({ type: 'warning', title: 'Brain Dump is empty', message: 'Type or paste your unstructured thoughts first.' });
      return;
    }

    const prepared: ParsedDumpItem[] = lines.map((line, idx) => {
      // Heuristic guess
      let type: ParsedDumpItem['type'] = 'task';
      if (/project|initiative|system|platform/i.test(line)) type = 'project';
      else if (/idea|concept|what if|app for/i.test(line)) type = 'idea';
      else if (/remember|note|quote|memo/i.test(line)) type = 'note';

      return {
        id: `dump-${idx}-${Date.now()}`,
        rawText: line,
        type,
      };
    });

    setItemsToProcess(prepared);
    setIsProcessing(true);
  };

  const setItemType = (id: string, type: ParsedDumpItem['type']) => {
    setItemsToProcess((prev) => prev.map((item) => (item.id === id ? { ...item, type } : item)));
  };

  const removeItem = (id: string) => {
    setItemsToProcess((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCommitConversion = () => {
    let tasksCount = 0;
    let projCount = 0;
    let ideasCount = 0;
    let notesCount = 0;

    itemsToProcess.forEach((item) => {
      if (item.type === 'task') {
        createTask({
          title: item.rawText,
          priority: 'medium',
          category: 'BrainDump',
          tags: ['braindump'],
          estimatedDuration: 30,
          subtasks: [],
          recurrence: 'none',
          status: 'todo',
          quadrant: 'schedule',
        });
        tasksCount++;
      } else if (item.type === 'project') {
        addProject({
          name: item.rawText,
          description: 'Converted from raw Brain Dump capture',
          color: '#f59e0b',
          icon: 'FolderKanban',
          status: 'active',
        });
        projCount++;
      } else if (item.type === 'idea') {
        addIdea({
          title: item.rawText,
          description: 'Captured in Brain Dump session',
          category: 'Project Ideas',
          status: 'Idea',
          tags: ['from-dump'],
        });
        ideasCount++;
      } else if (item.type === 'note') {
        addStickyNote({
          title: item.rawText.slice(0, 30),
          content: item.rawText,
          color: 'amber',
          isPinned: true,
          isArchived: false,
        });
        notesCount++;
      }
    });

    // Clear processed lines from dump text
    setBrainDumpText('');
    setIsProcessing(false);
    addToast({
      type: 'success',
      title: 'Brain Dump Processed Successfully!',
      message: `Created: ${tasksCount} tasks, ${projCount} projects, ${ideasCount} ideas, ${notesCount} notes.`,
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Brain Dump Scratchpad</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Mental Decompression
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Freeform raw capture area — dump everything, then convert into structured tasks, projects, or ideas
          </p>
        </div>

        <button
          onClick={handleStartProcess}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>PROCESS BRAIN DUMP</span>
        </button>
      </div>

      {/* Editor card */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-xl flex flex-col min-h-[460px]">
        <textarea
          value={brainDumpText}
          onChange={(e) => setBrainDumpText(e.target.value)}
          placeholder={`Dump anything that is occupying cognitive RAM...&#10;&#10;Finish assignment&#10;Study database normalization&#10;Buy football cleats&#10;Call mentor&#10;Build Lakshya full-stack system`}
          className="flex-1 w-full bg-transparent text-sm sm:text-base font-mono text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
        />
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>{brainDumpText.split('\n').filter((l) => l.trim()).length} lines captured</span>
          <span>Auto-saved to local memory</span>
        </div>
      </div>

      {/* Processing Review Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Review & Triage ({itemsToProcess.length} Items)
                </h3>
              </div>
              <button
                onClick={() => setIsProcessing(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Review how each captured line will be converted before creating:
            </p>

            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1 mb-6">
              {itemsToProcess.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-white flex-1 truncate">{item.rawText}</span>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                      {(['task', 'project', 'idea', 'note'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setItemType(item.id, t)}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                            item.type === t
                              ? 'bg-amber-500 text-slate-950'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsProcessing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCommitConversion}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25"
              >
                Create All {itemsToProcess.length} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
