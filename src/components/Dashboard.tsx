import { FileText, Clock, AlertCircle, Briefcase, Zap } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { CounselAgent } from './CounselAgent';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { cases, activeCaseId, setActiveCaseId } = useLegalStore();

  const totalDocuments = cases.reduce((acc, c) => acc + c.documents.length, 0);
  const activeCases = cases.filter(c => c.status === 'Open' || c.status === 'Pending Court' || c.status === 'Drafting').length;
  const activeCase = cases.find(c => c.id === activeCaseId);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex items-end justify-between">
        <div>
            <h2 className="text-4xl font-serif font-black text-legal-900 italic tracking-tighter">Good Morning, Counsel.</h2>
            <p className="text-slate-400 font-medium mt-2">LexiNaija Active Intelligence Status: <span className="text-legal-900 font-bold">Optimal</span></p>
        </div>
        <div className="flex flex-col items-end">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monitor Case Workspace</label>
            <select 
                value={activeCaseId || ''} 
                onChange={e => setActiveCaseId(e.target.value)}
                className="bg-white border border-slate-100 px-6 py-3 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-sm cursor-pointer"
            >
                <option value="">-- No Active Focus --</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-10">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-serif font-bold text-lg text-legal-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { action: "Drafted Tenancy Agreement", time: "2 hours ago", client: "Musa Properties Ltd" },
              { action: "Research: Liability in Oil Spills", time: "5 hours ago", client: "Internal" },
              { action: "Summarized: SC.12/2023 Judgment", time: "Yesterday", client: "Chambers" },
            ].map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-medium text-legal-800">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.client}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
          <h3 className="font-serif font-black italic text-lg mb-6 relative z-10 tracking-tight">Legislative Briefings</h3>
          <div className="space-y-4 relative z-10">
            <div className="bg-legal-800/50 p-6 rounded-3xl border border-legal-700">
              <span className="text-[10px] text-legal-gold font-black uppercase tracking-[0.2em]">CAMA 2020 Protocol</span>
              <p className="text-sm mt-3 text-slate-300 leading-relaxed font-medium italic">Annual returns for incorporated trustees are due by June 30th. AI drafting is available in the Corporate Assistant.</p>
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