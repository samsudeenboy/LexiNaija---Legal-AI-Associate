import React, { useState } from 'react';
import { UserPlus, Search, Building2, User, Pencil, Trash2, X } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Client } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({ type: 'Individual' });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ type: 'Individual', name: '', email: '', phone: '', address: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData(client);
    setShowModal(true);
  };

  const handleDeleteRequest = (id: string) => {
    setClientToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setClientToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      if (editingId) {
        updateClient(editingId, formData);
      } else {
        addClient({
          id: Date.now().toString(),
          name: formData.name,
          type: formData.type as 'Individual' | 'Corporate',
          email: formData.email,
          phone: formData.phone || '',
          address: formData.address || '',
          dateAdded: new Date()
        });
      }
      setShowModal(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Client Roster
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Directory</h2>
          <p className="text-slate-400 font-medium">Manage individual and corporate client profiles.</p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold w-80 text-sm font-bold text-legal-900 shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-slate-300"
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-legal-900 text-white px-8 py-4 rounded-2xl hover:bg-legal-gold hover:text-legal-900 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-legal-900/20 transition-all shrink-0 group"
          >
            <UserPlus size={16} className="group-hover:scale-110 transition-transform" /> Register Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div key={client.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:border-legal-gold/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 opacity-0 group-hover:opacity-100 rounded-full translate-x-24 -translate-y-24 blur-3xl transition-opacity"></div>
              
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                  onClick={() => handleOpenEdit(client)}
                  className="p-2 text-slate-400 hover:text-legal-900 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Edit Client"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteRequest(client.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Client"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-start justify-between mb-6 pr-16 relative z-10">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-legal-gold/10 transition-colors">
                  {client.type === 'Corporate' ? <Building2 className="w-8 h-8 text-legal-900" /> : <User className="w-8 h-8 text-legal-900" />}
                </div>
                <span className={`text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-xl border ${client.type === 'Corporate' ? 'bg-sky-50 text-sky-700 border-sky-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                  {client.type}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 mb-4 truncate relative z-10" title={client.name}>{client.name}</h3>
              <div className="space-y-3 text-sm text-slate-500 relative z-10">
                <p className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 w-16">Email</span> 
                  <span className="truncate text-legal-900 font-bold">{client.email}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 w-16">Phone</span> 
                  <span className="text-legal-900 font-bold">{client.phone}</span>
                </p>
                {client.type === 'Corporate' ? (
                  <p className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 w-16">RC NO</span> 
                    <span className="text-legal-900 font-black italic">{client.rcNumber || 'NOT FILED'}</span>
                  </p>
                ) : (
                  <p className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 w-16">ID TYPE</span> 
                    <span className="text-legal-900 font-black italic">{client.idType || 'UNVERIFIED'}</span>
                  </p>
                )}
                <p className="flex items-start gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 w-16 shrink-0 mt-0.5">Address</span> 
                  <span className="truncate text-legal-900 font-medium line-clamp-2">{client.address}</span>
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Onboarded {new Date(client.dateAdded).toLocaleDateString()}</span>
                <button className="text-[9px] uppercase font-black tracking-widest text-legal-gold hover:text-legal-900 transition-colors">Client Brief →</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <User className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-xl font-serif font-black text-slate-400 italic">No Client Records Found.</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase tracking-widest text-legal-gold mt-4 hover:opacity-80 transition-opacity">
                Clear Search Filters
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 bg-slate-50 border-b border-slate-100">
              <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tight flex items-center gap-3">
                  <UserPlus className="text-legal-gold" size={24} /> {editingId ? 'Modify Client Record' : 'Enroll New Client'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Entity Type</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  <label className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl cursor-pointer transition-all text-[10px] uppercase font-black tracking-widest ${formData.type === 'Individual' ? 'bg-white shadow-sm text-legal-900' : 'text-slate-400 hover:text-legal-900'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === 'Individual'} onChange={() => setFormData({...formData, type: 'Individual'})} />
                    <User size={16} /> Individual
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl cursor-pointer transition-all text-[10px] uppercase font-black tracking-widest ${formData.type === 'Corporate' ? 'bg-white shadow-sm text-legal-900' : 'text-slate-400 hover:text-legal-900'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === 'Corporate'} onChange={() => setFormData({...formData, type: 'Corporate'})} />
                    <Building2 size={16} /> Corporate
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  {formData.type === 'Corporate' ? 'Registered Name' : 'Full Name'} <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  placeholder={formData.type === 'Corporate' ? "e.g. Acme Corporation Limited" : "e.g. John Doe"} 
                  required 
                  className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300" 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary Email <span className="text-rose-500">*</span></label>
                  <input 
                    type="email" 
                    value={formData.email}
                    placeholder="contact@entity.com" 
                    required 
                    className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300" 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    placeholder="+234..." 
                    className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300" 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Principal Address</label>
                <textarea 
                  value={formData.address}
                  placeholder="Official registered address or residence..." 
                  className="w-full border border-slate-200 p-6 rounded-3xl h-24 text-sm text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none resize-none shadow-inner leading-relaxed bg-slate-50" 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="p-6 bg-legal-gold/5 rounded-[32px] border border-legal-gold/10 space-y-6">
                <h4 className="text-[10px] font-black text-legal-900 uppercase tracking-[0.2em] mb-2">Legal Due Diligence (Practice Standards)</h4>
                {formData.type === 'Corporate' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">RC Number</label>
                      <input 
                        type="text" 
                        value={formData.rcNumber || ''} 
                        onChange={e => setFormData({...formData, rcNumber: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-legal-900 outline-none"
                        placeholder="RC1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">TIN (FIRS)</label>
                      <input 
                        type="text" 
                        value={formData.tin || ''} 
                        onChange={e => setFormData({...formData, tin: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-legal-900 outline-none"
                        placeholder="Tax Identification"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">ID Verification Type</label>
                      <select 
                        value={formData.idType || ''} 
                        onChange={e => setFormData({...formData, idType: e.target.value as any})}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-legal-900 outline-none"
                      >
                        <option value="">Select ID</option>
                        <option value="BVN">BVN</option>
                        <option value="NIN">NIN</option>
                        <option value="International Passport">Passport</option>
                        <option value="Drivers License">License</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">ID Number</label>
                      <input 
                        type="text" 
                        value={formData.idNumber || ''} 
                        onChange={e => setFormData({...formData, idNumber: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold text-legal-900 outline-none"
                        placeholder="ID/BVN Number"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel Procedure</button>
                <button type="submit" className="flex-[2] bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 shadow-xl transition-all">
                  {editingId ? 'Commit Changes' : 'Enroll Client Profile'}
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
        title="Purge Client Record"
        message="This operation is irreversible. All metadata associated with this legal entity will be permanently excised from the vault."
        confirmLabel="Confirm Purge"
        variant="danger"
      />
    </div>
  );
};