import React, { useState } from 'react';
import { 
    Feather, BookOpen, Save, Gavel, Scale, Play, Copy, CheckCircle2,
    RefreshCw, X, Zap, Bookmark, ChevronRight, Clipboard
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateLegalArgument } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../contexts/ToastContext';
import { MatterArchiveModal } from './MatterArchiveModal';

export const Briefs: React.FC = () => {
  const { showToast } = useToast();
  const { cases, consumeCredits, creditsTotal, creditsUsed } = useLegalStore();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  
  const [formData, setFormData] = useState({
      issue: '',
      stance: 'Applicant/Claimant',
      jurisdiction: 'High Court of Lagos State',
      facts: ''
  });

  const [argument, setArgument] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-fill facts when case selected
  const handleCaseSelect = (caseId: string) => {
      setSelectedCaseId(caseId);
      const c = cases.find(item => item.id === caseId);
      if (c) {
          setFormData(prev => ({
              ...prev,
              facts: c.notes || '',
              jurisdiction: c.court || prev.jurisdiction
          }));
          showToast(`Ingested context from ${c.suitNumber || 'Case File'}`, "info");
      }
  };

  const handleGenerate = async () => {
      if (!formData.issue.trim() || !formData.facts.trim()) {
          showToast("Please provide legal issue and facts.", "warning");
          return;
      }
      if (!consumeCredits(8)) {
          showToast("Insufficient Intelligence Credits.", "error");
          return;
      }
      setIsGenerating(true);
      setArgument('');
      try {
          const result = await generateLegalArgument(formData.issue, formData.stance, formData.facts, formData.jurisdiction);
          setArgument(result);
          showToast("Legal argument drafted with citations.", "success");
      } catch (e) {
          showToast("Advocacy script generation failure.", "error");
      } finally {
          setIsGenerating(false);
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(argument);
      showToast("Argument copied to briefcase.", "info");
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <Feather className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">SMART BRIEFS & ADVOCACY</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Internal Drafting Protocol: IRAC Methodology</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Counsel</span>
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Link to Litigation File</label>
                <select 
                    value={selectedCaseId}
                    onChange={e => handleCaseSelect(e.target.value)}
                    className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all cursor-pointer shadow-sm"
                >
                    <option value="">-- Associate with Matter --</option>
                    {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Issue for Determination</label>
                <input 
                    type="text"
                    value={formData.issue}
                    onChange={e => setFormData({...formData, issue: e.target.value})}
                    className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                    placeholder="e.g. Whether the Claimant is entitled to the reliefs..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Argue For</label>
                    <select 
                        value={formData.stance}
                        onChange={e => setFormData({...formData, stance: e.target.value})}
                        className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 outline-none cursor-pointer"
                    >
                        <option>Applicant/Claimant</option>
                        <option>Respondent/Defendant</option>
                        <option>Appellant</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Target Forum</label>
                    <input 
                        type="text"
                        value={formData.jurisdiction}
                        onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                        className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Relevant Facts for Argument</label>
                <textarea 
                    value={formData.facts}
                    onChange={e => setFormData({...formData, facts: e.target.value})}
                    placeholder="Provide specific facts to be synthesized into the legal argument..."
                    className="w-full h-80 bg-white border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
                />
            </div>
            
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
              <div className="flex gap-3 mb-2">
                <Scale size={16} className="text-legal-gold shrink-0" />
                <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest text-left">Advocacy Standards</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium text-left italic">
                Arguments are structured in Issue, Rule, Application, and Conclusion (IRAC) format with illustrative Nigerian case law.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-100">
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.issue}
                className="w-full bg-legal-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center justify-center gap-3 disabled:opacity-20 group"
            >
                {isGenerating ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Zap size={18} className="group-hover:scale-125 transition-transform" /> 
                )}
                {isGenerating ? 'Drafting Submission...' : 'Generate Legal Argument'}
            </button>
          </div>
        </div>

        {/* Right Side: Output Panel */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {argument ? (
            <>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <div>
                  <h3 className="text-xl font-serif font-black text-legal-900 italic tracking-tight flex items-center gap-3">
                    <Gavel size={20} className="text-legal-gold" /> Drafted Legal Submission
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: Ready for Review</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-legal-900 hover:text-white rounded-xl transition-all"
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
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-p:font-serif prose-p:text-lg">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{argument}</ReactMarkdown>
                    </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-1000">
               {isGenerating ? (
                 <div className="space-y-6">
                    <div className="w-24 h-24 border-4 border-slate-50 border-t-legal-gold rounded-full animate-spin mx-auto"></div>
                    <div>
                      <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Drafting Submissions</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Searching for relevant Nigerian Authorities...</p>
                    </div>
                 </div>
               ) : (
                 <div className="max-w-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                      <BookOpen className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter mb-4">Empty Address</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Define the issue and provide supporting facts in the left panel to initialize the drafting of a formal written address.
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
        documentContent={argument}
        documentType="Draft"
        defaultTitle={`Legal Argument: ${formData.issue.substring(0, 20)}...`}
      />
    </div>
  );
};