import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Bot, Loader2, Save, X, Sparkles, MessageSquare, 
  ChevronRight, Bookmark, Share2, Clipboard, Search, Gavel
} from 'lucide-react';
import { generateLegalResearch } from '../services/geminiService';
import { ChatMessage, SavedDocument } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useToast } from '../contexts/ToastContext';

export const Research: React.FC = () => {
  const { showToast } = useToast();
  const { cases, saveDocumentToCase, consumeCredits, creditsTotal, creditsUsed, knowledgeItems } = useLegalStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Greetings, Learned Colleague. I am ready to assist with your research on Nigerian law. You may ask about statutes, case law principles, or procedural rules.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [saveTitle, setSaveTitle] = useState('');
  const [textToSave, setTextToSave] = useState('');
  const [selectedContextId, setSelectedContextId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Requirements for Fundamental Rights Enforcement in Nigeria",
    "Difference between a Deed of Assignment and a Deed of Lease",
    "Principles of 'Lis Pendens' in Nigerian land law",
    "Grounds for Divorce under the Matrimonial Causes Act",
    "Procedure for Company Registration under CAMA 2020",
    "Admissibility of electronic evidence in Nigerian courts"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    if (!consumeCredits(5)) {
      showToast("Insufficient Intelligence Credits.", "error");
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const activeContext = knowledgeItems.find(k => k.id === selectedContextId)?.content;
      const responseText = await generateLegalResearch(userMsg.text, activeContext);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "My apologies, I encountered an error accessing the legal database. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const openSaveModal = (text: string) => {
    setTextToSave(text);
    setSaveTitle(`Research: ${text.substring(0, 30)}...`);
    setShowSaveModal(true);
  };

  const handleSaveToCase = () => {
    if (selectedCase && textToSave && saveTitle) {
        saveDocumentToCase(selectedCase, {
            id: Date.now().toString(),
            title: saveTitle,
            content: textToSave,
            type: 'Research',
            createdAt: new Date(),
            status: 'Draft'
        } as SavedDocument);
        setShowSaveModal(false);
        showToast("Research finding archived to matter.", "success");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <Gavel className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">LEGAL RESEARCH INTELLIGENCE</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jurisdictional Context: Statutes of Nigeria</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</span>
                <span className="text-sm font-black text-legal-900 italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
            </div>
            <button className="p-2 text-slate-300 hover:text-legal-900 transition-colors">
                <Share2 size={20} />
            </button>
            <div className="h-10 w-px bg-slate-100 mx-2"></div>
            <div className="flex flex-col items-start">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Background Knowledge</label>
              <select 
                value={selectedContextId}
                onChange={e => setSelectedContextId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-legal-900 outline-none focus:ring-2 focus:ring-legal-gold/20"
              >
                <option value="">-- No Reference --</option>
                {knowledgeItems.map(k => (
                  <option key={k.id} value={k.id}>{k.title}</option>
                ))}
              </select>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30 px-10 py-12 space-y-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-10">
            {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-5 duration-700`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-legal-900 text-white' : 'bg-white text-legal-gold border border-slate-100'
                }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[85%] relative group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`rounded-[32px] p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] ${
                        msg.role === 'user' 
                        ? 'bg-legal-900 text-white rounded-tr-none font-serif italic text-lg' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-serif text-lg leading-relaxed'
                    }`}>
                        <div className={`prose prose-slate prose-lg max-w-none ${msg.role === 'user' ? 'prose-invert italic' : ''} prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                        
                        {msg.role === 'model' && (
                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • SOURCE: SUPREME COURT OF NIGERIA
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openSaveModal(msg.text)}
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-legal-gold hover:text-white rounded-xl transition-all"
                                        title="Save to Matter"
                                    >
                                        <Bookmark size={16} />
                                    </button>
                                    <button 
                                        onClick={() => { navigator.clipboard.writeText(msg.text); showToast("Analysis copied to briefcase.", "info"); }}
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-legal-900 hover:text-white rounded-xl transition-all"
                                        title="Copy Analysis"
                                    >
                                        <Clipboard size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {msg.role === 'user' && (
                            <span className="text-[10px] block mt-4 font-black uppercase tracking-widest text-white/30">
                                SENT {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            ))}

            {isLoading && (
            <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="w-12 h-12 rounded-2xl bg-white text-legal-gold border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-[32px] rounded-tl-none p-10 flex items-center gap-6">
                    <div className="relative">
                        <div className="w-8 h-8 border-2 border-slate-100 border-t-legal-gold rounded-full animate-spin"></div>
                    </div>
                    <div>
                        <p className="text-lg font-serif italic text-legal-900 font-black tracking-tight">Consulting Statutes & Precedents...</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CROSS-REFERENCING ALL NIGERIAN LAW REPORTS</p>
                    </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-10 bg-white border-t border-slate-100 shrink-0 z-10">
        <div className="max-w-4xl mx-auto">
            {/* Suggested Prompts */}
            {!isLoading && messages.length < 3 && (
                <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Initial Research Directives</p>
                    <div className="flex flex-wrap gap-2 text-left">
                        {suggestedPrompts.map((p, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleSend(p)}
                                className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 hover:border-legal-gold hover:text-legal-900 transition-all text-left flex items-center gap-3 group"
                            >
                                <Search size={14} className="group-hover:text-legal-gold" /> {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="relative group">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder="Specify legal query (e.g. 'Validity of oral tenancy in Lagos')..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-[32px] pl-8 pr-20 py-8 text-lg font-serif italic text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold/20 outline-none transition-all resize-none shadow-inner placeholder-slate-300"
                    rows={1}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-4 bottom-4 w-12 h-12 bg-legal-900 text-white rounded-2xl hover:bg-legal-gold hover:text-legal-900 disabled:opacity-20 shadow-xl transition-all flex items-center justify-center group"
                >
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
            <p className="mt-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                AI analysis is for research purposes only and does not constitute formal legal advice.
            </p>
        </div>
      </div>

      {/* Save to Matter Modal */}
      {showSaveModal && (
          <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500 text-left">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-serif font-black text-2xl text-legal-900 italic tracking-tight text-left">Archive Findings</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Link analysis to matter workspace</p>
                    </div>
                    <button onClick={() => setShowSaveModal(false)} className="text-slate-300 hover:text-slate-600">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Matter File</label>
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
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Document Title</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-2 focus:ring-legal-gold/20 outline-none"
                        value={saveTitle}
                        onChange={e => setSaveTitle(e.target.value)}
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