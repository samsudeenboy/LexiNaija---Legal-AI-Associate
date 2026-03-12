import React, { useState } from 'react';
import { 
    Building2, FileCheck, HelpCircle, PenTool, Copy, Save, Sparkles, Building, Play,
    ChevronRight, ChevronLeft, Briefcase, Zap, X, Clipboard, ShieldCheck
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateCorporateObjects, generateCorporateResolution, generateComplianceAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../contexts/ToastContext';
import { MatterArchiveModal } from './MatterArchiveModal';

type Tab = 'objects' | 'resolutions' | 'compliance';

export const Corporate: React.FC = () => {
  const { showToast } = useToast();
  const { consumeCredits, creditsTotal, creditsUsed } = useLegalStore();
  const [activeTab, setActiveTab] = useState<Tab>('objects');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  
  // Objects State
  const [bizDesc, setBizDesc] = useState('');

  // Resolution State
  const [resCompany, setResCompany] = useState('');
  const [resAction, setResAction] = useState('');
  const [resDirectors, setResDirectors] = useState('');
  const [resType, setResType] = useState<'Board' | 'General'>('Board');

  // Compliance State
  const [compQuery, setCompQuery] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult('');
    try {
        let output = '';
        if (activeTab === 'objects') {
            if (!bizDesc.trim()) { showToast("Enter business description.", "warning"); setIsLoading(false); return; }
            if (!consumeCredits(3)) { showToast("Insufficient credits.", "error"); setIsLoading(false); return; }
            output = await generateCorporateObjects(bizDesc);
        } else if (activeTab === 'resolutions') {
            if (!resCompany || !resAction) { showToast("Enter company details.", "warning"); setIsLoading(false); return; }
            if (!consumeCredits(4)) { showToast("Insufficient credits.", "error"); setIsLoading(false); return; }
            output = await generateCorporateResolution(resAction, resCompany, resDirectors, resType);
        } else if (activeTab === 'compliance') {
            if (!compQuery) { showToast("Enter compliance query.", "warning"); setIsLoading(false); return; }
            if (!consumeCredits(5)) { showToast("Insufficient credits.", "error"); setIsLoading(false); return; }
            output = await generateComplianceAdvice(compQuery);
        }
        setResult(output);
        setStep(2); // Move to results step
        showToast("Corporate instrument drafted successfully.", "success");
    } catch (e) {
        showToast("Drafting protocol failure.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    showToast("Content copied to clipboard.", "info");
  };

  const resetWizard = () => {
    setStep(1);
    setResult('');
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <Building2 className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">CORPORATE & COMPLIANCE UNIT</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Regulatory Framework: CAMA 2020 (Nigeria)</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                <span className="text-sm font-black text-legal-900 italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-legal-900 transition-colors">
                <X size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-slate-50/30 overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-4xl bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden relative z-10 h-full max-h-[850px]">
          
          {/* Internal Navigation */}
          {step === 1 && (
            <div className="flex border-b border-slate-50 px-10 pt-8 shrink-0">
                {(['objects', 'resolutions', 'compliance'] as Tab[]).map((t) => (
                    <button 
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === t ? 'text-legal-900' : 'text-slate-300 hover:text-slate-500'}`}
                    >
                        {t}
                        {activeTab === t && <div className="absolute bottom-0 left-8 right-8 h-1 bg-legal-gold rounded-full transition-all"></div>}
                    </button>
                ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden flex flex-col p-12">
            
            {step === 1 ? (
              <div className="flex-1 flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-start gap-8">
                    <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center shrink-0">
                        {activeTab === 'objects' && <PenTool className="text-legal-gold" size={24} />}
                        {activeTab === 'resolutions' && <FileCheck className="text-legal-gold" size={24} />}
                        {activeTab === 'compliance' && <HelpCircle className="text-legal-gold" size={24} />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-black text-legal-900 italic tracking-tighter mb-2">
                            {activeTab === 'objects' && "MoU Objects Clause Synthesis"}
                            {activeTab === 'resolutions' && "Entity Resolution Drafting"}
                            {activeTab === 'compliance' && "CAC Compliance Advisory"}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium max-w-lg">
                            {activeTab === 'objects' && "Generate standard legal object clauses for the Memorandum of Association based on business operations."}
                            {activeTab === 'resolutions' && "Draft formal board or general meeting resolutions compliant with CAMA statutory requirements."}
                            {activeTab === 'compliance' && "Receive preliminary guidance on post-incorporation filings, share capital, and regulatory deadlines."}
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    {activeTab === 'objects' && (
                        <div className="h-full flex flex-col">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Business Operations</label>
                            <textarea 
                                value={bizDesc}
                                onChange={e => setBizDesc(e.target.value)}
                                className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
                                placeholder="e.g. A company specializing in maritime logistics, offshore vessel chartering, and general import/export trade..."
                            />
                        </div>
                    )}

                    {activeTab === 'resolutions' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6 col-span-1">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Entity Name</label>
                                    <input 
                                        type="text"
                                        value={resCompany}
                                        onChange={e => setResCompany(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner"
                                        placeholder="Globex Solutions Ltd"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Meeting Type</label>
                                    <select 
                                        value={resType} 
                                        onChange={e => setResType(e.target.value as any)}
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner cursor-pointer"
                                    >
                                        <option value="Board">Board of Directors Resolution</option>
                                        <option value="General">Ordinary/Special General Resolution</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Attendance / Signatories</label>
                                    <input 
                                        type="text"
                                        value={resDirectors}
                                        onChange={e => setResDirectors(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner"
                                        placeholder="e.g. Emeka Okafor, Sarah Bello"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subject Matter of Resolution</label>
                                <textarea 
                                    value={resAction}
                                    onChange={e => setResAction(e.target.value)}
                                    className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
                                    placeholder="e.g. To increase the authorized share capital of the company from 1 million to 10 million shares..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'compliance' && (
                        <div className="h-full flex flex-col">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Counsel's Compliance Inquiry</label>
                            <textarea 
                                value={compQuery}
                                onChange={e => setCompQuery(e.target.value)}
                                className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
                                placeholder="e.g. What are the requirements for a private company limited by guarantee to appoint a non-citizen as a director?"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center py-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-legal-gold" size={18} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CAMA 2020 Compliance Guard Active</span>
                    </div>
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="group bg-legal-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/40 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-4 disabled:opacity-20"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={18}/> : <Zap size={18} className="group-hover:scale-125 transition-transform" />}
                        {isLoading ? 'Processing...' : 'Execute Synthesis'}
                    </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <button onClick={resetWizard} className="flex items-center gap-2 text-slate-400 hover:text-legal-900 transition-colors font-black uppercase tracking-widest text-[10px]">
                        <ChevronLeft size={16} /> Edit Parameters
                    </button>
                    <div className="flex gap-4">
                        <button onClick={copyToClipboard} className="p-4 bg-slate-50 text-slate-400 hover:bg-legal-900 hover:text-white rounded-2xl transition-all">
                            <Clipboard size={18} />
                        </button>
                        <button 
                            onClick={() => setShowArchiveModal(true)}
                            className="flex items-center gap-3 bg-legal-900 text-white px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-legal-gold hover:text-legal-900 transition-all shadow-xl"
                        >
                            <Bookmark size={18} /> Archive to Matter
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 bg-slate-50 rounded-[40px] border border-slate-100 shadow-inner">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-p:font-serif prose-p:text-lg">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                    </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      <MatterArchiveModal 
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        documentContent={result}
        documentType={activeTab === 'compliance' ? 'Research' : 'Draft'}
        defaultTitle={`${activeTab === 'objects' ? 'MoU Objects' : activeTab === 'resolutions' ? 'Resolution' : 'Compliance Advice'}: ${resCompany || 'Entity'}`}
      />
    </div>
  );
};