import { FileText, Clock, AlertCircle, Briefcase, Zap, Gavel, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { CounselAgent } from './CounselAgent';
import { getCasesApproachingLimitation, getLimitationUrgency } from '../services/limitationCalculator';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { cases, activeCaseId, setActiveCaseId } = useLegalStore();

  const totalDocuments = cases.reduce((acc, c) => acc + c.documents.length, 0);
  const activeCases = cases.filter(c => c.status === 'Open' || c.status === 'Pending Court' || c.status === 'Drafting').length;
  const activeCase = cases.find(c => c.id === activeCaseId);
  
  // Get cases approaching limitation
  const limitationCases = getCasesApproachingLimitation(cases, 90);
  const criticalCases = limitationCases.filter(c => c.urgency.level === 'critical');
  const warningCases = limitationCases.filter(c => c.urgency.level === 'warning' || c.urgency.level === 'attention');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
                Intelligence Online
            </div>
            <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Good Morning,<br/>Counsel.</h2>
            <p className="text-slate-400 font-medium">Your legal workspace is synchronized and <span className="text-legal-900 font-bold">Optimal</span>.</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
            <div className="bg-legal-900 text-white rounded-[32px] p-1.5 flex items-center shadow-2xl ring-4 ring-legal-900/5">
                <div className="px-6 py-3">
                    <label className="block text-[8px] font-black text-legal-gold uppercase tracking-[0.2em] mb-1 opacity-70">Case Focus Selector</label>
                    <select 
                        value={activeCaseId || ''} 
                        onChange={e => setActiveCaseId(e.target.value)}
                        className="bg-transparent text-sm font-black text-white outline-none cursor-pointer appearance-none min-w-[200px]"
                    >
                        <option value="" className="text-legal-900">-- Select Active Focus --</option>
                        {cases.map(c => <option key={c.id} value={c.id} className="text-legal-900">{c.title}</option>)}
                    </select>
                </div>
                <div className="w-12 h-12 bg-legal-gold rounded-full flex items-center justify-center text-legal-900">
                    <Briefcase size={20} />
                </div>
            </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Statute of Limitations Kill-Switch Widget */}
        {limitationCases.length > 0 && (
            <div className="md:col-span-3 space-y-4">
                {criticalCases.length > 0 && (
                    <div className="bg-rose-50 p-6 rounded-[24px] shadow-sm border-2 border-rose-200 animate-pulse">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                                    <AlertTriangle size={28} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-rose-900 font-black text-xl font-serif italic tracking-tight">CRITICAL: Statute of Limitations Alert</h3>
                                        <span className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                                            {criticalCases.length} Critical
                                        </span>
                                    </div>
                                    <p className="text-rose-700 text-sm font-medium mb-3">
                                        These matters will become statute-barred within 30 days. Immediate filing action required.
                                    </p>
                                    <div className="space-y-2">
                                        {criticalCases.slice(0, 3).map(c => (
                                            <div key={c.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-rose-900 text-sm">{c.title}</p>
                                                    <p className="text-xs text-rose-600 font-black">
                                                        {c.urgency.message}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => { setActiveCaseId(c.id); onNavigate('CASES'); }}
                                                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors"
                                                >
                                                    Review Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => onNavigate('CASES')}
                                className="bg-rose-600 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 shrink-0"
                            >
                                View All<br/>Critical
                            </button>
                        </div>
                    </div>
                )}
                
                {warningCases.length > 0 && criticalCases.length === 0 && (
                    <div className="bg-amber-50 p-6 rounded-[24px] shadow-sm border border-amber-200">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-amber-900 font-black text-lg font-serif italic tracking-tight">Limitation Warning</h3>
                                    <p className="text-amber-700 text-xs font-medium">
                                        {warningCases.length} matter(s) approaching limitation within 90 days. Begin preparation.
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => onNavigate('CASES')} className="bg-amber-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-colors">
                                Review Docket
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Active Matters</h3>
            <AlertCircle className="text-legal-gold w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-legal-900">{activeCases}</p>
          <p className="text-xs text-green-600 mt-1">Files currently open</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Research Queries</h3>
            <Clock className="text-legal-gold w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-legal-900">48</p>
          <p className="text-xs text-gray-400 mt-1">This month (Simulated)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Documents Drafted</h3>
            <FileText className="text-legal-gold w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-legal-900">{totalDocuments}</p>
          <p className="text-xs text-blue-600 mt-1">Across all active cases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Matter Deep Analysis */}
        <div className="lg:col-span-8 space-y-10">
          {activeCase ? (
            <div className="bg-legal-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-legal-gold/10 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <span className="text-[10px] font-black text-legal-gold uppercase tracking-[0.3em]">Deep Analysis: Active Matter</span>
                            <h3 className="text-3xl font-serif font-black italic tracking-tight mt-2">{activeCase.title}</h3>
                            <p className="text-slate-400 text-sm mt-1">{activeCase.suitNumber || 'No Suit Number Assigned'}</p>
                        </div>
                        <div className="px-4 py-2 bg-legal-gold/20 border border-legal-gold/30 rounded-xl text-legal-gold text-[10px] font-black uppercase tracking-widest">
                            {activeCase.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Matter Archive</p>
                            <p className="text-xl font-bold">{activeCase.documents.length}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Evidence Locker</p>
                            <p className="text-xl font-bold">{activeCase.evidence?.length || 0}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Billable Events</p>
                            <p className="text-xl font-bold">{activeCase.billableItems?.length || 0}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Next Appearance</p>
                            <p className="text-xl font-bold">{activeCase.nextHearing || 'TBD'}</p>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[40px] p-20 border-2 border-dashed border-slate-200 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="text-slate-300" size={32} />
                </div>
                <h4 className="text-xl font-serif font-black text-slate-400 italic">No Matter in Focus</h4>
                <p className="text-xs text-slate-400 mt-2 uppercase font-black tracking-widest">Select a case to initialize deep intelligence analysis</p>
            </div>
          )}

          {/* Legislative Briefings */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-legal-900 uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-legal-gold"></span>
              Legislative Intelligence Briefings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500">
                            <AlertCircle size={16} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CAMA 2020 Protocol</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium italic">Annual returns for incorporated trustees are due by June 30th. AI drafting is available in Corporate Assistant.</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                            <Gavel size={16} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Practice Directive v2</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium italic">New electronic filing protocols for FHC Lagos are now operational. Verifying compatibility with LexiNaija archiving.</p>
                </div>
            </div>
          </div>
        </div>

        {/* Agent Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2 px-1">
                <Zap className="text-legal-gold fill-legal-gold" size={16} />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Agent Intelligence</h3>
            </div>
            <CounselAgent onNavigate={onNavigate} />
            
            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Firm Productivity</h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-legal-900">
                        <span>Research Efficiency</span>
                        <span className="text-emerald-500">+12%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%]"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};