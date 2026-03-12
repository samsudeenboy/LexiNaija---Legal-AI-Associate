import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Copy, RefreshCw, CheckCircle2, Save, X, Sparkles, Plus, 
  ChevronRight, ChevronLeft, Briefcase, Users, Gavel, Scale, Loader2, ArrowRight, Eye
} from 'lucide-react';
import { draftContract, getClauseSuggestions } from '../services/geminiService';
import { ContractParams, SavedDocument } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../contexts/ToastContext';

type Step = 'type' | 'parties' | 'terms' | 'preview';

export const Drafter: React.FC = () => {
  const { showToast } = useToast();
  const { cases, clients, updateCaseDocument, saveDocumentToCase, creditsTotal, creditsUsed, consumeCredits, activeSuggestion, setActiveSuggestion, knowledgeItems } = useLegalStore();
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [params, setParams] = useState<ContractParams>({
    type: 'Tenancy Agreement',
    partyA: '',
    partyB: '',
    jurisdiction: 'Lagos State',
    keyTerms: ''
  });
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [saveTitle, setSaveTitle] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [prefillCaseId, setPrefillCaseId] = useState('');
  const [selectedContextId, setSelectedContextId] = useState<string>('');

  // Handle Actionable Intelligence (Injected State)
  useEffect(() => {
    if (activeSuggestion && activeSuggestion.targetView === 'DRAFTER' && activeSuggestion.targetState) {
        const state = activeSuggestion.targetState;
        if (state.type) setParams(prev => ({ ...prev, type: state.type }));
        if (state.jurisdiction) setParams(prev => ({ ...prev, jurisdiction: state.jurisdiction }));
        if (state.prefillCaseId) handlePrefillFromCase(state.prefillCaseId);
        
        // Transition to terms if pre-filled
        if (state.type && state.prefillCaseId) setCurrentStep('terms');
        
        showToast("Intelligence parameters injected from Counsel Agent", "success");
        setActiveSuggestion(null); // Clear suggestion after consumption
    }
  }, [activeSuggestion]);

  const contractTypes = [
    'Tenancy Agreement (Residential)',
    'Tenancy Agreement (Commercial)',
    'Employment Contract',
    'Deed of Assignment (Land)',
    'Memorandum of Understanding (MoU)',
    'Service Level Agreement',
    'Non-Disclosure Agreement',
    'Irrevocable Power of Attorney',
    'Hire Purchase Agreement',
    'Formal Contract of Sale of Land',
    'Deed of Lease',
    'Deed of Mortgage',
    'Partnership Agreement',
    'Will and Codicil'
  ];

  const handlePrefillFromCase = (caseId: string) => {
    setPrefillCaseId(caseId);
    const selected = cases.find(c => c.id === caseId);
    if (!selected) return;
    const client = clients.find(cl => cl.id === selected.clientId);
    const a = client ? client.name : params.partyA;
    const b = selected.opposingParty ? selected.opposingParty : params.partyB;
    let j = params.jurisdiction;
    const court = selected.court || '';
    const lc = court.toLowerCase();
    if (lc.includes('lagos')) j = 'Lagos State';
    else if (lc.includes('abuja') || lc.includes('fct')) j = 'FCT Abuja';
    setParams({ ...params, partyA: a, partyB: b, jurisdiction: j });
  };

  const handleDraft = async () => {
    setIsDrafting(true);
    setGeneratedDraft('');
    setCurrentStep('preview');
    try {
      if (!consumeCredits(10)) {
        showToast("Insufficient Intelligence Credits.", "error");
        return;
      }
      const activeContext = knowledgeItems.find(k => k.id === selectedContextId)?.content;
      const result = await draftContract(params, activeContext);
      setGeneratedDraft(result);
    } catch (error) {
      showToast("Drafting protocol failure.", "error");
      setCurrentStep('terms');
    } finally {
      setIsDrafting(false);
    }
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
        if (!consumeCredits(2)) return;
        const results = await getClauseSuggestions(params.type);
        setSuggestions(results.split(',').map(s => s.trim()));
    } catch(e) {
        console.error(e);
    } finally {
        setLoadingSuggestions(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    setParams(prev => ({
        ...prev,
        keyTerms: prev.keyTerms ? `${prev.keyTerms}\n- Include a ${suggestion}` : `- Include a ${suggestion}`
    }));
  };

  const handleSaveToCase = () => {
    if (selectedCase && generatedDraft && saveTitle) {
        saveDocumentToCase(selectedCase, {
            id: Date.now().toString(),
            title: saveTitle,
            content: generatedDraft,
            type: 'Draft',
            createdAt: new Date(),
            status: 'Draft'
        } as SavedDocument);
        setShowSaveModal(false);
        showToast("Instrument archived to case file.", "success");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 px-10">
      {[
        { id: 'type', label: 'Selection', icon: Briefcase },
        { id: 'parties', label: 'Entities', icon: Users },
        { id: 'terms', label: 'Provisions', icon: Scale },
        { id: 'preview', label: 'Review', icon: Eye }
      ].map((s, idx, array) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              currentStep === s.id ? 'bg-legal-900 text-legal-gold shadow-2xl scale-110' : 
              array.findIndex(x => x.id === currentStep) > idx ? 'bg-green-500 text-white' : 'bg-white text-slate-300 border border-slate-100'
            }`}>
              <s.icon size={20} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentStep === s.id ? 'text-legal-900' : 'text-slate-400'}`}>{s.label}</span>
          </div>
          {idx < array.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-1000 ${
              array.findIndex(x => x.id === currentStep) > idx ? 'bg-green-500' : 'bg-slate-100'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center">
                <Scale className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">SMART INSTRUMENT DRAFTER</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by Nigerian Legal AI</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Credits</span>
                <span className="text-lg font-black text-legal-900 leading-none mt-1 uppercase italic tracking-tighter">{creditsTotal - creditsUsed} AVAILABLE</span>
            </div>
            <div className="h-10 w-px bg-slate-100"></div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                <X size={20} />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/30 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {renderStepIndicator()}

          <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-slate-100 p-12 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-legal-gold/5 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
            
            {currentStep === 'type' && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="mb-10">
                    <h2 className="text-4xl font-serif font-black text-legal-900 mb-2 italic tracking-tighter underline decoration-legal-gold decoration-4 underline-offset-8">Instrument Specification</h2>
                    <p className="text-slate-500 font-medium">Select the legal precedent or contract archetype to initialize drafting.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Protocol Selection</label>
                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide py-1">
                                {contractTypes.map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setParams({...params, type: t})}
                                        className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${
                                            params.type === t ? 'bg-legal-900 text-white border-legal-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:border-legal-gold/40'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                            <h3 className="text-sm font-black text-legal-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Briefcase size={16} className="text-legal-gold" /> Rapid Contextualization
                            </h3>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Intelligence will proceed faster if you link an existing matter. Entity details and jurisdictional variances will be automatically ingested.</p>
                            
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Linked Matter</label>
                            <select 
                                value={prefillCaseId}
                                onChange={e => handlePrefillFromCase(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-legal-900 focus:ring-2 focus:ring-legal-gold/20 outline-none appearance-none mb-6"
                            >
                                <option value="">-- No linked matter --</option>
                                {cases.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>

                            <h3 className="text-sm font-black text-legal-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Sparkles size={16} className="text-legal-gold" /> Reference Precedent
                            </h3>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Select specialized knowledge from your institutional folders to guide the AI's drafting style.</p>
                            
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Knowledge Item</label>
                            <select 
                                value={selectedContextId}
                                onChange={e => setSelectedContextId(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-legal-900 focus:ring-2 focus:ring-legal-gold/20 outline-none appearance-none"
                            >
                                <option value="">-- No Reference --</option>
                                {knowledgeItems.map(k => (
                                    <option key={k.id} value={k.id}>{k.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end">
                    <button 
                        onClick={() => setCurrentStep('parties')}
                        className="group bg-legal-900 text-white px-8 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-3"
                    >
                        Configure Entities <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            )}

            {currentStep === 'parties' && (
              <div className="animate-in fade-in slide-in-from-right-5 duration-700">
                <div className="mb-10">
                    <h2 className="text-4xl font-serif font-black text-legal-900 mb-2 italic tracking-tighter underline decoration-legal-gold decoration-4 underline-offset-8">Entity Identification</h2>
                    <p className="text-slate-500 font-medium">Define the contractual parties and governing jurisdiction for this instrument.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Users size={14} className="text-legal-gold"/> Primary Party (Entity A)
                            </label>
                            <input 
                                type="text"
                                value={params.partyA}
                                onChange={e => setParams({...params, partyA: e.target.value})}
                                placeholder="Full Legal Name / Incorporation No."
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-lg font-serif italic text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Users size={14} className="text-legal-gold"/> Counterparty (Entity B)
                            </label>
                            <input 
                                type="text"
                                value={params.partyB}
                                onChange={e => setParams({...params, partyB: e.target.value})}
                                placeholder="Full Legal Name / Incorporation No."
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-lg font-serif italic text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Gavel size={14} className="text-legal-gold"/> Legal Jurisdiction
                            </label>
                            <input 
                                type="text"
                                value={params.jurisdiction}
                                onChange={e => setParams({...params, jurisdiction: e.target.value})}
                                placeholder="e.g. Lagos State Judiciary"
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-lg font-serif italic text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            />
                        </div>
                        <div className="p-8 bg-legal-gold/5 rounded-[40px] border border-legal-gold/10">
                            <p className="text-xs text-slate-600 leading-relaxed italic">"Ensure jurisdiction aligns with the location of the assets or seat of the primary entity for optimal enforcement capability under Nigerian law."</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-between">
                    <button 
                        onClick={() => setCurrentStep('type')}
                        className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-legal-900 transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    <button 
                        onClick={() => setCurrentStep('terms')}
                        className="group bg-legal-900 text-white px-8 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-3"
                    >
                        Define Provisions <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            )}

            {currentStep === 'terms' && (
              <div className="animate-in fade-in slide-in-from-right-5 duration-700">
                <div className="mb-10 lg:flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-serif font-black text-legal-900 mb-2 italic tracking-tighter underline decoration-legal-gold decoration-4 underline-offset-8">Instrument Provisions</h2>
                        <p className="text-slate-500 font-medium">Input the core terms and leverage AI for clause recommendations.</p>
                    </div>
                    <button 
                        onClick={handleGetSuggestions}
                        disabled={loadingSuggestions}
                        className="mt-4 lg:mt-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-legal-gold/10 text-legal-gold text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-white transition-all disabled:opacity-50"
                    >
                        {loadingSuggestions ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                        Suggest Essential Clauses
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contractual Objectives & Key Terms</label>
                        <textarea 
                            value={params.keyTerms}
                            onChange={e => setParams({...params, keyTerms: e.target.value})}
                            className="w-full h-80 bg-slate-50 border border-slate-100 rounded-[40px] p-10 text-lg font-serif leading-relaxed text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all resize-none shadow-inner"
                            placeholder="Detail the financial arrangements, durations, obligations, and specific performance requirements..."
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 h-full overflow-y-auto">
                            <h3 className="text-[10px] font-black text-legal-900 uppercase tracking-widest mb-6">Clause Matrix</h3>
                            {suggestions.length > 0 ? (
                                <div className="space-y-3">
                                    {suggestions.map((s, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => addSuggestion(s)}
                                            className="w-full text-left p-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 hover:border-legal-gold hover:text-legal-900 transition-all flex items-center justify-between group"
                                        >
                                            {s} <Plus size={14} className="text-slate-200 group-hover:text-legal-gold" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-slate-300">
                                    <Scale size={32} className="mx-auto mb-4 opacity-10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Clauses Suggested</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-between">
                    <button 
                        onClick={() => setCurrentStep('parties')}
                        className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-legal-900 transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    <button 
                        onClick={handleDraft}
                        className="group bg-legal-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-gold/40 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-3"
                    >
                        Initialize Drafting Protocol <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="animate-in fade-in zoom-in-95 duration-700 min-h-[600px] flex flex-col">
                {isDrafting ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <div className="relative mb-10">
                            <div className="w-32 h-32 border-4 border-slate-100 border-t-legal-gold rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="text-legal-gold animate-pulse" size={32} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif font-black text-legal-900 mb-2 italic tracking-tighter">Synthesizing Legal Instrument</h3>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Analysing Statutes & Case Law Benchmarks...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-4xl font-serif font-black text-legal-900 mb-2 italic tracking-tighter underline decoration-legal-gold decoration-4 underline-offset-8">Instrument Review</h2>
                                <p className="text-slate-500 font-medium">Verify the generated draft before final validation.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setGeneratedDraft(''); setCurrentStep('terms'); }} className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors" title="Regenerate">
                                    <RefreshCw size={20} />
                                </button>
                                <button onClick={() => { navigator.clipboard.writeText(generatedDraft); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }} className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors" title="Copy">
                                    {copySuccess ? <CheckCircle2 size={20} className="text-green-500"/> : <Copy size={20} />}
                                </button>
                                <button onClick={() => { setSaveTitle(`${params.type} - Draft`); setShowSaveModal(true); }} className="px-8 py-4 rounded-2xl bg-legal-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-2 shadow-xl">
                                    <Save size={16} /> Archive to Matter
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-[40px] p-12 overflow-y-auto border border-slate-100 font-serif leading-[2] text-slate-800 text-lg shadow-inner">
                            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedDraft}</ReactMarkdown>
                            </div>
                        </div>
                    </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSaveModal && (
          <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-serif font-black text-2xl text-legal-900 italic tracking-tight">Archive Instrument</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store within legal matter workspace</p>
                    </div>
                    <button onClick={() => setShowSaveModal(false)} className="text-slate-300 hover:text-slate-600">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Matter</label>
                      <select 
                          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-2 focus:ring-legal-gold/20 outline-none appearance-none"
                          value={selectedCase}
                          onChange={e => setSelectedCase(e.target.value)}
                      >
                          <option value="">-- Choose Matter --</option>
                          {cases.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Instrument Title</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-2 focus:ring-legal-gold/20 outline-none"
                        value={saveTitle}
                        onChange={e => setSaveTitle(e.target.value)}
                        placeholder="e.g. Tenancy Agreement - Draft 1"
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button onClick={() => setShowSaveModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                        <button 
                          onClick={handleSaveToCase} 
                          disabled={!selectedCase || !saveTitle} 
                          className="flex-[2] py-4 bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 disabled:opacity-20 shadow-xl transition-all"
                        >
                          Confirm Archival
                        </button>
                    </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
