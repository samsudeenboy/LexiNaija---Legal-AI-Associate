import React from 'react';
import { Scale, BookOpen, PenTool, LayoutDashboard, ShieldCheck, Users, Briefcase, CreditCard, FileText, Calendar, ShieldAlert, Settings, Calculator, Library, List, BrainCircuit, Archive, UserCheck, Feather, Building2, BarChart3, Gavel, Truck, Share2, LogOut, ChevronRight } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const practiceItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: AppView.DOCKET, label: 'Court Diary', icon: Calendar },
    { id: AppView.CASES, label: 'Case Files', icon: Briefcase },
    { id: AppView.BAILIFF, label: 'Bailiff Tracker', icon: Truck },
    { id: AppView.EVIDENCE, label: 'Evidence Locker', icon: Archive },
    { id: AppView.PORTAL, label: 'Client Portal', icon: Share2 },
    { id: AppView.BILLING, label: 'Billing & Fees', icon: CreditCard },
  ];

  const toolItems = [
    { id: AppView.STRATEGY, label: 'Strategy Advisor', icon: BrainCircuit },
    { id: AppView.BRIEFS, label: 'Smart Briefs', icon: Feather },
    { id: AppView.WITNESS, label: 'Witness Comp.', icon: UserCheck },
    { id: AppView.EDITOR, label: 'Drafting Desk', icon: FileText },
    { id: AppView.PRECEDENTS, label: 'Precedents', icon: Library },
    { id: AppView.DRAFTER, label: 'Smart Drafter', icon: PenTool },
    { id: AppView.RESEARCH, label: 'Legal Research', icon: Scale },
    { id: AppView.CASE_LAW, label: 'Law Reports', icon: Gavel },
    { id: AppView.CORPORATE, label: 'Corporate Desk', icon: Building2 },
    { id: AppView.PRACTICE_GUIDE, label: 'Practice Guides', icon: List },
  ];

  const utilityItems = [
    { id: AppView.CONFLICT_CHECK, label: 'Conflict Check', icon: ShieldAlert },
    { id: AppView.AUDIT, label: 'Audit Trail', icon: ShieldCheck },
    { id: AppView.SETTINGS, label: 'Firm Settings', icon: Settings },
  ];

  return (
    <div className="w-72 bg-legal-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Brand Header */}
      <div className="p-8 border-b border-white/5 relative group cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-[0.03] rounded-bl-full group-hover:opacity-10 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-legal-gold rounded-2xl flex items-center justify-center shadow-2xl shadow-legal-gold/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
            <ShieldCheck className="text-legal-900 w-7 h-7" />
          </div>
          <div className="flex flex-col">
              <h1 className="text-2xl font-serif font-black tracking-tighter text-white leading-none uppercase italic">LexiNaija</h1>
              <span className="text-[9px] font-black text-slate-500 mt-2 uppercase tracking-[.3em]">Associate Suite</span>
          </div>
        </div>
      </div>

      {/* Nav Content */}
      <nav className="flex-1 py-8 overflow-y-auto scrollbar-hide px-4">
        {/* Section: Practice */}
        <div className="mb-10">
            <div className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-[.4em] flex items-center gap-3">
                Operations
                <div className="h-px bg-white/5 flex-1"></div>
            </div>
            <ul className="space-y-1">
            {practiceItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                <li key={item.id}>
                    <button
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                        isActive 
                        ? 'bg-white text-legal-900 shadow-2xl shadow-white/5 font-black' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                        <div className="flex items-center gap-4">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-legal-gold' : 'group-hover:text-legal-gold'} transition-colors`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-legal-gold" />}
                    </button>
                </li>
                );
            })}
            </ul>
        </div>

        {/* Section: AI Tools */}
        <div className="mb-10">
            <div className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-[.4em] flex items-center gap-3">
                Intelligence
                <div className="h-px bg-white/5 flex-1"></div>
            </div>
            <ul className="space-y-1">
            {toolItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                <li key={item.id}>
                    <button
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                        isActive 
                        ? 'bg-white text-legal-900 shadow-2xl shadow-white/5 font-black' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                        <div className="flex items-center gap-4">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-legal-gold' : 'group-hover:text-legal-gold'} transition-colors`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-legal-gold" />}
                    </button>
                </li>
                );
            })}
            </ul>
        </div>

        {/* Section: System */}
        <div className="mb-8">
            <div className="px-4 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-[.4em] flex items-center gap-3">
                Protocol
                <div className="h-px bg-white/5 flex-1"></div>
            </div>
            <ul className="space-y-1">
            {utilityItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                <li key={item.id}>
                    <button
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                        isActive 
                        ? 'bg-white text-legal-900 shadow-2xl shadow-white/5 font-black' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                        <div className="flex items-center gap-4">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-legal-gold' : 'group-hover:text-legal-gold'} transition-colors`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-legal-gold" />}
                    </button>
                </li>
                );
            })}
            </ul>
        </div>
      </nav>

      {/* Credit Status & Logout */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-4 group hover:border-legal-gold/20 transition-all">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] text-legal-gold font-black uppercase tracking-widest">AI Quota</p>
            <Zap size={12} className="text-legal-gold fill-current" />
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-legal-gold to-yellow-500 w-3/4 h-full rounded-full group-hover:scale-x-105 transition-transform origin-left"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight text-right italic">750/1000 Credits Remaining</p>
        </div>

        <button className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-xs font-black uppercase tracking-widest">
            <LogOut size={16} /> Terminate Session
        </button>
      </div>
    </div>
  );
};
