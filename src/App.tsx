import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { CommandPalette } from './components/CommandPalette';
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Research = lazy(() => import('./components/Research').then(m => ({ default: m.Research })));
const Drafter = lazy(() => import('./components/Drafter').then(m => ({ default: m.Drafter })));
const Summarizer = lazy(() => import('./components/Summarizer').then(m => ({ default: m.Summarizer })));
const Clients = lazy(() => import('./components/Clients').then(m => ({ default: m.Clients })));
const Cases = lazy(() => import('./components/Cases').then(m => ({ default: m.Cases })));
const Billing = lazy(() => import('./components/Billing').then(m => ({ default: m.Billing })));
const DocumentEditor = lazy(() => import('./components/DocumentEditor').then(m => ({ default: m.DocumentEditor })));
const Docket = lazy(() => import('./components/Docket').then(m => ({ default: m.Docket })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const ConflictCheck = lazy(() => import('./components/ConflictCheck').then(m => ({ default: m.ConflictCheck })));
const Calculators = lazy(() => import('./components/Calculators').then(m => ({ default: m.Calculators })));
const Precedents = lazy(() => import('./components/Precedents').then(m => ({ default: m.Precedents })));
const PracticeGuide = lazy(() => import('./components/PracticeGuide').then(m => ({ default: m.PracticeGuide })));
const Strategy = lazy(() => import('./components/Strategy').then(m => ({ default: m.Strategy })));
const Evidence = lazy(() => import('./components/Evidence').then(m => ({ default: m.Evidence })));
const Witness = lazy(() => import('./components/Witness').then(m => ({ default: m.Witness })));
const Briefs = lazy(() => import('./components/Briefs').then(m => ({ default: m.Briefs })));
const Corporate = lazy(() => import('./components/Corporate').then(m => ({ default: m.Corporate })));
const Analytics = lazy(() => import('./components/Analytics').then(m => ({ default: m.Analytics })));
const CaseLawDatabase = lazy(() => import('./components/CaseLawDatabase').then(m => ({ default: m.CaseLawDatabase })));
const BailiffTracker = lazy(() => import('./components/BailiffTracker').then(m => ({ default: m.BailiffTracker })));
const ComplianceAudit = lazy(() => import('./components/ComplianceAudit').then(m => ({ default: m.ComplianceAudit })));
const ClientPortal = lazy(() => import('./components/ClientPortal').then(m => ({ default: m.ClientPortal })));
const Entertainment = lazy(() => import('./components/Entertainment').then(m => ({ default: m.Entertainment })));
const FeeCalculator = lazy(() => import('./components/FeeCalculator').then(m => ({ default: m.FeeCalculator })));
import { AppView } from './types';
import { LegalStoreProvider, useLegalStore } from './contexts/LegalStoreContext';
import { ToastProvider } from './contexts/ToastContext';

function AppContent() {
  const { currentView, setView } = useLegalStore();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onGetStarted={() => setView(AppView.AUTH)} />;
      case AppView.AUTH:
        return <Auth onAuthSuccess={() => setView(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setView} />;
      case AppView.DOCKET:
        return <Docket />;
      case AppView.RESEARCH:
        return <Research />;
      case AppView.DRAFTER:
        return <Drafter />;
      case AppView.SUMMARIZER:
        return <Summarizer />;
      case AppView.CLIENTS:
        return <Clients />;
      case AppView.CASES:
        return <Cases />;
      case AppView.BILLING:
        return <Billing />;
      case AppView.EDITOR:
        return <DocumentEditor />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.CONFLICT_CHECK:
        return <ConflictCheck />;
      case AppView.CALCULATORS:
        return <Calculators />;
      case AppView.PRECEDENTS:
        return <Precedents onNavigate={setView} />;
      case AppView.PRACTICE_GUIDE:
        return <PracticeGuide />;
      case AppView.STRATEGY:
        return <Strategy />;
      case AppView.EVIDENCE:
        return <Evidence />;
      case AppView.WITNESS:
        return <Witness />;
      case AppView.BRIEFS:
        return <Briefs />;
      case AppView.CORPORATE:
        return <Corporate />;
      case AppView.ENTERTAINMENT:
        return <Entertainment />;
      case AppView.CALCULATOR:
        return <FeeCalculator />;
      case AppView.ANALYTICS:
        return <Analytics />;
      case AppView.CASE_LAW:
        return <CaseLawDatabase />;
      case AppView.BAILIFF:
        return <BailiffTracker />;
      case AppView.AUDIT:
        return <ComplianceAudit />;
      case AppView.PORTAL:
        return <ClientPortal />;
      default:
        return <Dashboard onNavigate={setView} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      {(currentView !== AppView.LANDING && currentView !== AppView.AUTH) && <Sidebar currentView={currentView} setView={setView} />}
      <main className={`flex-1 ${(currentView !== AppView.LANDING && currentView !== AppView.AUTH) ? 'ml-64' : ''} overflow-auto scrollbar-hide ${currentView === AppView.EDITOR || currentView === AppView.DOCKET || currentView === AppView.EVIDENCE || currentView === AppView.WITNESS || currentView === AppView.BRIEFS || currentView === AppView.CORPORATE ? 'bg-white' : ''}`}>
        <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
          {renderView()}
        </Suspense>
      </main>
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view) => setView(view)}
      />
    </div>
  );
}

function App() {
  return (
    <LegalStoreProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </LegalStoreProvider>
  );
}

export default App;
