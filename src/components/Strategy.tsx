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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white z-10">
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
            <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Power</span>
                <span className="text-sm font-black text-legal-900 italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-legal-900 transition-colors">
                <X size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Parameters Panel */}
        <div className="w-[450px] border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden">
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
            
            <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-3xl">
              <div className="flex gap-3 mb-2">
                <Scale size={16} className="text-amber-500 shrink-0" />
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Advisory Notice</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium italic">
                Strategic opinions are predictive models based on reported Nigerian jurisprudence and should be cross-referenced with recent Law Reports.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-100">
            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !facts}
                className="w-full bg-legal-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center gap-3 disabled:opacity-20 group"
            >
                {isAnalyzing ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Play size={18} className="group-hover:translate-x-1 transition-transform" /> 
                )}
                {isAnalyzing ? 'Processing Merits...' : 'Synthesize Strategic Opinion'}
            </button>
          </div>
        </div>

        {/* Right Side: Output Panel */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {strategyReport ? (
            <>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <div>
                  <h3 className="text-xl font-serif font-black text-legal-900 italic tracking-tight flex items-center gap-3">
                    <Target size={20} className="text-legal-gold" /> Merits & Strategy Report
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-legal-900 hover:text-white rounded-xl transition-all"
                    title="Copy to Clipboard"
                  >
                    <Clipboard size={18} />
                  </button>
                  <button 
                    onClick={() => setShowArchiveModal(true)}
                    className="flex items-center gap-2 bg-legal-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-legal-gold hover:text-legal-900 transition-all shadow-lg"
                  >
                    <Bookmark size={16} /> Archive to Matter
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