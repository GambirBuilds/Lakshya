import React from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { KeyboardHelpModal } from './components/layout/KeyboardHelpModal';
import { ToastContainer } from './components/common/ToastContainer';
import { LevelUpModal } from './components/common/LevelUpModal';
import { FocusMusicModal } from './components/audio/FocusMusicModal';
import { TaskModal } from './components/tasks/TaskModal';
import { VoiceTaskModal } from './components/tasks/VoiceTaskModal';
import { OverdueRecoveryModal } from './components/tasks/OverdueRecoveryModal';
import { MorningModeModal } from './components/review/MorningModeModal';
import { NightReviewModal } from './components/review/NightReviewModal';
import { DistractionFreeView } from './components/focus/DistractionFreeView';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Projects } from './pages/Projects';
import { Calendar } from './pages/Calendar';
import { Goals } from './pages/Goals';
import { Eisenhower } from './pages/Eisenhower';
import { Focus } from './pages/Focus';
import { FocusGarden } from './pages/FocusGarden';
import { Habits } from './pages/Habits';
import { Achievements } from './pages/Achievements';
import { Analytics } from './pages/Analytics';
import { Journal } from './pages/Journal';
import { BrainDump } from './pages/BrainDump';
import { IdeaVault } from './pages/IdeaVault';
import { Notes } from './pages/Notes';
import { Templates } from './pages/Templates';
import { Cleanup } from './pages/Cleanup';
import { Settings } from './pages/Settings';

const MainLayout: React.FC = () => {
  const { currentPage, settings } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'projects': return <Projects />;
      case 'calendar': return <Calendar />;
      case 'goals': return <Goals />;
      case 'eisenhower': return <Eisenhower />;
      case 'focus': return <Focus />;
      case 'garden': return <FocusGarden />;
      case 'habits': return <Habits />;
      case 'achievements': return <Achievements />;
      case 'analytics': return <Analytics />;
      case 'journal': return <Journal />;
      case 'braindump': return <BrainDump />;
      case 'ideavault': return <IdeaVault />;
      case 'notes': return <Notes />;
      case 'templates': return <Templates />;
      case 'cleanup': return <Cleanup />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const getBackgroundClass = () => {
    if (settings.themeMode === 'light') {
      return 'bg-slate-100 text-slate-900';
    }
    switch (settings.backgroundStyle) {
      case 'gradient':
        return 'bg-gradient-to-br from-[#0c121e] via-[#090d16] to-[#04060a] text-slate-100';
      case 'abstract':
        return 'bg-[#090d16] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] text-slate-100';
      case 'forest':
        return 'bg-gradient-to-b from-[#06140e] via-[#080d14] to-[#04070a] text-slate-100';
      case 'space':
        return 'bg-gradient-to-b from-[#0e071e] via-[#080c18] to-[#03060c] text-slate-100';
      default:
        return 'bg-[#0b0f17] text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif] ${getBackgroundClass()}`}>
      {/* Sidebar for Desktop / Tablet */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Overlays */}
      <CommandPalette />
      <KeyboardHelpModal />
      <FocusMusicModal />
      <TaskModal />
      <VoiceTaskModal />
      <OverdueRecoveryModal />
      <MorningModeModal />
      <NightReviewModal />
      <DistractionFreeView />
      <LevelUpModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
      <VercelAnalytics />
    </AppProvider>
  );
}

export default App;
