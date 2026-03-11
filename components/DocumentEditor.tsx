import React, { useState, useRef, useEffect } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { SavedDocument, DocumentVersion } from '../types';
import { 
  FileText, Save, Download, File, Search, ChevronRight, PenTool, Eye, History, RotateCcw,
  Bold, Italic, Underline, Heading, List, ListOrdered, Quote, Code,
  Strikethrough, Subscript, Superscript, Link as LinkIcon, Table as TableIcon,
  CheckSquare, Minus, Image as ImageIcon, Sparkles, Wand2, ArrowLeft, MoreHorizontal, FileDown, Printer, FileSignature
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import { refineLegalText } from '../services/geminiService';

interface EditorState {
  caseId: string;
  docId: string;
  title: string;
  content: string;
  status: SavedDocument['status'];
}

export const DocumentEditor: React.FC = () => {
  const { cases, clients, firmProfile, updateCaseDocument, activeDoc, setActiveDoc, creditsTotal, creditsUsed, consumeCredits } = useLegalStore();
  const [selectedDoc, setSelectedDoc] = useState<EditorState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  
  // AI Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSelectedText, setAiSelectedText] = useState('');
  const [aiInstruction, setAiInstruction] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize from Context (e.g. redirected from Precedents)
  useEffect(() => {
    if (activeDoc) {
      const caseItem = cases.find(c => c.id === activeDoc.caseId);
      const docItem = caseItem?.documents.find(d => d.id === activeDoc.docId);
      
      if (caseItem && docItem) {
        if (hasUnsavedChanges && selectedDoc?.docId !== activeDoc.docId) {
             if(!confirm("Unsaved changes will be lost. Continue?")) {
                 setActiveDoc(null);
                 return;
             }
        }

        setSelectedDoc({
          caseId: activeDoc.caseId,
          docId: activeDoc.docId,
          title: docItem.title,
          content: docItem.content,
          status: docItem.status || 'Draft'
        });
        
        const client = clients.find(cl => cl.id === caseItem.clientId);
        const defaults: Record<string, string> = {
          '[PLAINTIFF NAME]': client?.name || '',
          '[CLAIMANT NAME]': client?.name || '',
          '[CLIENT NAME]': client?.name || '',
          '[DEFENDANT NAME]': caseItem.opposingParty || '',
          '[TENANT NAME]': caseItem.opposingParty || '',
          '[LANDLORD NAME]': client?.name || '',
          '[COMPANY NAME]': client?.name || '',
          '[COURT]': caseItem.court || '',
          '[DIVISION]': (caseItem.court && caseItem.court.includes(',') ? caseItem.court.split(',')[1].trim() : ''),
          '[LOCATION]': (caseItem.court && caseItem.court.includes(',') ? caseItem.court.split(',')[1].trim() : ''),
          '[SUIT NO]': caseItem.suitNumber || '',
          '[ADDRESS]': client?.address || '',
          '[LAWYER NAME]': firmProfile.solicitorName,
          '[FIRM ADDRESS]': firmProfile.address,
          '[PHONE NUMBER]': firmProfile.phone,
          '[EMAIL]': firmProfile.email,
          '[DATE]': new Date().toLocaleDateString()
        };
        setVariables(defaults);
        setHasUnsavedChanges(false);
        setPreviewMode(false);
      }
      setActiveDoc(null); 
    }
  }, [activeDoc, cases, hasUnsavedChanges, selectedDoc, setActiveDoc, clients, firmProfile]);

  const allDocs = cases.flatMap(c => 
    c.documents.map(d => ({ ...d, caseTitle: c.title, caseId: c.id }))
  ).filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentStoredDoc = selectedDoc 
    ? cases.find(c => c.id === selectedDoc.caseId)?.documents.find(d => d.id === selectedDoc.docId)
    : null;

  const handleSelectDoc = (caseId: string, doc: SavedDocument) => {
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Discard them?")) return;
    }
    setSelectedDoc({
      caseId,
      docId: doc.id,
      title: doc.title,
      content: doc.content,
      status: doc.status || 'Draft'
    });
    setHasUnsavedChanges(false);
    setPreviewMode(false);
    setShowHistory(false);
  };

  const handleSave = () => {
    if (selectedDoc) {
      updateCaseDocument(selectedDoc.caseId, selectedDoc.docId, {
        title: selectedDoc.title,
        content: selectedDoc.content
      });
      setHasUnsavedChanges(false);
    }
  };

  const handleRestoreVersion = (version: DocumentVersion) => {
    if (confirm(`Restore version from ${new Date(version.timestamp).toLocaleString()}?`)) {
        if (selectedDoc) {
            setSelectedDoc({
                ...selectedDoc,
                title: version.title,
                content: version.content
            });
            setHasUnsavedChanges(true);
        }
    }
  };

  const applyFormat = (type: string) => {
    if (!textareaRef.current || !selectedDoc) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    const selection = val.substring(start, end);
    
    let newText = val;
    let newCursorPos = end;

    switch (type) {
      case 'bold':
        newText = val.substring(0, start) + `**${selection}**` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 4 : start + 2;
        break;
      case 'italic':
        newText = val.substring(0, start) + `*${selection}*` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 2 : start + 1;
        break;
      case 'underline':
        newText = val.substring(0, start) + `<u>${selection}</u>` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 7 : start + 3;
        break;
      case 'strikethrough':
        newText = val.substring(0, start) + `~~${selection}~~` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 4 : start + 2;
        break;
      case 'h1':
        newText = val.substring(0, start) + `# ${selection}` + val.substring(end);
        newCursorPos = start + 2 + selection.length;
        break;
      case 'h2':
         newText = val.substring(0, start) + `## ${selection}` + val.substring(end);
         newCursorPos = start + 3 + selection.length;
         break;
      case 'list':
        newText = val.substring(0, start) + `- ${selection}` + val.substring(end);
        newCursorPos = start + 2 + selection.length;
        break;
      case 'quote':
        newText = val.substring(0, start) + `> ${selection}` + val.substring(end);
        newCursorPos = start + 2 + selection.length;
        break;
      case 'hr':
        newText = val.substring(0, start) + `\n---\n` + val.substring(end);
        newCursorPos = start + 5;
        break;
    }

    setSelectedDoc({ ...selectedDoc, content: newText });
    setHasUnsavedChanges(true);
    
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleOpenAiModal = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    if (start === end) {
        alert("Please select some text to refine with AI.");
        return;
    }
    
    const text = textareaRef.current.value.substring(start, end);
    setAiSelectedText(text);
    setAiResult('');
    setAiInstruction('');
    setShowAiModal(true);
  };

  const handleAiGenerate = async () => {
    if (!aiInstruction) return;
    setIsAiLoading(true);
    try {
        if (!consumeCredits(5)) {
          setIsAiLoading(false);
          setAiResult("Insufficient credits.");
          return;
        }
        const result = await refineLegalText(aiSelectedText, aiInstruction);
        setAiResult(result);
    } catch (e) {
        setAiResult("Error generating response.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleAiApply = () => {
    if (!textareaRef.current || !selectedDoc) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    const newText = val.substring(0, start) + aiResult + val.substring(end);
    setSelectedDoc({ ...selectedDoc, content: newText });
    setHasUnsavedChanges(true);
    setShowAiModal(false);
  };

  const handleExportPDF = () => {
    if (!selectedDoc) return;
    const doc = new jsPDF();
    const splitTitle = doc.splitTextToSize(selectedDoc.title, 180);
    const splitContent = doc.splitTextToSize(selectedDoc.content, 180);
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(splitTitle, 15, 20);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    let y = 35;
    for(let i=0; i < splitContent.length; i++) {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(splitContent[i], 15, y);
        y += 7;
    }
    doc.save(`${selectedDoc.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Document List */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-legal-900 mb-4 flex items-center gap-2 uppercase tracking-tighter italic">
            <FileText className="w-6 h-6 text-legal-gold"/> File Cabinet
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-legal-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Search case files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 focus:border-legal-gold transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cases.map(c => {
            const caseDocs = allDocs.filter(d => d.caseId === c.id);
            if (caseDocs.length === 0) return null;
            return (
              <div key={c.id} className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[140px]">
                    {c.title}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-legal-gold"></span>
                </div>
                <div className="space-y-0.5">
                  {caseDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(c.id, doc)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all ${
                        selectedDoc?.docId === doc.id 
                          ? 'bg-legal-900 text-white shadow-lg shadow-legal-900/20 translate-x-1' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${selectedDoc?.docId === doc.id ? 'bg-legal-800' : 'bg-slate-100 group-hover:bg-white'}`}>
                        <File className={`w-3.5 h-3.5 ${selectedDoc?.docId === doc.id ? 'text-legal-gold' : 'text-slate-400'}`} />
                      </div>
                      <span className="truncate font-bold tracking-tight">{doc.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {allDocs.length === 0 && (
            <div className="px-4 text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-100" />
              <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Locker Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        {selectedDoc ? (
          <>
            {/* Unified Topbar */}
            <div className="h-20 border-b border-slate-100 flex justify-between items-center px-8 bg-white/80 backdrop-blur-xl shrink-0 z-20">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="truncate max-w-[150px]">{cases.find(c => c.id === selectedDoc.caseId)?.title}</span>
                        <ChevronRight size={10} />
                        <span className="text-legal-gold">{selectedDoc.status}</span>
                    </div>
                    <h1 className="text-xl font-serif font-black text-legal-900 tracking-tight">{selectedDoc.title}</h1>
                </div>
                {hasUnsavedChanges && (
                    <div className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100 uppercase animate-pulse">
                        Unsaved Changes
                    </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Secondary Actions */}
                <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl gap-1 mr-4">
                    <button 
                    onClick={() => setShowVariables(!showVariables)}
                    className={`p-2 rounded-xl transition-all ${showVariables ? 'bg-white text-legal-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Variables"
                    >
                        <Wand2 size={18} />
                    </button>
                    <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-white text-legal-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="History"
                    >
                        <History size={18} />
                    </button>
                </div>

                {/* Main Actions */}
                <button 
                   onClick={() => setPreviewMode(!previewMode)}
                   className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 text-sm font-bold transition-all"
                >
                  {previewMode ? <><PenTool size={16}/> Edit Mode</> : <><Eye size={16}/> Preview</>}
                </button>
                
                <div className="h-6 w-px bg-slate-100 mx-2"></div>

                <button 
                  onClick={handleExportPDF}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Export PDF"
                >
                  <FileDown size={20} />
                </button>

                <button 
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="ml-2 px-6 py-2.5 bg-legal-900 text-white rounded-xl text-sm font-black hover:bg-legal-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl shadow-legal-900/20 transition-all active:scale-95"
                >
                  <Save size={18} className="text-legal-gold" /> SAVE
                </button>
              </div>
            </div>

            {/* Editing Surface */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-slate-50/30 relative">
                  <div className="max-w-4xl mx-auto py-16 px-12 min-h-full flex flex-col">
                      {/* Floating Toolbars would go here - keeping it clean for now */}
                      {!previewMode && (
                        <div className="sticky top-0 bg-white/90 backdrop-blur p-2 rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200 mb-12 flex gap-1 items-center z-10 self-center">
                          <button onClick={() => applyFormat('bold')} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600" title="Bold"><Bold size={18} /></button>
                          <button onClick={() => applyFormat('italic')} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600" title="Italic"><Italic size={18} /></button>
                          <button onClick={() => applyFormat('h1')} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 font-black" title="Heading">H1</button>
                          <div className="w-px h-6 bg-slate-100 mx-2"></div>
                          <button onClick={() => applyFormat('list')} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600" title="List"><List size={18} /></button>
                          <button onClick={() => applyFormat('quote')} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600" title="Quote"><Quote size={18} /></button>
                          <div className="w-px h-6 bg-slate-100 mx-2"></div>
                          <button 
                            onClick={handleOpenAiModal}
                            className="ml-2 px-4 py-2 rounded-xl bg-legal-900 text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-legal-800 transition-all group" 
                          >
                            <Sparkles size={14} className="text-legal-gold group-hover:rotate-12 transition-transform" /> AI REFRESH
                          </button>
                        </div>
                      )}

                      {/* Content Area */}
                      <div className="bg-white p-16 shadow-2xl rounded-sm min-h-[1056px] border border-slate-100 ring-1 ring-slate-200 relative">
                        {previewMode ? (
                        <div className="prose prose-lg max-w-none font-serif text-slate-800 flex-1 leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.content}</ReactMarkdown>
                        </div>
                        ) : (
                        <textarea
                            ref={textareaRef}
                            value={selectedDoc.content}
                            onChange={(e) => {
                                setSelectedDoc({...selectedDoc, content: e.target.value});
                                setHasUnsavedChanges(true);
                            }}
                            placeholder="Type the legal facts or instructions..."
                            className="w-full flex-1 resize-none border-none focus:ring-0 px-0 text-xl leading-relaxed text-slate-700 font-serif bg-transparent outline-none min-h-[800px]"
                            spellCheck={false}
                        />
                        )}
                        
                        <div className="absolute bottom-12 right-12 opacity-5 pointer-events-none">
                            <h2 className="text-4xl font-serif font-black italic text-legal-900">LEXINAIJA</h2>
                        </div>
                      </div>
                  </div>
                </div>

                {/* History Sidebar */}
                {showHistory && (
                    <div className="w-96 border-l border-slate-100 bg-white flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl z-30">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black text-legal-900 uppercase tracking-tighter italic">Timeline</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Document Revisions</p>
                            </div>
                            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"><ChevronRight /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {currentStoredDoc?.versions?.map((v) => (
                                <div key={v.id} className="group p-5 rounded-2xl border border-slate-50 hover:border-legal-gold hover:shadow-xl hover:shadow-legal-gold/5 transition-all bg-white relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-50 group-hover:bg-legal-gold"></div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-3">{new Date(v.timestamp).toLocaleString()}</p>
                                    <p className="font-bold text-slate-900 truncate mb-4">{v.title}</p>
                                    <button 
                                        onClick={() => handleRestoreVersion(v)}
                                        className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-legal-900 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={12} /> RESTORE THIS VERSION
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Variables Sidebar */}
                {showVariables && (
                    <div className="w-96 border-l border-slate-100 bg-white flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl z-30">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black text-legal-900 uppercase tracking-tighter italic">Auto-Fill</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Context Variables</p>
                            </div>
                            <button onClick={() => setShowVariables(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"><ChevronRight /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {Object.entries(variables).map(([key, val]) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</label>
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-legal-gold/20"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="p-8 border-t border-slate-50">
                            <button
                                onClick={() => {
                                    let content = selectedDoc.content;
                                    Object.entries(variables).forEach(([key, val]) => {
                                        if (!val) return;
                                        const pattern = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                                        content = content.replace(pattern, val);
                                    });
                                    setSelectedDoc({ ...selectedDoc, content });
                                    setHasUnsavedChanges(true);
                                }}
                                className="w-full py-4 bg-legal-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-legal-900/20 hover:scale-[1.02] transition-all"
                            >
                                INJECT VARIABLES
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* AI Assistant Modal */}
            {showAiModal && (
                <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 flex justify-between items-center bg-slate-50/50">
                             <div>
                                <h3 className="text-xl font-black text-legal-900 uppercase tracking-tighter italic flex items-center gap-2">
                                    <Sparkles className="text-legal-gold" size={24}/> AI REFINERY
                                </h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Legal Language Processor</p>
                             </div>
                             <button onClick={() => setShowAiModal(false)} className="p-2 bg-white rounded-full text-slate-300 hover:text-slate-600 transition-colors shadow-sm border border-slate-100"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                                <span className="absolute -top-3 left-6 px-2 py-0.5 bg-white border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded-full">Source Text</span>
                                <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-3">"{aiSelectedText}"</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {["Make Formal", "Fix Grammar", "Expand", "Simplify", "To Legalese"].map((opt) => (
                                        <button 
                                            key={opt}
                                            onClick={() => setAiInstruction(opt)}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${aiInstruction === opt ? 'bg-legal-gold text-legal-900 shadow-lg shadow-legal-gold/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={aiInstruction}
                                        onChange={(e) => setAiInstruction(e.target.value)}
                                        placeholder="Specific refinement instructions..." 
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-6 pr-16 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-legal-gold/20 placeholder:text-slate-300"
                                    />
                                    <button 
                                        onClick={handleAiGenerate}
                                        disabled={!aiInstruction || isAiLoading}
                                        className="absolute right-2 top-2 bottom-2 px-4 bg-legal-900 text-white rounded-xl hover:bg-legal-800 disabled:opacity-50 transition-all shadow-lg active:scale-90"
                                    >
                                        {isAiLoading ? <Wand2 size={16} className="animate-spin text-legal-gold" /> : <Wand2 size={16} />}
                                    </button>
                                </div>
                            </div>

                            {aiResult && !isAiLoading && (
                                <div className="animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100 relative">
                                        <span className="absolute -top-3 left-6 px-2 py-0.5 bg-white border border-green-100 text-[8px] font-black text-green-600 uppercase tracking-widest rounded-full">Refined Result</span>
                                        <p className="text-sm text-slate-900 leading-relaxed">{aiResult}</p>
                                    </div>
                                    <div className="flex gap-3 mt-8">
                                        <button onClick={() => setShowAiModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Discard</button>
                                        <button 
                                            onClick={handleAiApply}
                                            className="flex-[2] py-4 bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-legal-900/20 hover:scale-[1.02] transition-all"
                                        >
                                            REPLACE TEXT IN DOCUMENT
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
            <div className="w-32 h-32 bg-white rounded-full shadow-[0_0_80px_-20px_rgba(0,0,0,0.1)] flex items-center justify-center mb-8 relative z-10 border border-slate-100 animate-pulse">
               <FileSignature className="w-12 h-12 text-slate-100" />
            </div>
            <h4 className="text-2xl font-serif font-black text-slate-300 italic z-10 uppercase tracking-widest">Select a File</h4>
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest mt-2 z-10">Workspace ready for drafting</p>
          </div>
        )}
      </div>
    </div>
  );
};
