import React, { useState } from 'react';
import { Share2, Mail, Link as LinkIcon, Shield, Copy, CheckCircle2, UserCheck, Clock, X } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';

export const ClientPortal: React.FC = () => {
  const { clients, cases } = useLegalStore();
  const [selectedClient, setSelectedClient] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://lexinaija.com/portal/invite-${Date.now()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-legal-900 flex items-center gap-3">
            <Share2 className="text-legal-gold" /> Client Collaboration Portal
          </h2>
          <p className="text-gray-600 mt-2">Securely share case updates, documents, and invoices with your clients.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-legal-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-legal-800 shadow-lg flex items-center gap-2"
        >
          <Mail size={18} /> Invite Client
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Active Shared Access */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 text-xs uppercase tracking-widest">
            Clients with Portal Access
          </div>
          <div className="flex-1 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No active portal invites.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {clients.slice(0, 3).map((client) => (
                  <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-legal-900">{client.name}</h3>
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{client.email}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                      <span className="flex items-center gap-1"><UserCheck size={12} /> Last login: 2h ago</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> 3 shared docs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Permission Manager */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 bg-legal-900 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold font-serif">Access Control Panel</h3>
              <p className="text-xs text-gray-400 mt-1">Select a client to manage what they see in their portal.</p>
            </div>
            <Shield className="text-legal-gold" size={24} />
          </div>
          
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
            <Share2 className="w-20 h-20 text-gray-100 mb-4" />
            <h4 className="text-lg font-bold text-gray-400">No Client Selected</h4>
            <p className="text-sm text-gray-400 max-w-xs mt-2">
              Onboard a client to the portal to start sharing case folders and automating status updates.
            </p>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-legal-900">Portal Invitation</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Client</label>
                <select 
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-legal-gold"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="bg-legal-50 rounded-2xl p-4 border border-legal-100">
                <p className="text-xs font-bold text-legal-800 uppercase mb-3 tracking-widest">Secret Invite Link</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs text-gray-500 font-mono truncate">
                    https://lexinaija.com/portal/invite-7728...
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="p-2 bg-legal-900 text-white rounded-lg hover:bg-legal-800 transition-colors"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <button className="w-full bg-legal-900 text-white py-4 rounded-xl font-black shadow-lg flex items-center justify-center gap-3">
                <Mail size={20} /> Send Invitation Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
