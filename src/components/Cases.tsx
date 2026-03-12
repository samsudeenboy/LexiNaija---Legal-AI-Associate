import React, { useState } from 'react';
import { Briefcase, Gavel, Calendar, Plus, Search, Filter, Pencil, Trash2, FileText, X, CreditCard, Banknote, Users } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Case, BillableItem } from '../types';

export const Cases: React.FC = () => {
  const { cases, clients, addCase, updateCase, deleteCase, addBillableItem } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to close and delete this file? All associated notes will be lost.')) {
      deleteCase(id);
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
          billableItems: []
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900">Case Files (Matters)</h2>
          <p className="text-gray-500 text-sm mt-1">Track active litigation and solicitor work.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search by title, suit no, or client..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent w-72 text-sm"
             />
          </div>
          <button 
             onClick={handleOpenAdd}
             className="bg-legal-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 text-sm font-medium shrink-0"
          >
            <Plus size={16} /> Open New File
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCases.length > 0 ? (
          filteredCases.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6 hover:border-legal-gold transition-all group relative">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                     c.status === 'Open' ? 'bg-green-100 text-green-800' :
                     c.status === 'Pending Court' ? 'bg-orange-100 text-orange-800' : 
                     c.status === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                   }`}>{c.status}</span>
                   {c.suitNumber && <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{c.suitNumber}</span>}
                </div>
                <h3 className="text-xl font-bold text-legal-900 mb-1">{c.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm mt-2">
                    <p className="text-legal-600 font-medium flex items-center gap-1.5">
                        <Briefcase size={14} /> Client: {getClientName(c.clientId)}
                    </p>
                    {c.opposingParty && (
                        <p className="text-red-500 font-medium flex items-center gap-1.5">
                            <Users size={14} /> Vs: {c.opposingParty}
                        </p>
                    )}
                </div>
                {c.court && <p className="text-sm text-gray-500 mt-1 flex items-center gap-2"><Gavel size={14} /> {c.court}</p>}
                
                <div className="mt-4 flex gap-4">
                   <div className="text-xs bg-legal-50 text-legal-800 px-3 py-2 rounded-lg border border-legal-100 flex items-center gap-2">
                      <FileText size={12}/> <strong>{c.documents.length}</strong> Docs
                   </div>
                   <div className="text-xs bg-legal-50 text-legal-800 px-3 py-2 rounded-lg border border-legal-100 flex items-center gap-2">
                      <Banknote size={12}/> Unbilled: <strong>₦{calculateTotalFees(c).toLocaleString()}</strong>
                   </div>
                </div>
              </div>

              <div className="md:w-64 flex flex-col justify-between border-l pl-0 md:pl-6 border-gray-100 relative">
                <div className="absolute top-0 right-0 md:relative flex justify-end gap-2 mb-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenFeeLog(c.id)} className="p-1.5 text-legal-gold hover:bg-yellow-50 rounded" title="Log Fee/Expense">
                        <CreditCard size={14} />
                    </button>
                    <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-gray-400 hover:text-legal-900 hover:bg-gray-100 rounded" title="Edit Case">
                        <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete Case">
                        <Trash2 size={14} />
                    </button>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Next Hearing/Due Date</p>
                  <div className={`flex items-center gap-2 ${c.nextHearing ? 'text-legal-800' : 'text-gray-400'}`}>
                    <Calendar size={18} className={c.nextHearing ? "text-legal-gold" : "text-gray-300"} />
                    <span className="font-medium text-sm">{c.nextHearing ? new Date(c.nextHearing).toDateString() : 'Not Scheduled'}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 md:border-t-0 md:pt-0">
                  <p className="text-xs text-gray-400 line-clamp-2 italic">{c.notes || "No additional notes."}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No cases found matching your criteria.</p>
            {searchQuery && <button onClick={() => setSearchQuery('')} className="text-legal-gold text-sm mt-2 hover:underline">Clear Search</button>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-legal-900">{editingId ? 'Update Matter Details' : 'Open New Matter'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Client <span className="text-red-500">*</span></label>
                <select 
                  required 
                  value={formData.clientId}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none" 
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matter Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  placeholder="e.g. Recovery of Premises at 15 Awolowo Way..." 
                  required 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none" 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opposing Party</label>
                <input 
                  type="text" 
                  value={formData.opposingParty}
                  placeholder="e.g. Defendant Name" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none" 
                  onChange={e => setFormData({...formData, opposingParty: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suit Number</label>
                  <input 
                    type="text" 
                    value={formData.suitNumber}
                    placeholder="e.g. FHC/L/CS/..." 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none font-mono text-sm" 
                    onChange={e => setFormData({...formData, suitNumber: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none" 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Open">Open</option>
                    <option value="Pending Court">Pending Court</option>
                    <option value="Drafting">Drafting Stage</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Court / Forum</label>
                <input 
                  type="text" 
                  value={formData.court}
                  placeholder="e.g. Federal High Court, Lagos Division" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none" 
                  onChange={e => setFormData({...formData, court: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Date / Deadline</label>
                <input 
                  type="date" 
                  value={formData.nextHearing}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none" 
                  onChange={e => setFormData({...formData, nextHearing: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Notes</label>
                <textarea 
                  value={formData.notes}
                  placeholder="Brief facts or current status..." 
                  className="w-full border border-gray-300 p-2.5 rounded-lg h-24 focus:ring-2 focus:ring-legal-gold outline-none resize-none" 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-300 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-legal-900 text-white py-2.5 rounded-lg font-medium hover:bg-legal-800 transition-colors shadow-sm">
                  {editingId ? 'Update File' : 'Create File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="font-bold text-legal-900 flex items-center gap-2"><CreditCard size={18}/> Log Billable Item</h3>
                <button onClick={() => setShowFeeModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSaveFee} className="p-4 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                    <div className="flex gap-2">
                        <button 
                            type="button" 
                            onClick={() => setFeeData({...feeData, type: 'Professional Fee'})}
                            className={`flex-1 py-2 text-sm rounded border ${feeData.type === 'Professional Fee' ? 'bg-legal-900 text-white border-legal-900' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Professional Fee
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setFeeData({...feeData, type: 'Expense'})}
                            className={`flex-1 py-2 text-sm rounded border ${feeData.type === 'Expense' ? 'bg-legal-900 text-white border-legal-900' : 'bg-white text-gray-600 border-gray-300'}`}
                        >
                            Expense
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input 
                        required
                        type="text" 
                        value={feeData.description}
                        onChange={e => setFeeData({...feeData, description: e.target.value})}
                        placeholder={feeData.type === 'Professional Fee' ? "e.g. Court Appearance" : "e.g. Filing Fees"}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-legal-gold outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                    <input 
                        required
                        type="number" 
                        value={feeData.amount}
                        onChange={e => setFeeData({...feeData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-legal-gold outline-none font-mono"
                    />
                </div>
                <button type="submit" className="w-full bg-legal-gold text-white font-bold py-2 rounded hover:bg-yellow-600 transition-colors">
                    Save Record
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};