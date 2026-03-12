import React, { useState } from 'react';
import { 
    Archive, Plus, Trash2, FileText, Image as ImageIcon, MessageSquare, Box, FileCheck, 
    ExternalLink, Printer, Shield, X, History, Clipboard, Bookmark, Lucide
} from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { EvidenceItem } from '../types';
import { useToast } from '../contexts/ToastContext';

export const Evidence: React.FC = () => {
  const { showToast } = useToast();
  const { cases, addEvidence, deleteEvidence, saveDocumentToCase, firmProfile, clients, creditsTotal, creditsUsed } = useLegalStore();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState<Partial<EvidenceItem>>({
    type: 'Document',
    isReliedUpon: true,
    custodyLocation: 'Chambers Safe'
  });

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const caseEvidence = selectedCase?.evidence || [];

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCaseId && formData.description) {
      addEvidence(selectedCaseId, {
        id: Date.now().toString(),
        description: formData.description,
        type: formData.type as any,
        dateObtained: formData.dateObtained ? new Date(formData.dateObtained) : new Date(),
        isReliedUpon: formData.isReliedUpon || false,
        custodyLocation: formData.custodyLocation,
        notes: formData.notes
      });
      setShowModal(false);
      setFormData({ type: 'Document', isReliedUpon: true, custodyLocation: 'Chambers Safe', description: '', notes: '' });
      showToast("Evidence logged to repository.", "success");
    }
  };

  const handleDelete = (id: string) => {
      // In a real app, we'd use a custom modal, but for now we replace alert/confirm with breadcrumb
      if (confirm("Execute purge protocol for this evidence item?")) {
          deleteEvidence(selectedCaseId, id);
          showToast("Item purged from chain of custody.", "info");
      }
  }

  const generateListofDocuments = () => {
    if (!selectedCase) return;
    
    const client = clients.find(c => c.id === selectedCase.clientId);
    const reliedDocuments = caseEvidence.filter(e => e.isReliedUpon);

    if (reliedDocuments.length === 0) {
        showToast("No evidence items marked for frontloading.", "warning");
        return;
    }

    const courtHeader = selectedCase.court ? `IN THE ${selectedCase.court.toUpperCase()}` : "IN THE HIGH COURT OF LAGOS STATE";
    const suitNo = selectedCase.suitNumber ? selectedCase.suitNumber : "SUIT NO: ....................";
    
    const content = `# ${courtHeader}
# IN THE ${selectedCase.court?.split(',')[1]?.trim().toUpperCase() || 'LAGOS'} JUDICIAL DIVISION
# HOLDEN AT ${selectedCase.court?.split(',')[1]?.trim().toUpperCase() || 'LAGOS'}

**${suitNo}**

**BETWEEN:**

**${client?.name.toUpperCase() || 'CLAIMANT'}** ........................................ **CLAIMANT**

**AND**

**${selectedCase.opposingParty?.toUpperCase() || 'DEFENDANT'}** ........................................ **DEFENDANT**

## LIST OF DOCUMENTS TO BE RELIED UPON AT TRIAL

**TAKE NOTICE** that the Claimant/Defendant intends to rely on the following documents at the trial of this suit:

${reliedDocuments.map((doc, idx) => `${idx + 1}. ${doc.description} dated ${new Date(doc.dateObtained).toLocaleDateString()}.`).join('\n\n')}

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**${firmProfile.solicitorName}**
Counsel to the Claimant/Defendant
${firmProfile.name}
${firmProfile.address}
${firmProfile.email} | ${firmProfile.phone}

**FOR SERVICE ON:**
THE DEFENDANT/CLAIMANT
C/O THEIR COUNSEL
`;

    saveDocumentToCase(selectedCase.id, {
        id: Date.now().toString(),
        title: `List of Documents: ${selectedCase.title}`,
        content: content,
        type: 'Draft',
        createdAt: new Date()
    } as any);

    showToast("Frontloading schedule archived to matter files.", "success");
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <Shield className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter">EVIDENCE CHAIN OF CUSTODY</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Internal Repository Protocol</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                <span className="text-sm font-black text-legal-900 italic tracking-tighter">{creditsTotal - creditsUsed} CR</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-legal-900 transition-colors">
                <X size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <div className="flex items-center gap-6 flex-1">
               <div className="relative w-full max-w-md group">
                   <select 
                      value={selectedCaseId}
                      onChange={(e) => setSelectedCaseId(e.target.value)}
                      className="w-full bg-white border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                   >
                       <option value="">-- Associate with Matter --</option>
                       {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                   </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-legal-gold transition-colors">
                        <ChevronRight className="rotate-90" size={18} />
                   </div>
               </div>
           </div>
           
           <div className="flex gap-4">
               <button 
                  onClick={generateListofDocuments}
                  disabled={!selectedCaseId || caseEvidence.length === 0}
                  className="bg-white border border-slate-100 text-legal-900 px-8 py-4 rounded-2xl hover:bg-legal-50 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-sm disabled:opacity-50 transition-all"
               >
                   <FileCheck size={18} className="text-legal-gold" /> Generate Frontloading Schedule
               </button>
               <button 
                  onClick={() => setShowModal(true)}
                  disabled={!selectedCaseId}
                  className="bg-legal-900 text-white px-8 py-4 rounded-2xl hover:bg-legal-gold hover:text-legal-900 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-legal-900/10 disabled:opacity-50 transition-all"
               >
                   <Plus size={18} /> Log Exhibit
               </button>
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-10 bg-white scrollbar-hide">
           {!selectedCaseId ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto animate-in fade-in duration-1000">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8">
                        <History className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter mb-4">Registry Locked</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Select an active matter file above to access the evidence repository and secure chain of custody logs.
                    </p>
                </div>
           ) : caseEvidence.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8">
                        <Box className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter mb-4">Empty Repository</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        No physical or documentary evidence has been logged for this matter yet. Use 'Log Exhibit' to initialize.
                    </p>
                </div>
           ) : (
                <div className="max-w-6xl mx-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-4 rounded-l-[20px]">Exhibit Ref</th>
                                <th className="px-8 py-4">Nomenclature & Context</th>
                                <th className="px-8 py-4 text-center">Status</th>
                                <th className="px-8 py-4 text-right rounded-r-[20px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {caseEvidence.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 group transition-colors">
                                    <td className="px-8 py-6 text-[11px] font-black text-slate-300 font-mono italic tracking-tighter">EX-{item.id.substring(0, 6)}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                                                {item.type === 'Document' && <FileText className="text-legal-900" size={18} />}
                                                {item.type === 'Image' && <ImageIcon className="text-legal-900" size={18} />}
                                                {item.type === 'Correspondence' && <MessageSquare className="text-legal-900" size={18} />}
                                                {item.type === 'Physical' && <Box className="text-legal-900" size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-lg font-serif italic font-black text-legal-900 tracking-tight">{item.description}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(item.dateObtained).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">{item.custodyLocation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {item.isReliedUpon ? (
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">Frontloaded</span>
                                        ) : (
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">Stored</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           )}
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 text-left">
              <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="font-serif font-black text-2xl text-legal-900 italic tracking-tight">Log Evidence Item</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Exhibit Security Protocol</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                        <X size={24} />
                      </button>
                  </div>
                  <form onSubmit={handleAddEvidence} className="space-y-6">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                          <input 
                              required
                              type="text" 
                              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner"
                              placeholder="e.g. Certified True Copy of Judgment..."
                              value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Classification</label>
                              <select 
                                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner cursor-pointer"
                                  value={formData.type}
                                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                              >
                                  <option value="Document">Documentary</option>
                                  <option value="Correspondence">Correspondence</option>
                                  <option value="Image">Photographic</option>
                                  <option value="Audio">Multi-media</option>
                                  <option value="Physical">Physical</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Date Discovered</label>
                              <input 
                                  type="date" 
                                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner"
                                  onChange={e => setFormData({...formData, dateObtained: new Date(e.target.value)})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Custody Location</label>
                          <input 
                              type="text" 
                              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 outline-none focus:bg-white transition-all shadow-inner"
                              placeholder="e.g. Chambers Safe, Registry"
                              value={formData.custodyLocation}
                              onChange={e => setFormData({...formData, custodyLocation: e.target.value})}
                          />
                      </div>

                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                          <input 
                              type="checkbox" 
                              id="relied"
                              checked={formData.isReliedUpon}
                              onChange={e => setFormData({...formData, isReliedUpon: e.target.checked})}
                              className="w-5 h-5 accent-legal-gold border-slate-100 rounded-lg cursor-pointer"
                          />
                          <label htmlFor="relied" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Mark for Frontloading</label>
                      </div>

                      <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Cancel</button>
                          <button type="submit" className="flex-[2] bg-legal-900 text-white rounded-2xl py-4 flex items-center justify-center gap-3 shadow-xl hover:bg-legal-gold hover:text-legal-900 transition-all font-black uppercase tracking-widest text-[11px]">
                              Secure Exhibit
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);