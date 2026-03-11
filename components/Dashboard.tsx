import React from 'react';
import { FileText, Clock, AlertCircle } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { cases } = useLegalStore();

  const totalDocuments = cases.reduce((acc, c) => acc + c.documents.length, 0);
  const activeCases = cases.filter(c => c.status === 'Open' || c.status === 'Pending Court' || c.status === 'Drafting').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-legal-900">Good Morning, Counsel.</h2>
        <p className="text-gray-600 mt-2">Here is your daily brief and activity overview.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Active Matters</h3>
            <AlertCircle className="text-legal-gold w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-legal-900">{activeCases}</p>
          <p className="text-xs text-green-600 mt-1">Files currently open</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Research Queries</h3>
            <Clock className="text-legal-gold w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-legal-900">48</p>
          <p className="text-xs text-gray-400 mt-1">This month (Simulated)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Documents Drafted</h3>
            <FileText className="text-legal-gold w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-legal-900">{totalDocuments}</p>
          <p className="text-xs text-blue-600 mt-1">Across all active cases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-serif font-bold text-lg text-legal-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { action: "Drafted Tenancy Agreement", time: "2 hours ago", client: "Musa Properties Ltd" },
              { action: "Research: Liability in Oil Spills", time: "5 hours ago", client: "Internal" },
              { action: "Summarized: SC.12/2023 Judgment", time: "Yesterday", client: "Chambers" },
            ].map((item, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-medium text-legal-800">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.client}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-legal-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
            <h3 className="font-serif font-bold text-lg mb-4 relative z-10">Legal News Snippets</h3>
            <div className="space-y-4 relative z-10">
              <div className="bg-legal-800/50 p-3 rounded border border-legal-700">
                <span className="text-xs text-legal-gold font-bold">CAMA 2020</span>
                <p className="text-sm mt-1 text-gray-300">Remember to file annual returns for all incorporated trustees by June 30th to avoid penalties.</p>
              </div>
              <div className="bg-legal-800/50 p-3 rounded border border-legal-700">
                <span className="text-xs text-legal-gold font-bold">PRACTICE DIRECTION</span>
                <p className="text-sm mt-1 text-gray-300">New electronic filing guidelines issued by the Federal High Court, Lagos Division.</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};