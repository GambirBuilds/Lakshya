import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportBackupData, validateBackupFile, restoreBackupData, BackupValidationResult } from '../services/backup';
import { BackgroundStyle, ThemeAccent, ThemeMode } from '../types';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Palette,
  Clock,
  Volume2,
  User,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, addToast } = useApp();

  const [validationResult, setValidationResult] = useState<BackupValidationResult | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleExport = () => {
    try {
      exportBackupData();
      addToast({
        type: 'success',
        title: 'Backup Exported',
        message: 'lakshya-backup.json downloaded successfully.',
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: (e as Error).message,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      const res = validateBackupFile(content);
      setValidationResult(res);
      setShowRestoreModal(true);
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!validationResult || !validationResult.valid || !validationResult.payload) return;
    try {
      restoreBackupData(validationResult.payload);
      setShowRestoreModal(false);
      addToast({
        type: 'success',
        title: 'Backup Restored Successfully!',
        message: 'Reloading application state...',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Restore Failed',
        message: (err as Error).message,
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>System Settings & Personalization</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
            v1.0.0
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure focus cadence, appearance themes, sound synthesis, and data safeguards
        </p>
      </div>

      {/* Author & Academic Submission Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Academic Submission Credentials
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            <strong>Author:</strong> Gambir Jung Karki • <strong>Section:</strong> F258
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            <strong>Submitted To:</strong> Prashant Bhattarai Sir
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-amber-400 font-mono block">LAKSHYA</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            Aim. Focus. Achieve.
          </span>
        </div>
      </div>

      {/* Section 1: Themes & Appearance */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Palette className="w-4 h-4 text-amber-400" />
          Theme & Background Aesthetics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Display Mode</label>
            <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1">
              <button
                type="button"
                onClick={() => updateSettings({ themeMode: 'dark' })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  settings.themeMode === 'dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Dark Onyx (Recommended)
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ themeMode: 'light' })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  settings.themeMode === 'light' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Accent Tone</label>
            <div className="flex gap-2">
              {[
                { id: 'amber' as ThemeAccent, color: '#f59e0b', name: 'Amber' },
                { id: 'emerald' as ThemeAccent, color: '#10b981', name: 'Emerald' },
                { id: 'cyan' as ThemeAccent, color: '#38bdf8', name: 'Cyan' },
                { id: 'purple' as ThemeAccent, color: '#a855f7', name: 'Purple' },
                { id: 'rose' as ThemeAccent, color: '#f43f5e', name: 'Rose' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => updateSettings({ themeAccent: acc.id })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    settings.themeAccent === acc.id
                      ? 'border-white ring-2 ring-amber-400/40 text-white'
                      : 'border-slate-800 text-slate-400 bg-slate-950'
                  }`}
                  style={{ backgroundColor: `${acc.color}20` }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: acc.color }} />
                  <span className="hidden sm:inline">{acc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Ambient Background Texture
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'minimal' as BackgroundStyle, label: 'Minimal Dark' },
              { id: 'gradient' as BackgroundStyle, label: 'Subtle Mesh' },
              { id: 'abstract' as BackgroundStyle, label: 'Cyber Grid' },
              { id: 'forest' as BackgroundStyle, label: 'Deep Forest' },
              { id: 'space' as BackgroundStyle, label: 'Cosmic Drift' },
            ].map((bg) => (
              <button
                key={bg.id}
                onClick={() => updateSettings({ backgroundStyle: bg.id })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  settings.backgroundStyle === bg.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Focus Defaults */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Clock className="w-4 h-4 text-sky-400" />
          Default Focus Chamber Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Work Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={settings.workDuration}
              onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value, 10) || 25 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Break (Minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.breakDuration}
              onChange={(e) => updateSettings({ breakDuration: parseInt(e.target.value, 10) || 5 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Long Break (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) =>
                updateSettings({ longBreakDuration: parseInt(e.target.value, 10) || 15 })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-xs text-slate-300 font-semibold">Auto-start Break Timer</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-xs text-slate-300 font-semibold">Enable Audio Bell Chimes</span>
          </label>
        </div>
      </div>

      {/* Section 3: Feature 30: Backup & Safe Restore */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Full Data Sovereignty, Backup & Safe Restore
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Export all tasks, projects, goals, habits, journal entries, idea vault, personal bests,
          and gamification progress to a single standardized <code className="text-amber-400">lakshya-backup.json</code> file.
          Restore validates integrity before applying changes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Backup (lakshya-backup.json)</span>
          </button>

          <label className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20">
            <Upload className="w-4 h-4 stroke-[3]" />
            <span>Restore from Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && validationResult && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Validate & Confirm Restore</h3>
            </div>

            {validationResult.valid && validationResult.summary ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Backup verified successfully. The archive contains:
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div>• Tasks: {validationResult.summary.tasksCount}</div>
                  <div>• Projects: {validationResult.summary.projectsCount}</div>
                  <div>• Goals: {validationResult.summary.goalsCount}</div>
                  <div>• Habits: {validationResult.summary.habitsCount}</div>
                  <div>• Notes: {validationResult.summary.notesCount}</div>
                  <div>• Ideas: {validationResult.summary.ideasCount}</div>
                  <div>• Journal: {validationResult.summary.journalCount}</div>
                  <div className="text-slate-500 pt-1 text-[10px]">
                    Exported: {validationResult.summary.exportedAt}
                  </div>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">
                  Applying this backup will overwrite your current workspace with the restored records.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRestore}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-xs text-slate-950 font-bold"
                  >
                    Confirm Restore
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{validationResult.error}</span>
                </div>
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="w-full py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
