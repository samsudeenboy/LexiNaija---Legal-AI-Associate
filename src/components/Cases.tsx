import React, { useState } from 'react';
import { Briefcase, Gavel, Calendar, Plus, Search, Filter, Pencil, Trash2, FileText, X, CreditCard, Banknote, Users, ChevronRight } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Case, BillableItem } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const Cases: React.FC = () => {
  const { cases, clients, addCase, updateCase, deleteCase, addBillableItem, loadMoreCases, hasMoreCases, isLoadingMore } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showAdjournModal, setShowAdjournModal] = useState(false);
  const [adjournData, setAdjournData] = useState<{caseId: string; nextHearing: string; notes: string}>({
      caseId: '',
      nextHearing: '',
      notes: ''
  });
  const [formData, setFormData] = useState<Partial<Case>>({ status: 'Open' });
  
  const [feeData, setFeeData] = useState<{description: string, amount: string, type: 'Professional Fee' | 'Expense'}>({
      description: '',
      amount: '',
      type: 'Professional Fee'
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ status: 'Open', title: '', suitNumber: '', court: '', notes: '', nextHearing: '', opposingParty: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (caseItem: Case) => {
    setEditingId(caseItem.id);
    setFormData(caseItem);
    setShowModal(true);
  };

  const handleOpenFeeLog = (caseId: string) => {
    setSelectedCaseId(caseId);
    setFeeData({ description: '', amount: '', type: 'Professional Fee' });
    setShowFeeModal(true);
  };

  const handleOpenAdjourn = (caseItem: Case) => {
    setAdjournData({
      caseId: caseItem.id,
      nextHearing: caseItem.nextHearing ? new Date(caseItem.nextHearing).toISOString().slice(0, 16) : '',
      notes: `Adjourned ${caseItem.nextHearing ? `from ${new Date(caseItem.nextHearing).toDateString()} ` : ''}for: `
    });
    setShowAdjournModal(true);
  };

  const handleDeleteRequest = (id: string) => {
    setCaseToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (caseToDelete) {
      deleteCase(caseToDelete);
      setCaseToDelete(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.clientId) {
      if (editingId) {
        updateCase(editingId, formData);
      } else {
        addCase({
          id: Date.now().toString(),
          title: formData.title,
          clientId: formData.clientId,
          status: formData.status as any,
          suitNumber: formData.suitNumber || '',
          court: formData.court || '',
          nextHearing: formData.nextHearing,
          notes: formData.notes || '',
          opposingParty: formData.opposingParty || '',
          documents: [],
          billableItems: [],
          evidence: []
        });
      }
      setShowModal(false);
    }
  };

  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCaseId && feeData.description && feeData.amount) {
        const newItem: BillableItem = {
            id: Date.now().toString(),
            description: feeData.description,
            amount: parseFloat(feeData.amount),
            date: new Date(),
            type: feeData.type
        };
        addBillableItem(selectedCaseId, newItem);
        setShowFeeModal(false);
    }
  };

  const handleSaveAdjournment = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjournData.caseId && adjournData.nextHearing) {
      updateCase(adjournData.caseId, {
          nextHearing: new Date(adjournData.nextHearing) as any,
          notes: adjournData.notes ? `${new Date().toLocaleDateString()} - Adjournment Note: ${adjournData.notes}` : undefined
      });
      setShowAdjournModal(false);
    }
  };

  const calculateTotalFees = (caseItem: Case) => {
      return caseItem.billableItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const filteredCases = cases.filter(c => {
    const query = searchQuery.toLowerCase();
    const clientName = getClientName(c.clientId).toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      (c.suitNumber && c.suitNumber.toLowerCase().includes(query)) ||
      clientName.includes(query)
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Active Matters
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Case Files</h2>
          <p className="text-slate-400 font-medium">Track your active litigation and solicitor workspace.</p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search by title, suit no, or client..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold w-80 text-sm font-bold text-legal-900 shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-slate-300"
             />
          </div>
          <button 
             onClick={handleOpenAdd}
             className="bg-legal-900 text-white px-8 py-4 rounded-2xl hover:bg-legal-gold hover:text-legal-900 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-legal-900/20 transition-all shrink-0 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Open New Matter
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredCases.length > 0 ? (
          filteredCases.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-8 hover:shadow-xl hover:border-legal-gold/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 opacity-0 group-hover:opacity-100 rounded-full translate-x-32 -translate-y-32 blur-3xl transition-opacity"></div>
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <span className={`text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-xl border ${
                     c.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                     c.status === 'Pending Court' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                     c.status === 'Closed' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                   }`}>{c.status}</span>
                   {c.suitNumber && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.suitNumber}</span>}
                </div>
                <h3 className="text-3xl font-serif font-black italic tracking-tight text-legal-900 mb-2">{c.title}</h3>
                <div className="flex flex-wrap gap-6 text-sm mt-4">
                    <p className="text-legal-600 font-bold flex items-center gap-2">
                        <Briefcase size={16} className="text-legal-gold" /> Client: {getClientName(c.clientId)}
                    </p>
                    {c.opposingParty && (
                        <p className="text-rose-500 font-bold flex items-center gap-2 py-0.5 px-2 bg-rose-50 rounded text-xs">
                            <Users size={14} /> Vs: {c.opposingParty}
                        </p>
                    )}
                </div>
                {c.court && <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2"><Gavel size={16} className="text-slate-400" /> {c.court}</p>}
                
                <div className="mt-8 flex gap-4">
                   <div className="text-[10px] uppercase tracking-widest font-black bg-slate-50 text-legal-900 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <FileText size={16} className="text-slate-400"/> {c.documents.length} Docs
                   </div>
                   <div className="text-[10px] uppercase tracking-widest font-black bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
                      <Banknote size={16} className="text-emerald-500" /> Unbilled: ₦{calculateTotalFees(c).toLocaleString()}
                   </div>
                </div>
              </div>

              <div className="md:w-72 flex flex-col justify-between border-l pl-0 md:pl-8 border-slate-100 relative z-10">
                <div className="absolute top-0 right-0 md:relative flex justify-end gap-2 mb-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenAdjourn(c)} className="p-3 text-legal-gold hover:bg-legal-gold hover:text-legal-900 rounded-xl transition-colors" title="Adjourn Matter">
                        <Calendar size={18} />
                    </button>
                    <button onClick={() => handleOpenFeeLog(c.id)} className="p-3 text-legal-gold hover:bg-legal-gold hover:text-legal-900 rounded-xl transition-colors" title="Log Fee/Expense">
                        <CreditCard size={18} />
                    </button>
                    <button onClick={() => handleOpenEdit(c)} className="p-3 text-slate-400 hover:text-legal-900 hover:bg-slate-100 rounded-xl transition-colors" title="Edit Case">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeleteRequest(c.id)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Delete Case">
                        <Trash2 size={18} />
                    </button>
                </div>

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Next Appearance</p>
                  <div className={`flex items-center gap-3 ${c.nextHearing ? 'text-legal-900' : 'text-slate-400'}`}>
                    <Calendar size={20} className={c.nextHearing ? "text-legal-gold" : "text-slate-300"} />
                    <span className="font-bold">{c.nextHearing ? new Date(c.nextHearing).toDateString() : 'Not Scheduled'}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 md:border-t-0 md:pt-0">
                  <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{c.notes || "No additional intelligence available."}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-xl font-serif font-black text-slate-400 italic">No Matter Files Located.</p>
            {searchQuery && <button onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase tracking-widest text-legal-gold mt-4 hover:opacity-80 transition-opacity">Clear Search Filters</button>}
          </div>
        )}

        {hasMoreCases && !searchQuery && (
            <div className="flex justify-center py-12">
                <button 
                    onClick={loadMoreCases}
                    disabled={isLoadingMore}
                    className="group flex flex-col items-center gap-4 text-slate-400 hover:text-legal-900 transition-all"
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-legal-gold transition-all ${isLoadingMore ? 'animate-spin' : ''}`}>
                        <Plus size={20} className={isLoadingMore ? 'opacity-20' : ''} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {isLoadingMore ? 'Accessing Archive...' : 'Load More Matters'}
                    </span>
                </button>
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 maxHeight-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-8 bg-slate-50/50 border-b border-slate-100">
              <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tight flex items-center gap-3">
                  <Briefcase className="text-legal-gold" size={24} /> {editingId ? 'Update Matter Focus' : 'Open New Matter Focus'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Client Association <span className="text-rose-500">*</span></label>
                <select 
                  required 
                  value={formData.clientId}
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all cursor-pointer shadow-sm" 
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">-- Elect Client Profile --</option>
                  {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Matter Title <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  placeholder="e.g. Recovery of Premises..." 
                  required 
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300" 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Adverse Party</label>
                <input 
                  type="text" 
                  value={formData.opposingParty}
                  placeholder="e.g. Defendant/Respondent Name" 
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300" 
                  onChange={e => setFormData({...formData, opposingParty: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Suit Index</label>
                  <input 
                    type="text" 
                    value={formData.suitNumber}
                    placeholder="e.g. FHC/L/CS/..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-mono focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-sans placeholder:text-slate-300" 
                    onChange={e => setFormData({...formData, suitNumber: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Current Posture</label>
                  <select 
                    value={formData.status}
                    className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all cursor-pointer shadow-sm" 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Open">Active Investigation</option>
                    <option value="Drafting">Pre-Litigation Drafting</option>
                    <option value="Pending Court">Pending Court Process</option>
                    <option value="Closed">Archived/Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Forum / Court</label>
                <input 
                  type="text" 
                  value={formData.court}
                  placeholder="e.g. High Court, Lagos Judicial Division" 
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300" 
                  onChange={e => setFormData({...formData, court: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Limitation / Next Appearance</label>
                <input 
                  type="date" 
                  value={formData.nextHearing}
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm" 
                  onChange={e => setFormData({...formData, nextHearing: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Intelligence Notes</label>
                <textarea 
                  value={formData.notes}
                  placeholder="Record strategic observations..." 
                  className="w-full border border-slate-200 p-6 rounded-3xl h-32 text-sm text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none resize-none shadow-inner leading-relaxed bg-slate-50" 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                />
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort Procedure</button>
                <button type="submit" className="flex-[2] bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 shadow-xl transition-all">
                  {editingId ? 'Update Matter Intelligence' : 'Initialize Matter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeeModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 bg-slate-50 border-b border-slate-100">
                <h3 className="font-serif font-black italic text-xl text-legal-900 flex items-center gap-3"><CreditCard className="text-legal-gold" size={24}/> Time & Cost Log</h3>
                <button onClick={() => setShowFeeModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveFee} className="p-8 space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Disbursement Category</label>
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button 
                            type="button" 
                            onClick={() => setFeeData({...feeData, type: 'Professional Fee'})}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all ${feeData.type === 'Professional Fee' ? 'bg-white text-legal-900 shadow-sm' : 'text-slate-500 hover:text-legal-900'}`}
                        >
                            Professional Fee
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setFeeData({...feeData, type: 'Expense'})}
                            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all ${feeData.type === 'Expense' ? 'bg-white text-legal-900 shadow-sm' : 'text-slate-500 hover:text-legal-900'}`}
                        >
                            OPE Expense
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Narrative</label>
                    <input 
                        required
                        type="text" 
                        value={feeData.description}
                        onChange={e => setFeeData({...feeData, description: e.target.value})}
                        placeholder={feeData.type === 'Professional Fee' ? "e.g. Drafting of Writ of Summons" : "e.g. Court Filing Fees"}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all placeholder:font-normal placeholder:text-slate-300"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quantum (₦)</label>
                    <input 
                        required
                        type="number" 
                        value={feeData.amount}
                        onChange={e => setFeeData({...feeData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xl font-mono text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all"
                    />
                </div>
                <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full bg-legal-900 text-white text-[10px] uppercase font-black tracking-widest py-4 rounded-2xl hover:bg-legal-gold hover:text-legal-900 transition-all shadow-xl group flex justify-center items-center gap-2">
                        Execute Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {showAdjournModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 bg-amber-50/50 border-b border-amber-100/50">
              <div>
                  <h3 className="text-2xl font-serif font-black text-amber-900 italic tracking-tight flex items-center gap-3">
                      <Calendar className="text-amber-500" size={24} /> Adjourn Matter
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700/60 mt-2">Log New Court Date</p>
              </div>
              <button onClick={() => setShowAdjournModal(false)} className="text-amber-400 hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAdjournment} className="p-8 space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Adjourned To <span className="text-rose-500">*</span></label>
                    <input 
                        required
                        type="datetime-local" 
                        value={adjournData.nextHearing}
                        onChange={e => setAdjournData({...adjournData, nextHearing: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner text-sm"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Adjournment Purpose</label>
                    <textarea 
                        value={adjournData.notes}
                        onChange={e => setAdjournData({...adjournData, notes: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold leading-relaxed text-legal-900 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner h-32 resize-none placeholder:text-slate-300 text-sm"
                        placeholder="e.g. Adjourned for Continuation of Trial / Cross-examination of PW1..."
                    />
                </div>
                <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setShowAdjournModal(false)} className="flex-1 text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-slate-600 transition-colors py-4">Cancel</button>
                    <button type="submit" className="flex-[2] bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest py-4 rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 group flex justify-center items-center gap-2">
                        Log Adjournment <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Sanitize Matter File"
        message="Closing this matter will permanently excise it from the active roster. This operation cannot be reversed."
        confirmLabel="Purge Matter"
        variant="danger"
      />
    </div>
  );
};