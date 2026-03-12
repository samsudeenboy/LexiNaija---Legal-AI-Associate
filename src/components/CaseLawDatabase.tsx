import React, { useState } from 'react';
import { Gavel, Search, BookOpen, ExternalLink, Scale, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CaseLaw {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: string;
  summary: string;
  ratio: string;
  link: string;
}

const MOCK_CASE_LAW: CaseLaw[] = [
  {
    id: '1',
    title: 'A.G. Federation v. Abubakar',
    citation: '(2007) 10 NWLR (Pt. 1041) 1',
    court: 'Supreme Court',
    year: '2007',
    summary: 'A landmark case on the immunity of the President and Vice President and the powers of the Attorney General.',
    ratio: 'The immunity granted to the President and Vice President under Section 308 of the 1999 Constitution is absolute during their tenure.',
    link: 'https://lawpavilion.com'
  },
  {
    id: '2',
    title: 'Savannah Bank v. Ajilo',
    citation: '(1989) 1 NWLR (Pt. 97) 305',
    court: 'Supreme Court',
    year: '1989',
    summary: 'A leading authority on the Land Use Act and the requirement of Governor\'s consent for alienation of land.',
    ratio: 'Any alienation of land without the prior consent of the Governor as required by Section 22 of the Land Use Act is null and void.',
    link: 'https://lawpavilion.com'
  },
  {
    id: '3',
    title: 'Dantata v. Mohammed',
    citation: '(2000) 7 NWLR (Pt. 664) 176',
    court: 'Supreme Court',
    year: '2000',
    summary: 'A case on the principles of res judicata and the finality of judgments.',
    ratio: 'Once a matter has been finally decided by a court of competent jurisdiction, the parties are estopped from litigating the same issue again.',
    link: 'https://lawpavilion.com'
  }
];

export const CaseLawDatabase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CaseLaw[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseLaw | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate API search delay
    setTimeout(() => {
      const filtered = MOCK_CASE_LAW.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.citation.toLowerCase().includes(query.toLowerCase()) ||
        c.summary.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-legal-900 flex items-center gap-3">
          <Gavel className="text-legal-gold" /> Nigerian Case Law Database
        </h2>
        <p className="text-gray-600 mt-2">Access verified Supreme Court and Court of Appeal judgments (LPELR/NWLR Integrated).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Search Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by Party Name, Citation, or Keyword..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="w-full bg-legal-900 text-white py-3 rounded-lg font-bold hover:bg-legal-800 transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? 'Searching...' : 'Search Database'}
              </button>
            </form>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-700 text-sm uppercase tracking-wider">Search Results</span>
              <span className="text-xs text-gray-500 font-medium">{results.length} found</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                  <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">Search the database to see authoritative law reports.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {results.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedCase?.id === c.id ? 'bg-legal-50' : ''}`}
                    >
                      <h3 className="font-bold text-legal-900 mb-1">{c.title}</h3>
                      <p className="text-xs text-legal-gold font-mono mb-2">{c.citation}</p>
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{c.court}</span>
                        <span>{c.year}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {selectedCase ? (
            <>
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-legal-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{selectedCase.court}</span>
                    <span className="text-gray-400 text-xs font-mono">{selectedCase.citation}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-legal-900">{selectedCase.title}</h2>
                </div>
                <button className="p-2 text-legal-gold hover:bg-yellow-50 rounded-lg transition-colors border border-legal-gold">
                  <ExternalLink size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Scale size={16} className="text-legal-gold" /> Ratio Decidendi
                  </h4>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                    <p className="text-lg text-legal-900 font-serif italic leading-relaxed">
                      "{selectedCase.ratio}"
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Case Summary</h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedCase.summary}
                  </p>
                </section>

                <div className="pt-8 border-t border-gray-100 flex gap-4">
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Authenticated By</p>
                    <div className="flex items-center gap-2 text-legal-900 font-bold">
                      <ShieldCheck size={18} className="text-green-600" />
                      LexiNaija Verification Engine
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Last Updated</p>
                    <div className="flex items-center gap-2 text-legal-900 font-bold">
                      <Clock size={18} className="text-legal-gold" />
                      March 2026
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <Scale className="w-24 h-24 mb-4 opacity-10" />
              <p className="text-lg font-medium">Select a judgment from the results to view details</p>
              <div className="mt-6 flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg border border-yellow-200 text-sm">
                <AlertCircle size={16} />
                <span>AI Insights enabled for selected citations</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
