import React, { useState } from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { Search, AlertTriangle, CheckCircle, ShieldAlert, User, Briefcase } from 'lucide-react';

export const ConflictCheck: React.FC = () => {
  const { clients, cases } = useLegalStore();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Logic to find matches
  const clientMatches = query ? clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : [];
  
  const opposingPartyMatches = query ? cases.filter(c => 
    c.opposingParty && c.opposingParty.toLowerCase().includes(query.toLowerCase())
  ) : [];
  
  const caseMatches = query ? cases.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const totalMatches = clientMatches.length + opposingPartyMatches.length + caseMatches.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
        setHasSearched(true);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-legal-900">Conflict of Interest Checker</h2>
        <p className="text-gray-500 mt-2">Before accepting a new brief, verify that the party is not an existing client or an adverse party in another matter.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
                type="text" 
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setHasSearched(false);
                }}
                placeholder="Enter name of person, company or entity..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-legal-gold focus:border-transparent text-lg"
            />
            <button 
                type="submit"
                disabled={!query}
                className="absolute right-2 top-2 bottom-2 px-6 bg-legal-900 text-white rounded-lg hover:bg-legal-800 disabled:opacity-50 font-medium transition-colors"
            >
                Check
            </button>
        </div>
      </form>

      {hasSearched && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            {totalMatches === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-800 mb-1">No Conflicts Found</h3>
                    <p className="text-green-700">The name "{query}" does not appear in your client directory or active cases.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-red-800 mb-1">Potential Conflicts Detected</h3>
                            <p className="text-red-700">Found {totalMatches} record(s) matching "{query}". Please review carefully.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Matches */}
                        {clientMatches.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2">
                                    <User size={16} /> Existing Clients
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {clientMatches.map(c => (
                                        <div key={c.id} className="p-4 hover:bg-gray-50">
                                            <p className="font-bold text-legal-900">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.type} • Added {new Date(c.dateAdded).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Opposing Party Matches */}
                        {opposingPartyMatches.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 bg-red-50 border-b border-red-100 font-bold text-red-800 flex items-center gap-2">
                                    <ShieldAlert size={16} /> Opposing Parties in Active Cases
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {opposingPartyMatches.map(c => (
                                        <div key={c.id} className="p-4 hover:bg-gray-50">
                                            <p className="font-bold text-legal-900">{c.opposingParty}</p>
                                            <p className="text-sm text-gray-600 mt-1">Case: {c.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Court: {c.court}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Case Title Matches */}
                        {caseMatches.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2">
                                    <Briefcase size={16} /> Mentioned in Case Titles
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {caseMatches.map(c => (
                                        <div key={c.id} className="p-4 hover:bg-gray-50">
                                            <p className="font-bold text-legal-900">{c.title}</p>
                                            <p className="text-xs text-gray-500">{c.status}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};