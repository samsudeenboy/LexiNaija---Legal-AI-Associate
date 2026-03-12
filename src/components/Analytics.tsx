import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';

export const Analytics: React.FC = () => {
  const { getAnalytics } = useLegalStore();
  const analytics = getAnalytics();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-legal-900 mb-8">Legal Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Cases</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalCases}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-600">Active Cases</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.activeCases}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Clients</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalClients}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">₦{analytics.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Status Distribution</h3>
          {Object.entries(analytics.caseStatusDistribution).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{status}</span>
              <span className="text-sm font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clients by Revenue</h3>
          {analytics.topClients.map((client, index) => (
            <div key={client.clientId} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-legal-800 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900">{client.clientName}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">₦{client.totalRevenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};