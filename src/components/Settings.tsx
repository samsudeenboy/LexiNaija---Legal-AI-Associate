import React, { useState } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Save, Building, Mail, Phone, User, ShieldCheck } from 'lucide-react';

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
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-legal-900">Firm Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Configure your practice details for document generation and billing.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-legal-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-full flex items-center justify-center text-white">
                <ShieldCheck size={20} />
            </div>
            <div>
                <h3 className="font-bold text-legal-900">Practice Profile</h3>
                <p className="text-xs text-gray-500">This information appears on your letterhead and invoices.</p>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
            <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
            <textarea 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent"
                    />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Principal Solicitor / Signatory</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={formData.solicitorName}
                  onChange={e => setFormData({...formData, solicitorName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent"
                  placeholder="e.g. A. I. Lawyer, SAN"
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">This name will appear on automated signatures.</p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
                type="submit" 
                className="bg-legal-900 text-white px-6 py-2.5 rounded-lg hover:bg-legal-800 flex items-center gap-2 font-medium transition-all"
            >
                <Save size={18} /> Save Settings
            </button>
            {saved && (
                <span className="text-green-600 text-sm font-medium animate-in fade-in">Settings saved successfully!</span>
            )}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Credits: {creditsUsed}/{creditsTotal}</span>
              <button
                type="button"
                onClick={() => addCredits(100)}
                className="px-3 py-2 text-xs font-medium bg-legal-50 text-legal-900 border border-legal-200 rounded hover:bg-legal-100"
              >
                Add 100 Credits
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
