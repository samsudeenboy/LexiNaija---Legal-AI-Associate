import React, { useState, useEffect } from 'react';
import { 
    Lightbulb, Target, Shield, AlertTriangle, FileText, Save, Play, BrainCircuit,
    ChevronRight, RefreshCw, Bookmark, Sparkles, Scale, X, Clipboard
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateCaseStrategy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../contexts/ToastContext';
import { MatterArchiveModal } from './MatterArchiveModal';

export const Strategy: React.FC = () => {
  const { showToast } = useToast();
  const { cases, consumeCredits, creditsTotal, creditsUsed } = useLegalStore();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [role, setRole] = useState('Claimant/Plaintiff');
  const [jurisdiction, setJurisdiction] = useState('Lagos State High Court');
  const [facts, setFacts] = useState('');
  const [strategyReport, setStrategyReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Auto-fill facts when a case is selected
  useEffect(() => {
    if (selectedCaseId) {
        const c = cases.find(caseItem => caseItem.id === selectedCaseId);
        if (c) {
            setFacts(c.notes || '');
            if (c.court) setJurisdiction(c.court);
            showToast(`Ingested context from: ${c.suitNumber || 'Case File'}`, "info");
        }
    }
  }, [selectedCaseId, cases]);

  const handleAnalyze = async () => {
    if (!facts.trim()) {
        showToast("Please provide case facts for analysis.", "warning");
        return;
    }
    if (!consumeCredits(10)) {
        showToast("Insufficient Intelligence Credits.", "error");
        return;
    }
    setIsAnalyzing(true);
    setStrategyReport('');
    try {
        const report = await generateCaseStrategy(facts, role, jurisdiction);
        setStrategyReport(report);
        showToast("Strategic opinion synthesized successfully.", "success");
    } catch (e) {
        showToast("Strategy protocol failure.", "error");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(strategyReport);
    showToast("Strategy copied to briefcase.", "info");
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <BrainCircuit className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">CASE STRATEGY ADVISORY</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Cognitive Merits Assessment Protocol</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-3 shadow-lg">
                <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">Power</span>
                <span className="text-sm font-black text-white italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-legal-900 transition-all hover:bg-white shadow-sm">
                <X size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10 p-6 gap-6">
        {/* Left Side: Parameters Panel */}
        <div className="w-[450px] bg-white/70 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ingest Context from Matter</label>
                <select 
                    value={selectedCaseId}
                    onChange={e => setSelectedCaseId(e.target.value)}
                    className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all cursor-pointer"
                >
                    <option value="">-- Manual Initialization --</option>
                    {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Litigant Role</label>
                    <select 
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all cursor-pointer"
                    >
                        <option>Claimant/Plaintiff</option>
                        <option>Defendant</option>
                        <option>Applicant</option>
                        <option>Respondent</option>
                        <option>Appellant</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Jurisdictional Forum</label>
                    <input 
                        type="text"
                        value={jurisdiction}
                        onChange={e => setJurisdiction(e.target.value)}
                        className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                        placeholder="e.g. FHC, Lagos Division"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Brief Facts & Learned Counsel's Notes</label>
                <textarea 
                    value={facts}
                    onChange={e => setFacts(e.target.value)}
                    placeholder="Provide the substantive facts of the matter for merits deconstruction..."
                    className="w-full h-80 bg-white border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
                />
            </div>
            
            <div className="p-8 bg-legal-900/5 border border-legal-gold/10 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-legal-gold opacity-5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex gap-3 mb-3 relative">
                <Scale size={16} className="text-legal-gold shrink-0" />
                <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest">Advisory Notice</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic relative">
                Strategic opinions are predictive models based on reported Nigerian jurisprudence (SC/CA/FHC) and should be validated with recent Law Reports.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white/50 backdrop-blur-md border-t border-white flex-shrink-0">
            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !facts}
                className="w-full bg-legal-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center gap-3 disabled:opacity-20 group active:scale-95"
            >
                {isAnalyzing ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Play size={18} className="group-hover:scale-125 transition-transform" /> 
                )}
                {isAnalyzing ? 'Processing Merits...' : 'Synthesize Strategic Opinion'}
            </button>
          </div>
        </div>

        {/* Right Side: Output Panel */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl overflow-hidden flex flex-col">
          {strategyReport ? (
            <>
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-legal-900 rounded-[20px] flex items-center justify-center shadow-xl shadow-legal-900/10">
                    <Target size={24} className="text-legal-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Merits & Strategy Report</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Generation: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={copyToClipboard}
                    className="p-4 bg-white text-slate-400 hover:bg-legal-900 hover:text-white rounded-[20px] border border-slate-100 transition-all shadow-sm hover:shadow-xl active:scale-95"
                    title="Copy to Clipboard"
                  >
                    <Clipboard size={18} />
                  </button>
                  <button 
                    onClick={() => setShowArchiveModal(true)}
                    className="flex items-center gap-3 bg-legal-900 text-white px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-legal-gold hover:text-legal-900 transition-all shadow-2xl shadow-legal-900/20 active:scale-95 group"
                  >
                    <Bookmark size={16} className="group-hover:-translate-y-1 transition-transform" /> Archive to Matter
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-slate-50/10">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{strategyReport}</ReactMarkdown>
                    </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-1000">
               {isAnalyzing ? (
                 <div className="space-y-6">
                    <div className="w-24 h-24 border-4 border-slate-50 border-t-legal-gold rounded-full animate-spin mx-auto"></div>
                    <div>
                      <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Running Merits Simulation</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Constructing SWOT Analysis for Counsel...</p>
                    </div>
                 </div>
               ) : (
                 <div className="max-w-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                      <Lightbulb className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter mb-4">Strategic Vacuum</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Initialize a simulation by providing the case trajectory and facts in the advisory control panel.
                    </p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      <MatterArchiveModal 
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        documentContent={strategyReport}
        documentType="Research"
        defaultTitle={`Legal Strategy: ${role}`}
      />
    </div>
  );
};