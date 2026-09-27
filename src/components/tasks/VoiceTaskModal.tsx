import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { speechService, SpeechStatus } from '../../services/speech';
import { parseNaturalLanguageTask, ParsedTaskResult } from '../../utils/parser';
import { Mic, MicOff, X, Sparkles, Check, AlertCircle, Edit3 } from 'lucide-react';

export const VoiceTaskModal: React.FC = () => {
  const {
    isVoiceModalOpen,
    setVoiceModalOpen,
    createTask,
    setSelectedTaskForEdit,
    setTaskModalOpen,
  } = useApp();

  const [status, setStatus] = useState<SpeechStatus>('inactive');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedTaskResult | null>(null);

  useEffect(() => {
    if (!isVoiceModalOpen) {
      setStatus('inactive');
      setTranscript('');
      setErrorMessage(null);
      setParsed(null);
    }
  }, [isVoiceModalOpen]);

  if (!isVoiceModalOpen) return null;

  const isSupported = speechService.isSupported();

  const handleStartListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setParsed(null);

    speechService.listen(
      (text, isFinal) => {
        setTranscript(text);
        if (text.trim()) {
          const res = parseNaturalLanguageTask(text);
          setParsed(res);
        }
      },
      (newStatus, err) => {
        setStatus(newStatus);
        if (err) setErrorMessage(err);
      }
    );
  };

  const handleCreateParsedTask = () => {
    if (!parsed) return;
    createTask({
      title: parsed.title,
      priority: parsed.priority,
      category: parsed.category || 'General',
      tags: parsed.tags,
      dueDate: parsed.dueDate,
      dueTime: parsed.dueTime,
      estimatedDuration: parsed.estimatedDuration,
      subtasks: [],
      recurrence: 'none',
      status: 'todo',
      quadrant: parsed.priority === 'urgent' ? 'do_now' : 'schedule',
    });
    setVoiceModalOpen(false);
  };

  const handleEditParsedTask = () => {
    if (!parsed) return;
    // Pre-populate new task
    setVoiceModalOpen(false);
    setSelectedTaskForEdit(null);
    setTaskModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={() => setVoiceModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Voice Task Intelligence
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Voice Command Studio</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Speak naturally into your microphone using the Web Speech API. We will extract the task title, date, priority, and tags.
        </p>

        {/* Microphone Action Area */}
        <div className="my-8 flex flex-col items-center">
          <button
            onClick={status === 'listening' ? () => setStatus('inactive') : handleStartListening}
            disabled={!isSupported}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              status === 'listening'
                ? 'bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-105'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {status === 'listening' ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
          <p className="text-xs font-semibold text-slate-300 mt-4">
            {status === 'listening' ? 'Listening... Speak your task now.' : 'Tap microphone to start speaking'}
          </p>
        </div>

        {/* Unsupported notice */}
        {!isSupported && (
          <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Web Speech API is unavailable in this browser. You can type tasks using the Natural Language parser.</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Transcript */}
        {transcript && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left mb-4">
            <span className="text-[10px] text-slate-500 font-mono block mb-1">TRANSCRIPT:</span>
            <p className="text-xs text-slate-200 italic">"{transcript}"</p>
          </div>
        )}

        {/* Parsed Breakdown Card */}
        {parsed && (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 text-left mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Parsed Extraction</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {parsed.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{parsed.title}</p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              {parsed.dueDate && <span>📅 {parsed.dueDate}</span>}
              {parsed.dueTime && <span>⏰ {parsed.dueTime}</span>}
              {parsed.estimatedDuration && <span>⏱ ~{parsed.estimatedDuration}m</span>}
              {parsed.tags.map((t) => (
                <span key={t} className="text-amber-300">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setVoiceModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
          >
            Cancel
          </button>
          {parsed && (
            <>
              <button
                onClick={handleEditParsedTask}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={handleCreateParsedTask}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Create Task
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
