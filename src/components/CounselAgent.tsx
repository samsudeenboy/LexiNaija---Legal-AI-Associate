import React from 'react';
import { 
    BrainCircuit, Sparkles, ChevronRight, X, AlertCircle, 
    FileWarning, Calendar, Zap, ArrowRight 
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Suggestion } from '../types';

interface CounselAgentProps {
    onNavigate: (view: any) => void;
}

export const CounselAgent: React.FC<CounselAgentProps> = ({ onNavigate }) => {
  const { suggestions, dismissSuggestion, activeCaseId, cases } = useLegalStore();
  const activeCase = cases.find(c => c.id === activeCaseId);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-right-8 duration-500">
      <div className="p-6 bg-legal-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-legal-gold rounded-xl flex items-center justify-center">
            <BrainCircuit className="text-legal-900" size={18} />
          </div>
          <div>
            <h3 className="text-white font-serif font-black italic text-sm tracking-tight">COUNSEL AGENT</h3>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active Intelligence Feed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-legal-gold rounded-full text-[9px] font-black text-legal-900">{suggestions.length}</span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
        {suggestions.map((s) => (
          <div key={s.id} className="p-6 hover:bg-slate-50/50 transition-colors group relative">
            <button 
                onClick={() => dismissSuggestion(s.id)}
                className="absolute top-4 right-4 text-slate-200 hover:text-slate-400 transition-colors"
            >
                <X size={14} />
            </button>

            <div className="flex gap-4">
              <div className="mt-1">
                {s.type === 'missing_evidence' && <FileWarning className="text-amber-500" size={20} />}
                {s.type === 'deadline' && <Calendar className="text-red-500" size={20} />}
                {s.type === 'action' && <Zap className="text-legal-gold" size={20} />}
                {s.type === 'insight' && <Sparkles className="text-blue-500" size={20} />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                        s.priority === 'High' ? 'text-red-500' : s.priority === 'Medium' ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                        {s.priority} Priority
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeCase?.suitNumber || 'General'}</span>
                </div>
                <h4 className="text-sm font-black text-legal-900 italic font-serif leading-tight mb-2 tracking-tight">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{s.description}</p>
                
                <button 
                  onClick={() => onNavigate(s.targetView)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-legal-900 hover:text-legal-gold transition-all group/btn"
                >
                  {s.actionLabel} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-center">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agent Monitoring Case: {activeCase?.title || 'None'}</p>
      </div>
    </div>
  );
};
