import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { FileText, Clock, AlertCircle, TrendingUp, Users, Gavel, ArrowRight, Activity, Zap, CheckCircle2, ChevronRight, Scale } from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { cases, clients, creditsTotal, creditsUsed } = useLegalStore();

  const totalDocuments = cases.reduce((acc, c) => acc + c.documents.length, 0);
  const activeCases = cases.filter(c => c.status === 'Open' || c.status === 'Pending Court' || c.status === 'Drafting').length;

  return (
    <div className="p-12 max-w-[1600px] mx-auto bg-slate-50/30 min-h-screen font-sans">
      {/* Header Section */}
      <header className="flex justify-between items-start mb-16 relative">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-legal-gold opacity-[0.03] blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.4em] mb-4">Operations Center</p>
          <h2 className="text-6xl font-serif font-black text-legal-900 leading-tight italic">
            Good Morning, <br />
            <span className="text-legal-gold not-italic">Learned Counsel.</span>
          </h2>
          <div className="flex items-center gap-4 mt-8 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
            <div className="flex -space-x-3 ml-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">LP</div>)}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4 border-r border-slate-100">Chambers active</p>
            <div className="flex items-center gap-2 px-3 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase">Encrypted</span>
            </div>
          </div>
        </div>

        <div className="bg-legal-900 p-8 rounded-[40px] text-white shadow-2xl shadow-legal-900/40 flex flex-col gap-6 min-w-[320px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-bl-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Intelligence Quota</p>
                    <h3 className="text-3xl font-black font-serif italic text-legal-gold">75%</h3>
                </div>
                <Zap size={24} className="text-legal-gold" />
            </div>
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-legal-gold to-yellow-500 h-full w-3/4 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">750 / 1,000 AI Units</p>
                <button 
                  onClick={() => onNavigate(AppView.SETTINGS)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Top Up
                </button>
            </div>
        </div>
      </header>

      {/* Grid: Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-legal-gold/20 transition-colors">
            <Gavel size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Files</p>
          <p className="text-6xl font-serif font-black text-legal-900 mb-2 italic">{activeCases}</p>
          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase">
            <TrendingUp size={14} /> +2 this week
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-legal-gold/20 transition-colors">
            <Users size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Client Base</p>
          <p className="text-6xl font-serif font-black text-legal-900 mb-2 italic">{clients.length}</p>
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase italic">
            Consolidated
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-legal-gold/20 transition-colors">
            <FileText size={80} strokeWidth={1} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Vaulted Docs</p>
          <p className="text-6xl font-serif font-black text-legal-900 mb-2 italic">{totalDocuments}</p>
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase">
            <Activity size={14} /> 48 syncs
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
          <button 
            onClick={() => onNavigate(AppView.DRAFTER)}
            className="w-full py-5 bg-legal-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-legal-900/20 hover:bg-legal-800 transition-all flex items-center justify-center gap-3 mb-4"
          >
            <Zap size={18} className="text-legal-gold" /> Fast Draft
          </button>
          <button 
            onClick={() => onNavigate(AppView.RESEARCH)}
            className="w-full py-5 bg-white border-2 border-legal-900 text-legal-900 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <Scale size={18} /> Research
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Activity Stream */}
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 p-12">
          <div className="flex justify-between items-center mb-12">
            <div>
                <h3 className="text-2xl font-serif font-black text-legal-900 uppercase tracking-tighter italic">Intelligence stream</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em] mt-2">Protocol Logs • Real-time</p>
            </div>
            <button 
              onClick={() => onNavigate(AppView.ANALYTICS)}
              className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-legal-900 transition-colors"
            >
                <MoreHorizontal />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { action: "Drafted Tenancy Agreement", time: "2 hours ago", client: "Musa Properties Ltd", type: "Draft" },
              { action: "Deep Research: Oil Spill Liability", time: "5 hours ago", client: "Federal High Court", type: "Research" },
              { action: "Automated: SC.12/2023 Analysis", time: "Yesterday", client: "Supreme Court", type: "Library" },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[30px] flex justify-between items-center transition-all duration-500 cursor-pointer hover:shadow-xl hover:shadow-slate-200/30">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      item.type === 'Draft' ? 'bg-legal-gold/10 text-legal-gold' : 
                      item.type === 'Research' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                  }`}>
                    {item.type === 'Draft' ? <PenTool size={24} /> : item.type === 'Research' ? <Scale size={24} /> : <BookOpen size={24} />}
                  </div>
                  <div>
                    <p className="text-lg font-black text-legal-900 tracking-tight">{item.action}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{item.client}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-2">{item.time}</p>
                    <ChevronRight className="ml-auto text-slate-200 group-hover:text-legal-gold group-hover:translate-x-1 transition-all" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Briefing */}
        <div className="lg:col-span-4 flex flex-col gap-12">
            <div className="bg-legal-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-legal-900/40 flex-1">
                <div className="absolute top-0 right-0 w-48 h-48 bg-legal-gold opacity-5 rounded-bl-full translate-x-10 -translate-y-10"></div>
                <h3 className="text-2xl font-serif font-black mb-8 italic uppercase tracking-tighter">Strategic Updates</h3>
                <div className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-legal-gold font-black uppercase tracking-widest">CAMA 2020 Compliance</span>
                            <CheckCircle2 size={14} className="text-legal-gold" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">Ensure all annual returns for <span className="text-white font-bold">Incorporated Trustees</span> are filed by June 30th to avoid statutory penalties.</p>
                    </div>
                    <div className="h-px bg-white/5"></div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Practice Direction</span>
                            <Activity size={14} className="text-blue-400" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">New <span className="text-white font-bold">E-Filing Portal</span> guidelines issued for Federal High Court, Lagos Division.</p>
                    </div>
                </div>
                
                <button className="mt-12 w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[.3em] transition-all">
                    View Full Intel
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-xl shadow-slate-200/40">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Protocol Maintenance</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-legal-900 uppercase">Cloud Sync</span>
                        <span className="text-[10px] font-black text-green-500 uppercase">Optimal</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-legal-900 uppercase">AI Core</span>
                        <span className="text-[10px] font-black text-legal-gold uppercase">V3.5 Turbo</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const MoreHorizontal = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
);
