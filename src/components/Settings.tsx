import React, { useState } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Save, Building, Mail, Phone, User, ShieldCheck, RefreshCw } from 'lucide-react';

export const Settings: React.FC = () => {
  const { firmProfile, updateFirmProfile, creditsTotal, creditsUsed, addCredits } = useLegalStore();
  const [formData, setFormData] = useState(firmProfile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirmProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter uppercase">Firm Architecture & Protocol</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Internal Infrastructure Management</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 relative z-10 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 bg-white/30">
                <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Practice Identity</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">This metadata is utilized for automated instrument drafting and billing serialization.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-6">Firm Corporate Identity</label>
                    <div className="relative group">
                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner"
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-6">Solicitor / Signatory Command</label>
                    <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                          type="text" 
                          value={formData.solicitorName}
                          onChange={e => setFormData({...formData, solicitorName: e.target.value})}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner"
                          placeholder="e.g. A. I. Lawyer, SAN"
                        />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-6">Physical Jurisdiction (Head Office)</label>
                  <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-lg font-serif italic text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-6">Digital Correspondence</label>
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-6">Encrypted Comms Line</label>
                    <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
                        <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        type="submit" 
                        className="bg-legal-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-4 active:scale-95"
                    >
                        <Save size={18} /> Persist Configuration
                    </button>
                    {saved && (
                        <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-4">Protocol Updated Successfully</span>
                    )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="px-6 py-3 bg-slate-900 rounded-2xl flex items-center gap-4 shadow-xl">
                      <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">Neural Load</span>
                      <span className="text-sm font-black text-white italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addCredits(100)}
                    className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-legal-900 rounded-[20px] hover:shadow-xl transition-all active:scale-95"
                    title="Synthesize 100 Credits"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 bg-white/30 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">Localized Wisdom Bank</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage institutional knowledge folders to improve AI research and drafting accuracy.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Context Active</span>
                </div>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Entertainment', 'G.M IBRU', 'LAW SCHOOL', 'CAC', 'General'].map(cat => {
                  const items = (useLegalStore().knowledgeItems || []).filter(k => k.category === cat);
                  return (
                    <div key={cat} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-legal-900 uppercase tracking-widest opacity-40">{cat}</span>
                        <span className="bg-legal-gold/20 text-legal-900 text-[10px] font-black px-3 py-1 rounded-full group-hover:bg-legal-gold transition-colors">{items.length} Folders</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                        {cat === 'Entertainment' ? "Intellectual Property, Talent Agreements & Industry Precedents." : 
                         cat === 'G.M IBRU' ? "Legacy Litigation files and Commercial Advisory patterns." :
                         cat === 'LAW SCHOOL' ? "Core Nigerian Jurisprudence and Procedural Guides." :
                         cat === 'CAC' ? "Corporate Affairs Commission protocols and filings." :
                         "General Practice documents and miscellaneous research."}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400">Institutional Access: ON</span>
                        <ShieldCheck size={14} className="text-emerald-500" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-8 bg-legal-900 rounded-[40px] flex items-center justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-legal-gold/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <h4 className="text-white font-serif italic text-xl tracking-tighter">Synchronize Document folders</h4>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">LexiNaija is watching your local workspace for legal intelligence updates.</p>
                </div>
                <button className="bg-legal-gold text-legal-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 relative z-10 active:scale-95 shadow-xl shadow-legal-gold/20">
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> Re-Index Folders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
