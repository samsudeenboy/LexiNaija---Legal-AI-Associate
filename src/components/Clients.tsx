import React, { useState } from 'react';
import { UserPlus, Search, Building2, User, Pencil, Trash2, X } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Client } from '../types';

export const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      deleteClient(id);
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900">Client Directory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage individual and corporate clients.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent w-64 text-sm"
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-legal-900 text-white px-4 py-2 rounded-lg hover:bg-legal-800 flex items-center gap-2 text-sm font-medium shrink-0"
          >
            <UserPlus size={16} /> Add New Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-legal-gold transition-colors group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(client)}
                  className="p-1.5 text-gray-500 hover:text-legal-900 hover:bg-gray-100 rounded"
                  title="Edit Client"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete Client"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-start justify-between mb-4 pr-16">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-legal-50 transition-colors">
                  {client.type === 'Corporate' ? <Building2 className="w-6 h-6 text-legal-700" /> : <User className="w-6 h-6 text-legal-700" />}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border ${client.type === 'Corporate' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                  {client.type}
                </span>
              </div>
              <h3 className="font-bold text-legal-900 text-lg mb-1 truncate" title={client.name}>{client.name}</h3>
              <div className="space-y-1.5 text-sm text-gray-500 mt-3">
                <p className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-gray-300 w-12">Email</span> 
                  <span className="truncate text-legal-800">{client.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-gray-300 w-12">Phone</span> 
                  <span className="text-legal-800">{client.phone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-xs font-semibold uppercase text-gray-300 w-12 shrink-0 mt-0.5">Addr</span> 
                  <span className="truncate text-legal-800 line-clamp-2">{client.address}</span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">Added {new Date(client.dateAdded).toLocaleDateString()}</span>
                <button className="text-legal-gold text-sm font-medium hover:underline">View Files</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No clients found matching "{searchQuery}"</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-legal-gold text-sm mt-2 hover:underline">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-legal-900">{editingId ? 'Edit Client Details' : 'Register New Client'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                <div className="flex gap-4 p-1 bg-gray-50 rounded-lg border border-gray-200">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer transition-all ${formData.type === 'Individual' ? 'bg-white shadow-sm text-legal-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === 'Individual'} onChange={() => setFormData({...formData, type: 'Individual'})} />
                    <User size={16} /> Individual
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer transition-all ${formData.type === 'Corporate' ? 'bg-white shadow-sm text-legal-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === 'Corporate'} onChange={() => setFormData({...formData, type: 'Corporate'})} />
                    <Building2 size={16} /> Corporate
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'Corporate' ? 'Company Name' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  placeholder={formData.type === 'Corporate' ? "e.g. Dangote Industries Ltd" : "e.g. Adebayo Ogunlesi"} 
                  required 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent outline-none" 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    value={formData.email}
                    placeholder="name@example.com" 
                    required 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent outline-none" 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    placeholder="080..." 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent outline-none" 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea 
                  value={formData.address}
                  placeholder="Office or Residential Address" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg h-24 focus:ring-2 focus:ring-legal-gold focus:border-transparent outline-none resize-none" 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-300 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-legal-900 text-white py-2.5 rounded-lg font-medium hover:bg-legal-800 transition-colors shadow-sm">
                  {editingId ? 'Update Client' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};