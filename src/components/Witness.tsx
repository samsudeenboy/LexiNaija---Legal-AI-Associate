import React, { useState, useRef } from 'react';
import { 
  UserCheck, MessageSquare, Zap, Gavel, Save, AlertCircle, 
  ChevronRight, RefreshCw, Clipboard, Bookmark, ShieldAlert, Sparkles, X
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { analyzeWitnessStatement } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../contexts/ToastContext';
import { MatterArchiveModal } from './MatterArchiveModal';

export const Witness: React.FC = () => {
  const { showToast } = useToast();
  const { cases, consumeCredits, creditsTotal, creditsUsed } = useLegalStore();
  const [statement, setStatement] = useState('');
  const [opposingRole, setOpposingRole] = useState('Opposing Party');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const handleAnalyze = async () => {
    if (!statement.trim()) {
      showToast("Please provide witness statement text.", "warning");
      return;
    }
    if (!consumeCredits(4)) {
      showToast("Insufficient Intelligence Credits.", "error");
      return;
    }
    setIsAnalyzing(true);
    setAnalysis('');
    try {
      const result = await analyzeWitnessStatement(statement, opposingRole);
      setAnalysis(result);
      showToast("Cross-examination strategy synthesized.", "success");
    } catch (e) {
      showToast("Analysis protocol failure.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    showToast("Strategy copied to briefcase.", "info");
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <UserCheck className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">WITNESS COMPANION INTELLIGENCE</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Jurisdictional Context: Evidence Act (Nigeria)</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-3 shadow-lg">
                <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">Efficiency</span>
                <span className="text-sm font-black text-white italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-legal-900 transition-all hover:bg-white shadow-sm">
                <X size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10 p-6 gap-6">
        {/* Left Side: Input Panel */}
        <div className="w-[450px] bg-white/70 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 flex-1 overflow-y-auto space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-legal-gold" /> Statement Identification
              </label>
              <select 
                value={opposingRole}
                onChange={e => setOpposingRole(e.target.value)}
                className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all cursor-pointer"
              >
                <option value="Claimant">Witness for Claimant</option>
                <option value="Defendant">Witness for Defendant</option>
                <option value="Prosecution">Prosecution Witness</option>
                <option value="Expert">Expert Witness</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Deposition Text / Scanned Statement</label>
              <textarea 
                value={statement}
                onChange={e => setStatement(e.target.value)}
                placeholder="Paste the statement on oath here for hearsay analysis..."
                className="w-full h-96 bg-white border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner scrollbar-hide"
              />
            </div>
            
            <div className="p-8 bg-legal-900/5 border border-legal-gold/10 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-legal-gold opacity-5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex gap-3 mb-3 relative">
                <ShieldAlert size={16} className="text-legal-gold shrink-0" />
                <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest">Intelligence Notice</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic relative">
                Our synthesis protocol cross-references Section 126 of the Evidence Act 2011 to detect inadmissible hearsay and direct testimony gaps.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white/50 backdrop-blur-md border-t border-white flex-shrink-0">
            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !statement}
                className="w-full bg-legal-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center gap-3 disabled:opacity-20 group active:scale-95"
            >
                {isAnalyzing ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Zap size={18} className="group-hover:scale-125 transition-transform" /> 
                )}
                {isAnalyzing ? 'Auditing Testimony...' : 'Synthesize Cross-Protocol'}
            </button>
          </div>
        </div>

        {/* Right Side: Output Panel */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl overflow-hidden flex flex-col">
          {analysis ? (
            <>
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-legal-900 rounded-[20px] flex items-center justify-center shadow-xl shadow-legal-900/10">
                    <Gavel size={24} className="text-legal-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Strategic Cross-Protocol</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Merits: High Probative Load</p>
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
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
                      <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Deconstructing Testimony</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Correlating with Evidence Act Provisions...</p>
                    </div>
                 </div>
               ) : (
                 <div className="max-w-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                      <Sparkles className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter mb-4">Awaiting Testimony</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Supply the witness statement in the left panel to initialize cross-examination strategy and hearsay detection.
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
        documentContent={analysis}
        documentType="Research"
        defaultTitle={`Cross-Exam Protocol: ${opposingRole}`}
      />
    </div>
  );
};