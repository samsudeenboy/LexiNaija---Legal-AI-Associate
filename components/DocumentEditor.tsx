import React, { useState, useRef, useEffect } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { SavedDocument, DocumentVersion } from '../types';
import { 
  FileText, Save, Download, File, Search, ChevronRight, PenTool, Eye, History, RotateCcw,
  Bold, Italic, Underline, Heading, List, ListOrdered, Quote, Code,
  Strikethrough, Subscript, Superscript, Link as LinkIcon, Table as TableIcon,
  CheckSquare, Minus, Image as ImageIcon, Sparkles, X, Wand2
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
        // If we have unsaved changes on a DIFFERENT doc, prompt? 
        // For simplicity, we assume redirection implies intent to discard or user already saved.
        // But let's be safe.
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
          status: docItem.status || 'Draft' // Default to 'Draft' if not set
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
      // Clear activeDoc so we don't keep resetting if user edits locally
      setActiveDoc(null); 
    }
  }, [activeDoc, cases, hasUnsavedChanges, selectedDoc, setActiveDoc, clients, firmProfile]);

  // Flatten documents for the sidebar list
  const allDocs = cases.flatMap(c => 
    c.documents.map(d => ({ ...d, caseTitle: c.title, caseId: c.id }))
  ).filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the actual stored document to access versions
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
      alert("Document saved successfully.");
    }
  };

  const handleRestoreVersion = (version: DocumentVersion) => {
    if (confirm(`Are you sure you want to restore the version from ${version.timestamp.toLocaleTimeString()}? Unsaved changes will be lost.`)) {
        if (selectedDoc) {
            setSelectedDoc({
                ...selectedDoc,
                title: version.title,
                content: version.content
            });
            setHasUnsavedChanges(true);
            alert("Version loaded into editor. Click Save to make it permanent.");
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
    let newCursorPos = end; // Default cursor position after insertion

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
        // Markdown doesn't standardly support underline, using HTML tag
        newText = val.substring(0, start) + `<u>${selection}</u>` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 7 : start + 3;
        break;
      case 'strikethrough':
        newText = val.substring(0, start) + `~~${selection}~~` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 4 : start + 2;
        break;
      case 'subscript':
        newText = val.substring(0, start) + `<sub>${selection}</sub>` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 11 : start + 5;
        break;
      case 'superscript':
        newText = val.substring(0, start) + `<sup>${selection}</sup>` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 11 : start + 5;
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
      case 'ordered-list':
        newText = val.substring(0, start) + `1. ${selection}` + val.substring(end);
        newCursorPos = start + 3 + selection.length;
        break;
      case 'checklist':
        newText = val.substring(0, start) + `- [ ] ${selection}` + val.substring(end);
        newCursorPos = start + 6 + selection.length;
        break;
      case 'quote':
        newText = val.substring(0, start) + `> ${selection}` + val.substring(end);
        newCursorPos = start + 2 + selection.length;
        break;
      case 'code':
        newText = val.substring(0, start) + `\`${selection}\`` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 2 : start + 1;
        break;
      case 'link':
        newText = val.substring(0, start) + `[${selection}](url)` + val.substring(end);
        newCursorPos = selection.length > 0 ? end + 6 : start + 1;
        break;
      case 'image':
        newText = val.substring(0, start) + `![${selection || 'Image'}](https://example.com/image.png)` + val.substring(end);
        newCursorPos = start + 2 + (selection.length || 5);
        break;
      case 'table':
        const tableTemplate = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;
        newText = val.substring(0, start) + tableTemplate + val.substring(end);
        newCursorPos = start + tableTemplate.length;
        break;
      case 'hr':
        newText = val.substring(0, start) + `\n---\n` + val.substring(end);
        newCursorPos = start + 5;
        break;
      case 'symbol-section':
        newText = val.substring(0, start) + `§` + val.substring(end);
        newCursorPos = start + 1;
        break;
      case 'symbol-paragraph':
        newText = val.substring(0, start) + `¶` + val.substring(end);
        newCursorPos = start + 1;
        break;
    }

    setSelectedDoc({ ...selectedDoc, content: newText });
    setHasUnsavedChanges(true);
    
    // Defer focus to allow React state update to render new value
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
    
    setSelectedDoc({ ...selectedDoc, content: newText });
    setHasUnsavedChanges(true);
    setShowAiModal(false);
  };

  const handleExportPDF = () => {
    if (!selectedDoc) return;
    const doc = new jsPDF();
    
    // Simple PDF generation
    const splitTitle = doc.splitTextToSize(selectedDoc.title, 180);
    const splitContent = doc.splitTextToSize(selectedDoc.content, 180);
    
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(splitTitle, 15, 20);
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    let y = 35;
    
    // Rudimentary pagination loop for simple text
    for(let i=0; i < splitContent.length; i++) {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text(splitContent[i], 15, y);
        y += 7;
    }
    
    doc.save(`${selectedDoc.title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleExportWord = () => {
    if (!selectedDoc) return;
    
    // Create a simple HTML structure for the Word doc
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${selectedDoc.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
          h1 { font-size: 16pt; font-weight: bold; margin-bottom: 1em; }
        </style>
      </head>
      <body>
        <h1>${selectedDoc.title}</h1>
        <div style="white-space: pre-wrap;">${selectedDoc.content}</div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDoc.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = (newStatus: SavedDocument['status']) => {
    if (selectedDoc) {
      updateCaseDocument(selectedDoc.caseId, selectedDoc.docId, { status: newStatus });
      setSelectedDoc(prev => prev ? { ...prev, status: newStatus } : null);
      alert(`Document status updated to ${newStatus}.`);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50 pt-6">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-bold text-legal-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5"/> Documents
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2">
          {cases.map(c => {
            const caseDocs = allDocs.filter(d => d.caseId === c.id);
            if (caseDocs.length === 0) return null;
            return (
              <div key={c.id} className="mb-4">
                <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">
                  {c.title}
                </div>
                <div className="space-y-0.5">
                  {caseDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(c.id, doc)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                        selectedDoc?.docId === doc.id 
                          ? 'bg-white shadow-sm text-legal-900 border border-gray-200' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-legal-900'
                      }`}
                    >
                      <File className="w-3.5 h-3.5 shrink-0 text-legal-gold" />
                      <span className="truncate">{doc.title}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-legal-50 text-legal-800">{doc.status}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {allDocs.length === 0 && (
            <div className="px-4 text-sm text-gray-400 text-center py-8">
              No documents found. Draft a contract or save a summary to see it here.
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {selectedDoc ? (
          <>
            {/* Toolbar Actions */}
            <div className="h-14 border-b border-gray-200 flex justify-between items-center px-6 bg-white shrink-0 z-20">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-legal-900 truncate max-w-[200px]">
                    {cases.find(c => c.id === selectedDoc.caseId)?.title}
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{selectedDoc.title}</span>
                {hasUnsavedChanges && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">• Unsaved</span>}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">Credits: {creditsUsed}/{creditsTotal}</span>
                <div className="relative">
                    <select 
                        value={selectedDoc.status} 
                        onChange={(e) => handleUpdateStatus(e.target.value as SavedDocument['status'])}
                        className="p-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 appearance-none pr-6 focus:ring-legal-gold focus:border-legal-gold"
                    >
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Signed">Signed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Archived">Archived</option>
                    </select>
                    <ChevronRight className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
                </div>
                <button 
                   onClick={() => setShowHistory(!showHistory)}
                   className={`p-2 rounded-lg flex items-center gap-1.5 text-sm transition-colors ${showHistory ? 'bg-legal-50 text-legal-900 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
                   title="Version History"
                >
                    <History size={16} /> 
                </button>
                <button 
                   onClick={() => setShowVariables(!showVariables)}
                   className={`p-2 rounded-lg flex items-center gap-1.5 text-sm transition-colors ${showVariables ? 'bg-legal-50 text-legal-900 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
                   title="Variables"
                >
                    <Wand2 size={16} />
                </button>
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <button 
                   onClick={() => setPreviewMode(!previewMode)}
                   className="p-2 text-gray-500 hover:text-legal-900 hover:bg-gray-100 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                   title="Toggle Preview"
                >
                  {previewMode ? <><PenTool size={16}/> Edit</> : <><Eye size={16}/> Preview</>}
                </button>
                <button 
                  onClick={handleExportWord}
                  className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                >
                  <FileText size={16} /> Word
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                >
                  <Download size={16} /> PDF
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="ml-2 px-4 py-2 bg-legal-900 text-white rounded-lg text-sm font-medium hover:bg-legal-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Canvas */}
                <div className="flex-1 overflow-y-auto bg-white relative">
                  <div className="max-w-4xl mx-auto py-12 px-8 min-h-full flex flex-col">
                      {/* Title Input */}
                      <input
                      type="text"
                      value={selectedDoc.title}
                      onChange={(e) => {
                          setSelectedDoc({...selectedDoc, title: e.target.value});
                          setHasUnsavedChanges(true);
                      }}
                      className="w-full text-4xl font-serif font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 px-0 mb-6 bg-transparent"
                      placeholder="Untitled Document"
                      />
                      
                      {/* Formatting Toolbar - Only visible in Edit Mode */}
                      {!previewMode && (
                        <div className="sticky top-0 bg-white z-10 py-2 border-b border-gray-100 mb-4 flex gap-1 items-center flex-wrap">
                          <button onClick={() => applyFormat('bold')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Bold">
                            <Bold size={16} />
                          </button>
                          <button onClick={() => applyFormat('italic')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Italic">
                            <Italic size={16} />
                          </button>
                          <button onClick={() => applyFormat('underline')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Underline">
                            <Underline size={16} />
                          </button>
                          <button onClick={() => applyFormat('strikethrough')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Strikethrough">
                            <Strikethrough size={16} />
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button onClick={() => applyFormat('subscript')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Subscript">
                            <Subscript size={16} />
                          </button>
                          <button onClick={() => applyFormat('superscript')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Superscript">
                            <Superscript size={16} />
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button onClick={() => applyFormat('symbol-section')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900 font-serif font-bold" title="Section Symbol (§)">
                            §
                          </button>
                          <button onClick={() => applyFormat('symbol-paragraph')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900 font-serif font-bold" title="Paragraph Symbol (¶)">
                            ¶
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button onClick={() => applyFormat('h1')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Heading 1">
                            <Heading size={16} />
                          </button>
                          <button onClick={() => applyFormat('h2')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900 font-bold text-xs" title="Heading 2">
                            H2
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button onClick={() => applyFormat('list')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Bullet List">
                            <List size={16} />
                          </button>
                          <button onClick={() => applyFormat('ordered-list')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Ordered List">
                            <ListOrdered size={16} />
                          </button>
                          <button onClick={() => applyFormat('checklist')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Checklist / To-Do">
                            <CheckSquare size={16} />
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button onClick={() => applyFormat('quote')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Quote">
                            <Quote size={16} />
                          </button>
                          <button onClick={() => applyFormat('code')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Code Block">
                            <Code size={16} />
                          </button>
                          <button onClick={() => applyFormat('hr')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Horizontal Divider">
                            <Minus size={16} />
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button onClick={() => applyFormat('link')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Link">
                            <LinkIcon size={16} />
                          </button>
                          <button onClick={() => applyFormat('image')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Image">
                            <ImageIcon size={16} />
                          </button>
                          <button onClick={() => applyFormat('table')} className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-legal-900" title="Table">
                            <TableIcon size={16} />
                          </button>
                          <div className="w-px h-4 bg-gray-200 mx-1"></div>
                          <button 
                            onClick={handleOpenAiModal}
                            className="px-2 py-1.5 rounded bg-legal-50 text-legal-800 border border-legal-200 hover:bg-legal-100 flex items-center gap-1.5 text-xs font-semibold transition-colors" 
                            title="AI Assist"
                          >
                            <Sparkles size={14} className="text-legal-gold" /> AI Assist
                          </button>
                        </div>
                      )}

                      {/* Content Area */}
                      {previewMode ? (
                      <div className="prose prose-lg max-w-none font-serif text-gray-800 flex-1">
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
                          placeholder="Start writing or drafting..."
                          className="w-full flex-1 resize-none border-none focus:ring-0 px-0 text-lg leading-relaxed text-gray-700 font-serif bg-transparent outline-none"
                          spellCheck={false}
                      />
                      )}
                  </div>
                </div>

                {/* History Sidebar */}
                {showHistory && (
                    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col animate-in slide-in-from-right-10 duration-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-legal-900 flex items-center gap-2"><History size={16}/> Version History</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {currentStoredDoc && currentStoredDoc.versions && currentStoredDoc.versions.length > 0 ? (
                                currentStoredDoc.versions.map((v) => (
                                    <div key={v.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-legal-gold transition-colors">
                                        <p className="text-xs text-gray-400 mb-1">{new Date(v.timestamp).toLocaleString()}</p>
                                        <p className="font-medium text-sm text-legal-900 truncate mb-2">{v.title}</p>
                                        <div className="flex justify-end">
                                            <button 
                                                onClick={() => handleRestoreVersion(v)}
                                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                            >
                                                <RotateCcw size={12} /> Restore
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-8 text-sm">
                                    <History size={24} className="mx-auto mb-2 opacity-20"/>
                                    <p>No previous versions available.</p>
                                    <p className="text-xs mt-1">Versions are created when you save changes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {showVariables && (
                    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col animate-in slide-in-from-right-10 duration-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-legal-900 flex items-center gap-2"><Wand2 size={16}/> Variables</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {Object.entries(variables).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">{key}</label>
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    if (!selectedDoc) return;
                                    let content = selectedDoc.content;
                                    Object.entries(variables).forEach(([key, val]) => {
                                        if (!val) return;
                                        const pattern = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                                        content = content.replace(pattern, val);
                                    });
                                    setSelectedDoc({ ...selectedDoc, content });
                                    setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-legal-900 rounded-lg hover:bg-legal-800"
                            >
                                Apply Variables
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* AI Assistant Modal */}
            {showAiModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-legal-900 p-4 flex justify-between items-center">
                             <h3 className="text-white font-bold flex items-center gap-2"><Sparkles size={18} className="text-legal-gold"/> AI Text Refinement</h3>
                             <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Selected Text</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto italic">
                                    "{aiSelectedText}"
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-2">How should I refine this?</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {["Make Formal", "Simplify", "Fix Grammar", "Expand", "To Legalese"].map((opt) => (
                                        <button 
                                            key={opt}
                                            onClick={() => setAiInstruction(opt)}
                                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${aiInstruction === opt ? 'bg-legal-gold text-white border-legal-gold' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={aiInstruction}
                                        onChange={(e) => setAiInstruction(e.target.value)}
                                        placeholder="Or type custom instruction (e.g. 'Translate to Pidgin')" 
                                        className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-legal-gold outline-none"
                                    />
                                    <button 
                                        onClick={handleAiGenerate}
                                        disabled={!aiInstruction || isAiLoading}
                                        className="absolute right-1 top-1 p-1.5 bg-legal-900 text-white rounded hover:bg-legal-800 disabled:opacity-50"
                                    >
                                        <Wand2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {isAiLoading && (
                                <div className="py-8 text-center text-gray-500">
                                    <Sparkles className="animate-spin w-8 h-8 mx-auto mb-2 text-legal-gold" />
                                    <p className="text-sm">Refining text...</p>
                                </div>
                            )}

                            {aiResult && !isAiLoading && (
                                <div className="mb-6 animate-in fade-in slide-in-from-bottom-2">
                                    <label className="block text-xs font-bold text-green-600 uppercase mb-2">Suggested Revision</label>
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-800">
                                        {aiResult}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button 
                                    onClick={handleAiApply}
                                    disabled={!aiResult}
                                    className="px-4 py-2 text-sm bg-legal-900 text-white rounded-lg hover:bg-legal-800 disabled:opacity-50 font-medium"
                                >
                                    Replace Text
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-gray-50">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <FileText className="w-10 h-10 opacity-40" />
            </div>
            <p className="text-lg font-medium text-gray-400">Select a document to open the editor</p>
          </div>
        )}
      </div>
    </div>
  );
};
