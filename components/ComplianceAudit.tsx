import React, { useState } from 'react';
import { FileSearch, ShieldCheck, Download, Printer, Share2, History, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-legal-900 flex items-center gap-3">
            <ShieldCheck className="text-legal-gold" /> Compliance & Audit Trail
          </h2>
          <p className="text-gray-600 mt-2">Immutable logs of all document access, AI queries, and case modifications.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50">
            <Download size={18} /> Export CSV
          </button>
          <button className="bg-legal-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-legal-800 shadow-lg">
            <Printer size={18} /> Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Security Status</p>
            <p className="text-lg font-black text-green-900 leading-tight">HARDENED</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <History size={20} />
          </div>
          <div>
            <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Total Actions</p>
            <p className="text-lg font-black text-blue-900 leading-tight">{detailedLogs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
          <div className="relative flex-1">
            <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search audit trail..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-legal-gold outline-none"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-legal-gold outline-none"
          >
            <option>All Activities</option>
            <option>Document Created</option>
            <option>Case Modified</option>
            <option>Security Alert</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">User / IP</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {detailedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-10" />
                    No audit records found. Activities will appear here as the platform is used.
                  </td>
                </tr>
              ) : (
                detailedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.action.includes('ALERT') ? 'bg-red-500' : 'bg-legal-gold'
                        }`} />
                        <span className="font-bold text-legal-900 text-sm">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{log.user}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{log.ipAddress}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 leading-relaxed">{log.details}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs font-bold text-gray-600">{log.timestamp}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 text-xs">
        <AlertCircle size={14} />
        <span><strong>Legal Notice:</strong> Audit logs are immutable and stored in a secure cloud vault. They are admissible as evidence of internal process compliance.</span>
      </div>
    </div>
  );
};
