import React from 'react';
import { Scale, BookOpen, PenTool, LayoutDashboard, ShieldCheck, Users, Briefcase, CreditCard, FileText, Calendar, ShieldAlert, Settings, Calculator, Library, List, BrainCircuit, Archive, UserCheck, Feather, Building2, BarChart3, Gavel, Truck } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const practiceItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: AppView.DOCKET, label: 'Court Diary & Tasks', icon: Calendar },
    { id: AppView.CASES, label: 'Case Files', icon: Briefcase },
    { id: AppView.EVIDENCE, label: 'Evidence & Exhibits', icon: Archive },
    { id: AppView.BAILIFF, label: 'Bailiff Tracker', icon: Truck },
    { id: AppView.CLIENTS, label: 'Client Directory', icon: Users },
    { id: AppView.BILLING, label: 'Billing & Fees', icon: CreditCard },
  ];

  const toolItems = [
    { id: AppView.STRATEGY, label: 'Strategy Advisor', icon: BrainCircuit },
    { id: AppView.BRIEFS, label: 'Smart Briefs', icon: Feather },
    { id: AppView.WITNESS, label: 'Witness Companion', icon: UserCheck },
    { id: AppView.CORPORATE, label: 'Corporate Assistant', icon: Building2 },
    { id: AppView.PRACTICE_GUIDE, label: 'Practice Guides', icon: List },
    { id: AppView.EDITOR, label: 'Documents', icon: FileText },
    { id: AppView.PRECEDENTS, label: 'Precedents Library', icon: Library },
    { id: AppView.DRAFTER, label: 'Smart Drafter', icon: PenTool },
    { id: AppView.RESEARCH, label: 'Legal Research', icon: Scale },
    { id: AppView.SUMMARIZER, label: 'Case Analyzer', icon: BookOpen },
    { id: AppView.CASE_LAW, label: 'Case Law DB', icon: Gavel },
    { id: AppView.CALCULATORS, label: 'Legal Calculators', icon: Calculator },
    { id: AppView.CONFLICT_CHECK, label: 'Conflict Check', icon: ShieldAlert },
    { id: AppView.SETTINGS, label: 'Firm Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-legal-900 text-white h-screen flex flex-col fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 border-b border-legal-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-legal-gold rounded-sm flex items-center justify-center">
          <ShieldCheck className="text-legal-900 w-5 h-5" />
        </div>
        <div className="flex flex-col">
            <h1 className="text-lg font-serif font-bold tracking-wide text-gray-100 leading-none">LexiNaija</h1>
            <span className="text-[10px] text-gray-400 mt-1">Associate Suite</span>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
        <div className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Practice</div>
        <ul className="space-y-1 mb-6">
          {practiceItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 transition-colors duration-200 border-l-4 ${
                    isActive 
                      ? 'bg-legal-800 border-legal-gold text-white' 
                      : 'border-transparent text-gray-400 hover:bg-legal-800 hover:text-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-legal-gold' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
        <ul className="space-y-1">
          {toolItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 transition-colors duration-200 border-l-4 ${
                    isActive 
                      ? 'bg-legal-800 border-legal-gold text-white' 
                      : 'border-transparent text-gray-400 hover:bg-legal-800 hover:text-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-legal-gold' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-legal-700">
        <div className="bg-legal-800 rounded-lg p-4 border border-legal-700">
          <p className="text-xs text-legal-gold uppercase font-bold mb-1">LexiNaija Pro</p>
          <p className="text-xs text-gray-400 mb-3">Enterprise License</p>
          <div className="w-full bg-legal-700 h-1.5 rounded-full">
            <div className="bg-legal-gold w-3/4 h-1.5 rounded-full"></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-right">750/1000 credits used</p>
        </div>
      </div>
    </div>
  );
};