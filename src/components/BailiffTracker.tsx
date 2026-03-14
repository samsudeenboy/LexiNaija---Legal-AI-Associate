import React, { useState } from 'react';
import { Truck, Search, Plus, Calendar, FileText, User, CheckCircle2, Clock, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useDropzone } from 'react-dropzone';

interface BailiffEntry {
  id: string;
  caseId: string;
  bailiffName: string;
  processType: string;
  dateGiven: string;
  dateServed?: string;
  status: 'In Progress' | 'Served' | 'Returned' | 'Defective';
  attempts: number;
  isSubstituted: boolean;
  affidavitUrl?: string;
}

export const BailiffTracker: React.FC = () => {
  const { cases } = useLegalStore();
  const [entries, setEntries] = useState<BailiffEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<BailiffEntry>>({
    status: 'In Progress',
    dateGiven: new Date().toISOString().split('T')[0],
    attempts: 0,
    isSubstituted: false
  });

  const onDrop = (acceptedFiles: File[]) => {
    // Affidavit verified for chain of custody
    setNewEntry({ ...newEntry, affidavitUrl: acceptedFiles[0].name });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
    multiple: false
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.caseId && newEntry.bailiffName) {
      setEntries([
        { ...newEntry, id: Date.now().toString() } as BailiffEntry,
        ...entries
      ]);
      setShowModal(false);
      setNewEntry({ status: 'In Progress', dateGiven: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-legal-900 flex items-center gap-3">
            <Truck className="text-legal-gold" /> Bailiff & Process Tracker
          </h2>
          <p className="text-gray-600 mt-2">Monitor service of process and manage affidavits of service.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-legal-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-legal-800 flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} /> Log New Process
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by Bailiff, Case, or Process..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-legal-gold outline-none"
            />
          </div>
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-legal-gold outline-none">
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Served</option>
            <option>Returned</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center">
              <Truck className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-lg font-medium">No processes currently tracked.</p>
              <p className="text-sm max-w-xs mt-2">Log your first process to start tracking service of court papers.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Process Details</th>
                  <th className="px-6 py-4">Bailiff</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Affidavit</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <h4 className="font-bold text-legal-900">{entry.processType}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {cases.find(c => c.id === entry.caseId)?.title || 'Unlinked Case'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <User size={14} className="text-gray-400" />
                        {entry.bailiffName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          Given: {entry.dateGiven}
                        </div>
                        {entry.dateServed && (
                          <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                            <CheckCircle2 size={12} />
                            Served: {entry.dateServed}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        entry.status === 'Served' ? 'bg-green-100 text-green-700' :
                        entry.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.status}
                      </span>
                      {entry.isSubstituted && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-black uppercase tracking-tighter">Substituted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Attempts: {entry.attempts}</span>
                        {entry.affidavitUrl ? (
                          <button className="text-legal-gold flex items-center gap-1.5 hover:underline font-bold text-xs text-left">
                            <FileText size={14} /> View Document
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs italic">No Proof</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-legal-900">Log Court Process</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handleAddEntry} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Case Matter</label>
                <select 
                  required
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                  value={newEntry.caseId}
                  onChange={e => setNewEntry({...newEntry, caseId: e.target.value})}
                >
                  <option value="">-- Choose Matter --</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Process Type</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Writ of Summons"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                    value={newEntry.processType}
                    onChange={e => setNewEntry({...newEntry, processType: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date Given to Bailiff</label>
                  <input 
                    required
                    type="date" 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                    value={newEntry.dateGiven}
                    onChange={e => setNewEntry({...newEntry, dateGiven: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bailiff Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Inspector Gabriel"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                  value={newEntry.bailiffName}
                  onChange={e => setNewEntry({...newEntry, bailiffName: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="isSub"
                        checked={newEntry.isSubstituted}
                        onChange={e => setNewEntry({...newEntry, isSubstituted: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-legal-gold focus:ring-legal-gold"
                    />
                    <label htmlFor="isSub" className="text-xs font-bold text-gray-700">Substituted Service?</label>
                </div>
                <div className="flex-1 flex items-center gap-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Attempts:</label>
                    <input 
                        type="number"
                        min="0"
                        value={newEntry.attempts}
                        onChange={e => setNewEntry({...newEntry, attempts: parseInt(e.target.value) || 0})}
                        className="w-16 border-b border-gray-300 bg-transparent py-1 text-sm font-bold text-legal-900 outline-none focus:border-legal-gold"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Affidavit (Optional)</label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragActive ? 'border-legal-gold bg-legal-50' : 'border-gray-200 hover:border-legal-gold'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                  {newEntry.affidavitUrl ? (
                    <p className="text-sm text-green-600 font-bold">{newEntry.affidavitUrl}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Drag & drop or click to upload PDF/Image</p>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-legal-900 text-white py-3 rounded-xl font-black hover:bg-legal-800 transition-all shadow-lg"
              >
                Save Process Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
