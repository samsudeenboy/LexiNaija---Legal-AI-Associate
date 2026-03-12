import React, { useState } from 'react';
import { UploadCloud, BookOpen, ChevronRight, AlertTriangle, Save } from 'lucide-react';
import { summarizeCaseText } from '../services/geminiService';
import { CaseSummary } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useToast } from '../contexts/ToastContext';

export const Summarizer: React.FC = () => {
  const { showToast } = useToast();
  const { cases, saveDocumentToCase, consumeCredits } = useLegalStore();
  const [text, setText] = useState('');
  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    if (!consumeCredits(3)) {
      showToast("Insufficient Intelligence Credits.", "error");
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeCaseText(text);
      setSummary(result);
    } catch (error) {
      showToast("Analysis protocol failure.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCase = () => {
    if (selectedCase && summary) {
        saveDocumentToCase(selectedCase, {
            id: Date.now().toString(),
            title: `Summary: ${summary.title}`,
            content: `Ratio: ${summary.ratioDecidendi}\n\nSummary: ${summary.summary}`,
            type: 'Summary',
            createdAt: new Date()
        });
        setShowSaveModal(false);
        showToast("Analysis archived to matter file.", "success");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-serif font-bold text-legal-900 mb-2">Case Analyzer</h2>
            <p className="text-gray-500">Extract Ratio Decidendi and summaries from judgments or legal text.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the judgment or legal text here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent resize-none font-mono text-sm"
        />
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            AI analysis should be verified against the certified true copy (CTC).
          </p>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text}
            className="bg-legal-gold hover:bg-yellow-600 text-legal-900 font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Text'}
            {!isLoading && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {summary && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl shadow-lg border-t-4 border-legal-gold overflow-hidden">
            <div className="p-6 bg-legal-50 border-b border-legal-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-legal-900 font-serif">{summary.title}</h3>
              <button 
                onClick={() => setShowSaveModal(true)}
                className="text-sm flex items-center gap-1 text-legal-700 hover:text-legal-900"
              >
                  <Save size={16} /> Save to Case
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Ratio Decidendi
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-legal-900 leading-relaxed">
                    {summary.ratioDecidendi}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Case Summary</h4>
                  <p className="text-gray-700 leading-relaxed">{summary.summary}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 h-fit">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Relevant Statutes</h4>
                <div className="flex flex-wrap gap-2">
                  {summary.relevantStatutes.map((statute, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-legal-800 shadow-sm">
                      {statute}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-96">
                  <h3 className="font-bold mb-4">Save Analysis</h3>
                  <select 
                      className="w-full border p-2 rounded mb-4"
                      value={selectedCase}
                      onChange={e => setSelectedCase(e.target.value)}
                  >
                      <option value="">-- Select Case --</option>
                      {cases.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                  </select>
                  <div className="flex justify-end gap-2">
                      <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                      <button onClick={handleSaveToCase} disabled={!selectedCase} className="px-4 py-2 bg-legal-900 text-white rounded text-sm disabled:opacity-50">Save</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};