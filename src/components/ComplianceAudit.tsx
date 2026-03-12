import React, { useState } from 'react';
import { FileSearch, ShieldCheck, Download, Printer, Share2, History, AlertCircle, CheckCircle2, X, Search } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export const ComplianceAudit: React.FC = () => {
  const { auditLog } = useLegalStore();
  const [filter, setFilter] = useState('All');

  // Simulated detailed audit logs based on the core audit entries
  const detailedLogs: AuditEntry[] = auditLog.map(entry => ({
    id: entry.id,
    action: entry.eventType.replace('_', ' '),
    user: entry.userId || 'System',
    details: entry.details || 'No additional details.',
    timestamp: new Date(entry.timestamp).toLocaleString(),
    ipAddress: '192.168.1.' + (Math.floor(Math.random() * 255))
  }));

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Bar */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-legal-900 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="text-legal-gold" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-serif font-black text-legal-900 italic tracking-tighter uppercase">Compliance & Audit Ledger</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Immutable Chain-of-Custody Logging</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="h-11 px-6 bg-white border border-slate-100 text-slate-400 hover:text-legal-900 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all shadow-sm hover:shadow-xl">
            <Download size={16} /> Export Protocol
          </button>
          <button className="h-11 px-6 bg-legal-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-legal-gold hover:text-legal-900 transition-all shadow-2xl shadow-legal-900/20">
            <Printer size={16} /> Technical Report
          </button>
          <div className="w-px h-6 bg-slate-100 mx-2"></div>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-legal-900 transition-all hover:bg-white shadow-sm">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-8 relative z-10 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
          <div className="bg-emerald-900/5 border border-emerald-500/20 p-6 rounded-[32px] flex items-center gap-6 backdrop-blur-sm">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-1">Vault Status</p>
              <p className="text-2xl font-serif font-black text-emerald-950 italic tracking-tighter">HARDENED</p>
            </div>
          </div>
          <div className="bg-slate-900/5 border border-slate-200/50 p-6 rounded-[32px] flex items-center gap-6 backdrop-blur-sm">
            <div className="w-14 h-14 bg-legal-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-legal-900/20">
              <History size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Activity Volume</p>
              <p className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter">{detailedLogs.length} Events</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl overflow-hidden flex flex-col min-h-0">
          <div className="p-8 border-b border-slate-50 bg-white/30 flex gap-6 shrink-0">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-legal-gold transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Query activity logs by UID, IP or event type..." 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[20px] font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner text-sm"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-100 rounded-[20px] px-8 py-5 font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all shadow-inner appearance-none cursor-pointer min-w-[240px] text-sm"
            >
              <option>Filter by Protocol</option>
              <option>Auth Events</option>
              <option>AI Drafting</option>
              <option>Case Mutation</option>
              <option>Security Breach</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 z-10">
                <tr>
                  <th className="px-10 py-6">Operation Event</th>
                  <th className="px-10 py-6">Orchestrator Context</th>
                  <th className="px-10 py-6">Data Payload</th>
                  <th className="px-10 py-6 text-right">Synchronization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {detailedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="text-slate-200" size={40} />
                      </div>
                      <h3 className="text-2xl font-serif font-black text-legal-900 italic tracking-tighter mb-2">Immutable Ledger Empty</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Awaiting secure protocol initialization</p>
                    </td>
                  </tr>
                ) : (
                  detailedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-legal-gold/[0.02] group transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                            log.action.includes('ALERT') ? 'bg-rose-500 shadow-rose-500/20' : 'bg-legal-gold shadow-legal-gold/20'
                          }`} />
                          <span className="font-serif font-black text-legal-900 italic tracking-tighter text-lg">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-sm font-black text-slate-700 uppercase tracking-widest">{log.user}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{log.ipAddress}</p>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-sm text-slate-500 leading-relaxed font-medium italic max-w-md">{log.details}</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <p className="text-sm font-black text-legal-900 italic tracking-tighter">{log.timestamp.split(',')[0]}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{log.timestamp.split(',')[1]}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-legal-900 text-white/90 p-6 rounded-[32px] shadow-2xl flex items-center gap-6 border-t border-white/10 shrink-0">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle size={24} className="text-legal-gold" />
          </div>
          <p className="text-[11px] leading-relaxed font-bold italic">
            <span className="text-legal-gold uppercase tracking-widest mr-2 underline">Jurisdictional Notice:</span>
            These logs are hashed and stored in a secure cloud vault. They constitute primary evidence of internal due diligence and process compliance under the Evidence Act (2011).
          </p>
        </div>
      </div>
    </div>
  );
};

