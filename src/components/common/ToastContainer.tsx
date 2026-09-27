import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Trophy, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'achievement' ? (
            <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-md shadow-2xl text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-100 leading-tight">{toast.title}</h4>
              {toast.message && <p className="text-xs text-slate-400 mt-0.5 leading-snug">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
