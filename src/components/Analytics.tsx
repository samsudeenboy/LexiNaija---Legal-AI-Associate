import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';

export const Analytics: React.FC = () => {
  const { getAnalytics } = useLegalStore();
  const analytics = getAnalytics();

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Firm Performance
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Analytics</h2>
          <p className="text-slate-400 font-medium">Insights and metrics on firm performance and matter status.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Total Matters</h3>
          <p className="text-4xl font-black text-legal-900 relative z-10">{analytics.totalCases}</p>
        </div>
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Active Matters</h3>
          <p className="text-4xl font-black text-legal-900 relative z-10">{analytics.activeCases}</p>
        </div>
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Total Clients</h3>
          <p className="text-4xl font-black text-legal-900 relative z-10">{analytics.totalClients}</p>
        </div>
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-legal-gold/50 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-legal-gold/10 opacity-0 group-hover:opacity-100 rounded-full translate-x-12 -translate-y-12 blur-xl transition-opacity"></div>
          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 relative z-10">Total Revenue</h3>
          <p className="text-4xl font-black text-legal-900 relative z-10">₦{analytics.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 mb-6 border-b border-slate-100 pb-4">Matter Posture Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.caseStatusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">{status}</span>
                <span className="text-lg font-black text-legal-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 mb-6 border-b border-slate-100 pb-4">Primary Clients by Revenue</h3>
          <div className="space-y-4">
            {analytics.topClients.map((client, index) => (
              <div key={client.clientId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-legal-900 text-legal-gold rounded-full flex items-center justify-center text-[10px] font-black tracking-widest shadow-inner">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-legal-900">{client.clientName}</span>
                </div>
                <span className="text-lg font-black text-legal-900">₦{client.totalRevenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};