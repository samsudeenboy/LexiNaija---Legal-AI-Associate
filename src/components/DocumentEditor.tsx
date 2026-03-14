import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { SavedDocument, DocumentVersion } from '../types';
import { 
  FileText, Save, Download, File, Search, ChevronRight, PenTool, Eye, History, RotateCcw,
  Bold, Italic, Underline, Heading, List, ListOrdered, Quote, Code,
  Strikethrough, Subscript, Superscript, Link as LinkIcon, Table as TableIcon,
  CheckSquare, Minus, Image as ImageIcon, Sparkles, X, Wand2, Columns, Layout, Gavel
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { refineLegalText } from '../services/geminiService';
import debounce from 'lodash.debounce';
import { useToast } from '../contexts/ToastContext';

interface EditorState {
  caseId: string;
  docId: string;
  title: string;
  content: string;
  status: SavedDocument['status'];
}

export const DocumentEditor: React.FC = () => {
  const { showToast } = useToast();
  const { cases, clients, firmProfile, updateCaseDocument, activeDoc, setActiveDoc, creditsTotal, creditsUsed, consumeCredits } = useLegalStore();
  const [selectedDoc, setSelectedDoc] = useState<EditorState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [paperMode, setPaperMode] = useState(true);
  const [variables, setVariables] = useState<Record<string, string>>({});
  
  // AI Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSelectedText, setAiSelectedText] = useState('');
  const [aiInstruction, setAiInstruction] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Floating AI Toolbar State
  const [selectionRange, setSelectionRange] = useState<{ top: number, left: number } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save logic
  const debouncedSave = useCallback(
    debounce((caseId: string, docId: string, title: string, content: string) => {
      setIsSaving(true);
      updateCaseDocument(caseId, docId, { title, content });
      setHasUnsavedChanges(false);
      setTimeout(() => setIsSaving(false), 1000);
    }, 2000),
    []
  );

  // Initialize from Context (e.g. redirected from Precedents)
  useEffect(() => {
    if (activeDoc) {
      const caseItem = cases.find(c => c.id === activeDoc.caseId);
      const docItem = caseItem?.documents.find(d => d.id === activeDoc.docId);
      
      if (caseItem && docItem) {
        if (hasUnsavedChanges && selectedDoc?.docId !== activeDoc.docId) {
             if(!confirm("Unsaved changes will be lost. Continue?")) {
                 setActiveDoc(null); // Abort navigation
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

  // Sync scroll between editor and preview
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!splitView || !previewRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const ratio = scrollTop / (scrollHeight - clientHeight);
    previewRef.current.scrollTop = ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
  };

  // Text Selection detection for Floating Toolbar
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && textareaRef.current) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const textareaRect = textareaRef.current.getBoundingClientRect();
      
      if (rect.top >= textareaRect.top && rect.bottom <= textareaRect.bottom) {
        setSelectionRange({
          top: rect.top - 40,
          left: rect.left + rect.width / 2
        });
      }
    } else {
      setSelectionRange(null);
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleTextSelection);
    return () => document.removeEventListener('selectionchange', handleTextSelection);
  }, []);

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
    if (confirm(`Are you sure you want to restore the version from ${new Date(version.timestamp).toLocaleTimeString()}? Unsaved changes will be lost.`)) {
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
      case 'bold': newText = val.substring(0, start) + `**${selection}**` + val.substring(end); newCursorPos = selection.length > 0 ? end + 4 : start + 2; break;
      case 'italic': newText = val.substring(0, start) + `*${selection}*` + val.substring(end); newCursorPos = selection.length > 0 ? end + 2 : start + 1; break;
      case 'h1': newText = val.substring(0, start) + `# ${selection}` + val.substring(end); newCursorPos = start + 2 + selection.length; break;
      case 'list': newText = val.substring(0, start) + `- ${selection}` + val.substring(end); newCursorPos = start + 2 + selection.length; break;
      case 'quote': newText = val.substring(0, start) + `> ${selection}` + val.substring(end); newCursorPos = start + 2 + selection.length; break;
    }

    const nextState = { ...selectedDoc, content: newText };
    setSelectedDoc(nextState);
    setHasUnsavedChanges(true);
    debouncedSave(selectedDoc.caseId, selectedDoc.docId, selectedDoc.title, newText);
    
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
        showToast("Select provision for AI analysis.", "info");
        return;
    }
    
    const text = textareaRef.current.value.substring(start, end);
    setAiSelectedText(text);
    setAiResult('');
    setAiInstruction('');
    setShowAiModal(true);
    setSelectionRange(null);
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
        setAiResult("Error generating response. Please try again.");
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
    const nextState = { ...selectedDoc, content: newText };
    setSelectedDoc(nextState);
    setHasUnsavedChanges(true);
    debouncedSave(selectedDoc.caseId, selectedDoc.docId, selectedDoc.title, newText);
    setShowAiModal(false);
  };

  const handleExportPDF = async () => {
    if (!selectedDoc) return;
    showToast("Preparing document for export...", "info");
    
    // If in Paper Mode and preview/split is active, use html2canvas for pixel-perfect export
    if (paperMode && (previewMode || splitView) && previewRef.current) {
        const element = previewRef.current.querySelector('.legal-document-form') as HTMLElement;
        if (element) {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${selectedDoc.title.replace(/\s+/g, '_')}.pdf`);
            showToast("Document exported with institutional formatting.", "success");
            return;
        }
    }

    // Fallback: Standard PDF generation
    const doc = new jsPDF();
    const splitTitle = doc.splitTextToSize(selectedDoc.title, 180);
    const splitContent = doc.splitTextToSize(selectedDoc.content, 180);
    doc.setFont("times", "bold"); doc.setFontSize(16); doc.text(splitTitle, 15, 20);
    doc.setFont("times", "normal"); doc.setFontSize(12);
    let y = 35;
    for(let i=0; i < splitContent.length; i++) {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(splitContent[i], 15, y); y += 7;
    }
    doc.save(`${selectedDoc.title.replace(/\s+/g, '_')}.pdf`);
    showToast("Document exported.", "success");
  };

  const handleExportWord = () => {
    if (!selectedDoc) return;
    const htmlContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"><title>${selectedDoc.title}</title><style>body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; } h1 { font-size: 16pt; font-weight: bold; margin-bottom: 1em; }</style></head>
      <body><h1>${selectedDoc.title}</h1><div style="white-space: pre-wrap;">${selectedDoc.content}</div></body></html>`;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `${selectedDoc.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleUpdateStatus = (newStatus: SavedDocument['status']) => {
    if (selectedDoc) {
      updateCaseDocument(selectedDoc.caseId, selectedDoc.docId, { status: newStatus });
      setSelectedDoc(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 pt-6">
        <div className="px-5 mb-6">
          <h2 className="text-xl font-serif font-black text-legal-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-legal-gold"/> Documents
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-legal-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 focus:border-legal-gold transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {cases.map(c => {
            const caseDocs = allDocs.filter(d => d.caseId === c.id);
            if (caseDocs.length === 0) return null;
            return (
              <div key={c.id} className="mb-4">
                <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 truncate">
                  {c.title}
                </div>
                <div className="space-y-1">
                  {caseDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(c.id, doc)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
                        selectedDoc?.docId === doc.id 
                          ? 'bg-white shadow-sm ring-1 ring-gray-100 text-legal-900 font-semibold' 
                          : 'text-slate-500 hover:bg-gray-100 hover:text-legal-900'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedDoc?.docId === doc.id ? 'bg-legal-900 text-legal-gold' : 'bg-white text-slate-400 border border-gray-100'}`}>
                        <File size={16} />
                      </div>
                      <span className="truncate flex-1">{doc.title}</span>
                      <div className={`w-2 h-2 rounded-full ${doc.status === 'Signed' ? 'bg-green-500' : doc.status === 'Under Review' ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {selectedDoc ? (
          <>
            <div className="h-16 border-b border-gray-100 flex justify-between items-center px-8 bg-white shrink-0 z-20">
              <div className="flex items-center gap-3 text-sm">
                <div className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                    {cases.find(c => c.id === selectedDoc.caseId)?.title}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-serif font-black text-legal-900 uppercase italic tracking-tight truncate max-w-[200px]">{selectedDoc.title}</span>
                {isSaving ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600 ml-4 animate-pulse">
                     <Save size={12} /> Auto-saving
                  </span>
                ) : hasUnsavedChanges && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-4">• Pending sync</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-legal-900 text-white rounded-lg flex items-center gap-2 group cursor-pointer hover:bg-legal-800 transition-colors">
                    <span className="text-[10px] font-black tracking-widest text-legal-gold uppercase italic">PREMIUM SUBSCRIPTION</span>
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-[10px] font-black tracking-widest uppercase">{creditsTotal - creditsUsed} CR</span>
                </div>

                <div className="relative group">
                    <select 
                        value={selectedDoc.status} 
                        onChange={(e) => handleUpdateStatus(e.target.value as SavedDocument['status'])}
                        className="pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 bg-slate-50 text-slate-500 appearance-none focus:ring-2 focus:ring-legal-gold/20 focus:border-legal-gold outline-none transition-all cursor-pointer"
                    >
                        <option value="Draft">DRAFT STAGE</option>
                        <option value="Under Review">LEGAL REVIEW</option>
                        <option value="Approved">COUNSEL APPROVED</option>
                        <option value="Signed">EXECUTED</option>
                    </select>
                    <ChevronRight className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>

                <div className="h-8 w-px bg-gray-100"></div>

                <div className="flex gap-1">
                    <button 
                        onClick={() => { setSplitView(!splitView); setPreviewMode(false); }}
                        className={`p-2.5 rounded-xl transition-all ${splitView ? 'bg-legal-gold text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 hover:text-legal-900'}`}
                        title="Split Layout"
                    >
                        <Columns size={18} />
                    </button>
                    {!splitView && (
                        <button 
                            onClick={() => setPreviewMode(!previewMode)}
                            className={`p-2.5 rounded-xl transition-all ${previewMode ? 'bg-legal-900 text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 hover:text-legal-900'}`}
                            title="Preview Mode"
                        >
                            <Eye size={18} />
                        </button>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-100"></div>
                
                <div className="flex gap-1">
                    <button onClick={handleExportPDF} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Export PDF"><Download size={18} /></button>
                    <button onClick={handleExportWord} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Export Word"><FileText size={18} /></button>
                </div>

                <div className="h-8 w-px bg-gray-100"></div>

                <button 
                  onClick={() => setPaperMode(!paperMode)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paperMode ? 'bg-legal-gold text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {paperMode ? 'LEGAL PAPER MODE: ON' : 'LEGAL PAPER MODE: OFF'}
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-slate-50/50">
                <div className={`flex flex-col h-full bg-white transition-all duration-500 ${splitView ? 'w-1/2 border-r border-gray-100' : 'w-full'} overflow-hidden`}>
                  <div className="flex-1 overflow-y-auto relative scrollbar-hide py-12 px-10">
                      <div className="max-w-3xl mx-auto min-h-full flex flex-col">
                          <input
                            type="text"
                            value={selectedDoc.title}
                            onChange={(e) => {
                                setSelectedDoc({...selectedDoc, title: e.target.value});
                                setHasUnsavedChanges(true);
                                debouncedSave(selectedDoc.caseId, selectedDoc.docId, e.target.value, selectedDoc.content);
                            }}
                            className="w-full text-5xl font-serif font-black text-legal-900 placeholder-slate-200 border-none focus:ring-0 px-0 mb-10 bg-transparent italic tracking-tighter"
                            placeholder="Title of Instrument"
                          />
                          
                          <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 py-3 mb-8 flex gap-1 items-center flex-wrap">
                            <button onClick={() => applyFormat('bold')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Bold size={16} /></button>
                            <button onClick={() => applyFormat('italic')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Italic size={16} /></button>
                            <button onClick={() => applyFormat('h1')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Heading size={16} /></button>
                            <button onClick={() => applyFormat('list')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><List size={16} /></button>
                            <button onClick={() => applyFormat('quote')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Quote size={16} /></button>
                            <div className="w-px h-4 bg-gray-200 mx-2"></div>
                            <button 
                                onClick={handleOpenAiModal}
                                className="px-4 py-2 rounded-xl bg-legal-gold/10 text-legal-gold hover:bg-legal-gold hover:text-white flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all"
                            >
                                <Sparkles size={14} /> Refine with AI
                            </button>
                            <button 
                                onClick={() => { setAiInstruction("Formalize into court-standard language using institutional legalese, ensuring all parties are properly referenced as defined in the header."); handleAiGenerate(); setShowAiModal(true); }}
                                className="px-4 py-2 rounded-xl bg-legal-900/10 text-legal-900 hover:bg-legal-900 hover:text-white flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all"
                            >
                                <Gavel size={14} /> Formalize for Court
                            </button>
                          </div>
                                                    {previewMode && !splitView ? (
                            <div className={`prose prose-slate prose-lg max-w-none ${paperMode ? 'legal-document-form shadow-2xl scale-95 origin-top' : 'font-serif text-slate-800 flex-1'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <div className="relative flex-1 flex flex-col">
                                <textarea
                                    ref={textareaRef}
                                    value={selectedDoc.content}
                                    onChange={(e) => {
                                        setSelectedDoc({...selectedDoc, content: e.target.value});
                                        setHasUnsavedChanges(true);
                                        debouncedSave(selectedDoc.caseId, selectedDoc.docId, selectedDoc.title, e.target.value);
                                    }}
                                    onScroll={handleScroll}
                                    placeholder="Commence drafting procedures..."
                                    className="w-full flex-1 resize-none border-none focus:ring-0 px-0 text-xl leading-[1.8] text-slate-700 font-serif bg-transparent outline-none pb-40"
                                    spellCheck={false}
                                />
                                {/* Simple Variable Overlay (Visual only, doesn't interfere with typing) */}
                                <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-xl leading-[1.8] text-transparent font-serif py-1 px-0">
                                    {selectedDoc.content.split(/(\[.*?\])/g).map((part, i) => (
                                        part.startsWith('[') && part.endsWith(']') ? 
                                            <span key={i} className="bg-legal-gold/10 text-legal-gold border-b-2 border-legal-gold/30 rounded px-1">{part}</span> : 
                                            <span key={i}>{part}</span>
                                    ))}
                                </div>
                            </div>
                          )}
                      </div>

                      {selectionRange && !showAiModal && (
                        <div 
                            className="fixed z-[100] bg-legal-900 rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 animate-in fade-in zoom-in-95"
                            style={{ top: selectionRange.top, left: selectionRange.left, transform: 'translateX(-50%)' }}
                        >
                            <button 
                                onClick={handleOpenAiModal}
                                className="px-3 py-2 bg-legal-gold text-legal-900 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                <Sparkles size={14} /> AI Improve
                            </button>
                            <button onClick={() => applyFormat('bold')} className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"><Bold size={14}/></button>
                            <button onClick={() => applyFormat('italic')} className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"><Italic size={14}/></button>
                            <div className="w-px h-4 bg-white/20 mx-1"></div>
                            <button onClick={() => setSelectionRange(null)} className="p-2 text-white/50 hover:text-white rounded-xl transition-colors"><X size={14}/></button>
                        </div>
                      )}
                  </div>
                </div>                 {splitView && (
                    <div ref={previewRef} className="w-1/2 h-full overflow-y-auto bg-slate-200/50 py-12 px-10 scrollbar-hide border-l border-gray-100 flex justify-center">
                        <div className={`prose prose-slate prose-lg max-w-none h-fit ${paperMode ? 'legal-document-form shadow-2xl mb-40' : 'bg-white p-12 shadow-sm font-serif text-slate-800'}`}>
                            {!paperMode && <h1 className="text-5xl font-black italic tracking-tighter text-legal-900 mb-10">{selectedDoc.title}</h1>}
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.content}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
            
            {showAiModal && (
                <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-legal-900 p-8 flex justify-between items-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
                             <h3 className="text-white font-serif font-black text-2xl italic tracking-tight flex items-center gap-3 relative z-10">
                                <Sparkles size={24} className="text-legal-gold animate-pulse"/> Legal Intelligence Refinement
                             </h3>
                             <button onClick={() => setShowAiModal(false)} className="text-white/40 hover:text-white relative z-10 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-10">
                            <div className="mb-8">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Selected Provision</label>
                                <div className="p-6 bg-slate-50 rounded-3xl text-sm text-slate-600 max-h-40 overflow-y-auto italic border border-slate-100 relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-legal-gold/20 mr-4"></div>
                                    "{aiSelectedText}"
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Refining Protocol</label>
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {["Make Formal", "Simplify", "Fix Grammar", "Expand", "To Legalese", "Aggressive Style", "Defensive Style"].map((opt) => (
                                        <button 
                                            key={opt}
                                            onClick={() => setAiInstruction(opt)}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${aiInstruction === opt ? 'bg-legal-gold text-white border-legal-gold shadow-lg shadow-legal-gold/20' : 'bg-white text-slate-500 border-gray-100 hover:border-legal-gold hover:text-legal-gold'}`}
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
                                        placeholder="Or input custom directives..." 
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-4 pr-14 py-4 text-sm focus:ring-2 focus:ring-legal-gold/20 outline-none transition-all placeholder-slate-300"
                                    />
                                    <button 
                                        onClick={handleAiGenerate}
                                        disabled={!aiInstruction || isAiLoading}
                                        className="absolute right-2 top-2 p-2.5 bg-legal-900 text-white rounded-xl hover:bg-legal-gold hover:text-legal-900 disabled:opacity-50 transition-all flex items-center justify-center"
                                    >
                                        {isAiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 size={18} />}
                                    </button>
                                </div>
                            </div>

                            {aiResult && !isAiLoading && (
                                <div className="mb-8 animate-in fade-in slide-in-from-bottom-5">
                                    <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-3">AI PROVISION GENERATED</label>
                                    <div className="p-6 bg-green-50 rounded-3xl text-sm text-slate-800 border border-green-100 shadow-sm leading-relaxed">
                                        {aiResult}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowAiModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                                <button 
                                    onClick={handleAiApply}
                                    disabled={!aiResult}
                                    className="flex-[2] py-4 bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 disabled:opacity-20 shadow-xl transition-all"
                                >
                                    Replace Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-40 h-40 bg-white rounded-[40px] shadow-2xl flex items-center justify-center mb-8 animate-pulse">
               <FileText className="w-16 h-16 text-slate-200" />
            </div>
            <p className="text-xl font-serif font-black italic text-slate-300 uppercase tracking-widest">Select Instrument For Review</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
