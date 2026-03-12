import React, { useState } from 'react';
import { X, Save, FileText, ChevronRight } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { SavedDocument } from '../types';
import { useToast } from '../contexts/ToastContext';

interface MatterArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
  defaultTitle?: string;
  documentType: 'Draft' | 'Research' | 'Summary';
}

export const MatterArchiveModal: React.FC<MatterArchiveModalProps> = ({ 
  isOpen, 
  onClose, 
  documentContent, 
  defaultTitle = '', 
  documentType 
}) => {
  const { cases, saveDocumentToCase } = useLegalStore();
  const { showToast } = useToast();
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [title, setTitle] = useState(defaultTitle || `${documentType} - ${new Date().toLocaleDateString()}`);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedCaseId) {
      showToast("Please select a target matter.", "warning");
      return;
    }

    if (!title.trim()) {
      showToast("Please provide a document title.", "warning");
      return;
    }

    const newDoc: SavedDocument = {
      id: Date.now().toString(),
      title: title.trim(),
      content: documentContent,
      type: documentType,
      createdAt: new Date(),
      status: 'Draft'
    };

    saveDocumentToCase(selectedCaseId, newDoc);
    showToast(`${documentType} archived to matter workspace.`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 text-left">
      <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-serif font-black text-2xl text-legal-900 italic tracking-tight">Archive to Matter</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Memory Protocol</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Matter File</label>
            <div className="relative group">
              <select 
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/5 outline-none appearance-none transition-all cursor-pointer"
              >
                <option value="">-- Choose Matter --</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-legal-gold transition-colors">
                <ChevronRight size={18} className="rotate-90" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Document Nomenclature</label>
            <div className="relative">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all placeholder-slate-300"
                placeholder="e.g. Legal Opinion on Title..."
              />
              <FileText size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200" />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={onClose} 
              className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="group flex-[2] bg-legal-900 text-white rounded-2xl py-4 flex items-center justify-center gap-3 shadow-xl hover:bg-legal-gold hover:text-legal-900 transition-all font-black uppercase tracking-widest text-[11px]"
            >
              <Save size={16} className="group-hover:scale-110 transition-transform" /> Confirm Archival
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
