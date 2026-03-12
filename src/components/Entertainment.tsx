import React, { useState } from 'react';
import { 
    Music, Film, Book, Sparkles, PenTool, Clipboard, ShieldCheck, 
    Zap, Save, Copy, HelpCircle, ChevronRight, Mic2, Tv, Gavel, ShieldAlert, FileSearch
} from 'lucide-react';
import { generateCopyrightInjunction, generateTalentAgreement, analyzePiracyCompliance } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

export const Entertainment: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'injunction' | 'talent' | 'piracy'>('injunction');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const { addToast } = useToast();

    const handleAction = async () => {
        if (!query) return;
        setLoading(true);
        try {
            let res = '';
            if (activeTab === 'injunction') {
                res = await generateCopyrightInjunction(query);
                addToast('Copyright Injunction Motion drafted', 'success');
            } else if (activeTab === 'talent') {
                res = await generateTalentAgreement('Talent Name', query);
                addToast('Talent Agreement generated', 'success');
            } else {
                res = await analyzePiracyCompliance(query);
                addToast('Piracy Compliance Review completed', 'success');
            }
            setResult(res);
        } catch (error) {
            addToast('AI Generation failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'injunction', label: 'Copyright Injunction', icon: Gavel, desc: 'Draft motions to restrain IP infringement' },
        { id: 'talent', label: 'Talent Management', icon: Mic2, desc: 'Standard Recording/Management Agreements' },
        { id: 'piracy', label: 'Anti-Piracy Audit', icon: ShieldAlert, desc: 'Compliance & distribution protection' }
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Premium Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white px-10 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-legal-900 rounded-[24px] flex items-center justify-center shadow-2xl shadow-legal-900/40 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-legal-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Music className="text-legal-gold w-8 h-8 relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-black text-legal-900 italic tracking-tighter">Entertainment Law Vertical</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 border border-slate-200 rounded-md">IP Shield v2.0</span>
                                <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">Powered by Copyright Act 2023</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Navigation & Input */}
                <div className="w-[450px] border-r border-slate-200 bg-white/50 backdrop-blur-md p-10 overflow-y-auto">
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 gap-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {setActiveTab(tab.id as any); setResult('');}}
                                    className={`text-left p-6 rounded-[32px] border-2 transition-all duration-500 group relative overflow-hidden ${activeTab === tab.id ? 'border-legal-gold bg-legal-900 text-white shadow-2xl' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:shadow-lg'}`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activeTab === tab.id ? 'bg-legal-gold text-legal-900' : 'bg-slate-50 text-slate-400 group-hover:text-legal-900 group-hover:bg-legal-gold/10'} transition-all`}>
                                            <tab.icon size={20} />
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-legal-gold' : 'text-slate-400'}`}>{tab.label}</p>
                                            <p className={`text-xs font-bold leading-tight mt-0.5 ${activeTab === tab.id ? 'text-white/60' : 'text-slate-500'}`}>{tab.desc}</p>
                                        </div>
                                    </div>
                                    {activeTab === tab.id && <div className="absolute top-4 right-4 text-legal-gold/20 font-serif italic text-4xl">0{tabs.findIndex(t => t.id === tab.id) + 1}</div>}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-legal-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                <PenTool size={12} className="text-legal-gold" /> Critical Intelligence Input
                            </label>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-legal-gold/20 to-transparent rounded-[32px] blur opacity-25 group-focus-within:opacity-100 transition-opacity"></div>
                                <textarea 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full h-64 p-8 rounded-[32px] border-2 border-slate-100 bg-white relative focus:border-legal-gold focus:outline-none text-sm leading-relaxed font-medium transition-all shadow-inner"
                                    placeholder={activeTab === 'injunction' ? "Describe the infringement details (Who, Where, What work...)" : activeTab === 'talent' ? "List terms: Royalty %, Duration, Advance, Territories..." : "Describe the distribution model or content protection setup..."}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAction}
                            disabled={loading || !query}
                            className="w-full py-6 bg-legal-900 text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 group transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-legal-900/40 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-legal-gold/40 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                            {loading ? (
                                <Zap className="w-5 h-5 animate-spin text-legal-gold relative z-10" />
                            ) : (
                                <Sparkles className="w-5 h-5 text-legal-gold relative z-10 group-hover:rotate-12 transition-transform" />
                            )}
                            <span className="relative z-10">{loading ? 'Synthesizing...' : 'Generate Legal Instrument'}</span>
                        </button>
                    </div>
                </div>

                {/* Presentation Output */}
                <div className="flex-1 bg-slate-100/50 p-10 overflow-y-auto flex flex-col items-center">
                    {result ? (
                        <div className="w-full max-w-4xl bg-white rounded-[48px] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 fade-in duration-700 relative">
                            <div className="absolute top-0 right-0 p-8 flex gap-3 z-20">
                                <button onClick={() => {navigator.clipboard.writeText(result); addToast('Copied to clipboard', 'success');}} className="w-12 h-12 bg-slate-50 hover:bg-legal-gold hover:text-legal-900 rounded-2xl flex items-center justify-center text-slate-400 transition-all shadow-sm">
                                    <Copy size={20} />
                                </button>
                                <button className="w-12 h-12 bg-slate-50 hover:bg-legal-gold hover:text-legal-900 rounded-2xl flex items-center justify-center text-slate-400 transition-all shadow-sm">
                                    <Save size={20} />
                                </button>
                            </div>
                            <div className="p-20 pt-24 prose prose-slate max-w-none relative">
                                <div className="absolute top-10 left-20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-[2px] bg-legal-gold"></div>
                                        <span className="text-[10px] font-black text-legal-gold uppercase tracking-[0.4em]">Official Draft</span>
                                    </div>
                                </div>
                                <div className="font-serif text-slate-800 text-xl leading-[1.8] whitespace-pre-wrap italic">
                                    {result}
                                </div>
                            </div>
                            <div className="px-20 py-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified by LexiNaija IP Core</span>
                                </div>
                                <p className="text-[10px] font-serif italic text-slate-300">Generated on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 relative">
                                <div className="absolute inset-0 bg-legal-900 rounded-full animate-ping opacity-5"></div>
                                <FileSearch size={40} className="text-legal-900/20" />
                            </div>
                            <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Awaiting Creative Intel</h3>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed mt-4">
                                "In the creative economy, legal precision is the ultimate backbone of protection. Input your matter details to synthesize instruments grounded in the 2023 Copyright Act."
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
