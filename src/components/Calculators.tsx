import React, { useState } from 'react';
import { Calculator, Calendar, AlertTriangle, CheckCircle2, Coins, Clock } from 'lucide-react';

export const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'limitation' | 'tenancy' | 'fees'>('limitation');

  // Limitation State
  const [limitationDate, setLimitationDate] = useState('');
  const [causeType, setCauseType] = useState('contract');
  const [limitationResult, setLimitationResult] = useState<{status: string, deadline: string, yearsPassed: string} | null>(null);

  // Tenancy State
  const [tenancyType, setTenancyType] = useState('yearly');
  const [noticeDate, setNoticeDate] = useState('');
  const [noticeResult, setNoticeResult] = useState<{expiryDate: string, length: string} | null>(null);

  // Fees State
  const [propertyValue, setPropertyValue] = useState('');
  const [feeResult, setFeeResult] = useState<number | null>(null);

  // Limitation Logic
  const calculateLimitation = () => {
    if (!limitationDate) return;
    
    const start = new Date(limitationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);

    let limitYears = 6;
    let limitLabel = "6 Years";
    let isBarred = false;

    switch(causeType) {
        case 'contract': // Simple Contract
        case 'tort': // Tort
            limitYears = 6;
            limitLabel = "6 Years (Limitation Law)";
            isBarred = diffYears > 6;
            break;
        case 'injury': // Personal Injury
            limitYears = 3;
            limitLabel = "3 Years (Limitation Law)";
            isBarred = diffYears > 3;
            break;
        case 'land': // Recovery of Land
        case 'judgment': // Enforcement of Judgment
            limitYears = 12;
            limitLabel = "12 Years (Limitation Law)";
            isBarred = diffYears > 12;
            break;
        case 'public': // Public Officers
            // 3 months
            limitYears = 0.25; 
            limitLabel = "3 Months (Public Officers Protection Act)";
            isBarred = diffMonths > 3;
            break;
    }

    const deadline = new Date(start);
    if (causeType === 'public') {
        deadline.setMonth(deadline.getMonth() + 3);
    } else {
        deadline.setFullYear(deadline.getFullYear() + limitYears);
    }

    setLimitationResult({
        status: isBarred ? 'STATUTE BARRED' : 'WITHIN TIME',
        deadline: deadline.toDateString(),
        yearsPassed: causeType === 'public' ? `${diffMonths.toFixed(1)} months passed` : `${diffYears.toFixed(1)} years passed`
    });
  };

  // Tenancy Logic
  const calculateTenancy = () => {
      if (!noticeDate) return;
      const start = new Date(noticeDate);
      let expiry = new Date(start);
      let lengthText = "";

      switch(tenancyType) {
          case 'weekly':
              expiry.setDate(expiry.getDate() + 7);
              lengthText = "7 Days Notice";
              break;
          case 'monthly':
              expiry.setMonth(expiry.getMonth() + 1);
              lengthText = "1 Calendar Month Notice";
              break;
          case 'quarterly':
              expiry.setMonth(expiry.getMonth() + 3);
              lengthText = "3 Months Notice";
              break;
          case 'half-yearly':
              expiry.setMonth(expiry.getMonth() + 3); // Commonly 3 months also, sometimes 6. Using 3 based on Lagos Law default for half-yearly.
              lengthText = "3 Months Notice (Lagos Tenancy Law)";
              break;
          case 'yearly':
              expiry.setMonth(expiry.getMonth() + 6);
              lengthText = "6 Months Notice";
              break;
      }
      setNoticeResult({
          expiryDate: expiry.toDateString(),
          length: lengthText
      });
  };

  // Fee Logic (Scale of Charges - Simplified for Demo)
  // Scale I (State Land): 10% ? No, usually sliding.
  // Let's implement the standard 2023 Order logic roughly for Scale 1 (Conveyance)
  const calculateFees = () => {
      const value = parseFloat(propertyValue);
      if (!value) return;
      
      // Simplified sliding scale logic often used as estimation
      let fee = 0;
      
      // First 10m -> 10% (Example approximation)
      // This is highly variable based on Scale 1, 2 or 3.
      // We will use a flat 10% estimation for 'Solicitor's Fee' as a base guide, with a disclaimer.
      fee = value * 0.10; // 10%
      
      setFeeResult(fee);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-legal-900">Legal Calculators</h2>
        <p className="text-gray-500 text-sm mt-1">Procedural deadline and fee estimators for Nigerian practice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
            <button 
                onClick={() => setActiveTab('limitation')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'limitation' ? 'bg-legal-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                <Clock size={18} /> Limitation of Action
            </button>
            <button 
                onClick={() => setActiveTab('tenancy')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'tenancy' ? 'bg-legal-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                <Calendar size={18} /> Tenancy Notices
            </button>
            <button 
                onClick={() => setActiveTab('fees')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'fees' ? 'bg-legal-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                <Coins size={18} /> Scale of Charges
            </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
            {activeTab === 'limitation' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-xl font-bold text-legal-900 mb-6 flex items-center gap-2">
                        <Clock className="text-legal-gold" /> Limitation Period Calculator
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cause of Action</label>
                            <select 
                                value={causeType}
                                onChange={e => setCauseType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none"
                            >
                                <option value="contract">Simple Contract / Debt (6 Yrs)</option>
                                <option value="tort">Tort (General) (6 Yrs)</option>
                                <option value="injury">Personal Injury (3 Yrs)</option>
                                <option value="land">Recovery of Land (12 Yrs)</option>
                                <option value="judgment">Judgment Enforcement (12 Yrs)</option>
                                <option value="public">Action vs Public Officer (3 Months)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Cause Arose</label>
                            <input 
                                type="date" 
                                value={limitationDate}
                                onChange={e => setLimitationDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={calculateLimitation}
                        className="bg-legal-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-legal-800 transition-colors"
                    >
                        Check Status
                    </button>

                    {limitationResult && (
                        <div className={`mt-8 p-6 rounded-xl border ${limitationResult.status === 'STATUTE BARRED' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                {limitationResult.status === 'STATUTE BARRED' ? (
                                    <AlertTriangle className="text-red-600 w-6 h-6" />
                                ) : (
                                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                                )}
                                <h4 className={`text-lg font-bold ${limitationResult.status === 'STATUTE BARRED' ? 'text-red-800' : 'text-green-800'}`}>
                                    {limitationResult.status}
                                </h4>
                            </div>
                            <div className="text-sm space-y-1">
                                <p className="text-gray-700"><strong>Statutory Deadline:</strong> {limitationResult.deadline}</p>
                                <p className="text-gray-500">{limitationResult.yearsPassed}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'tenancy' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-xl font-bold text-legal-900 mb-6 flex items-center gap-2">
                        <Calendar className="text-legal-gold" /> Notice to Quit Calculator
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tenancy Type</label>
                            <select 
                                value={tenancyType}
                                onChange={e => setTenancyType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none"
                            >
                                <option value="weekly">Weekly Tenancy</option>
                                <option value="monthly">Monthly Tenancy</option>
                                <option value="quarterly">Quarterly Tenancy</option>
                                <option value="half-yearly">Half-Yearly Tenancy</option>
                                <option value="yearly">Yearly Tenancy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Notice Served</label>
                            <input 
                                type="date" 
                                value={noticeDate}
                                onChange={e => setNoticeDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={calculateTenancy}
                        className="bg-legal-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-legal-800 transition-colors"
                    >
                        Calculate Expiry
                    </button>

                    {noticeResult && (
                        <div className="mt-8 p-6 rounded-xl bg-blue-50 border border-blue-100">
                             <h4 className="text-lg font-bold text-blue-900 mb-2">Valid Expiry Date</h4>
                             <p className="text-3xl font-serif text-legal-900 mb-2">{noticeResult.expiryDate}</p>
                             <p className="text-sm text-blue-700 font-medium">{noticeResult.length} required by law.</p>
                             <p className="text-xs text-gray-500 mt-2 italic">Note: Ensure notice is served before the anniversary date for fixed terms where applicable.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'fees' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-xl font-bold text-legal-900 mb-6 flex items-center gap-2">
                        <Coins className="text-legal-gold" /> Scale of Charges Estimator
                    </h3>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6 text-sm text-yellow-800">
                        Based on the Legal Practitioners (Remuneration for Legal Documentation and Other Land Matters) Order 2023.
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Consideration / Property Value (₦)</label>
                        <input 
                            type="number" 
                            value={propertyValue}
                            onChange={e => setPropertyValue(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-legal-gold outline-none font-mono text-lg"
                            placeholder="e.g. 50000000"
                        />
                    </div>

                    <button 
                        onClick={calculateFees}
                        className="bg-legal-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-legal-800 transition-colors"
                    >
                        Calculate Fee
                    </button>

                    {feeResult !== null && (
                        <div className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-200 text-center">
                            <p className="text-sm text-gray-500 uppercase font-bold mb-2">Estimated Professional Fee (Scale 1)</p>
                            <p className="text-4xl font-bold text-legal-900 mb-2">₦{feeResult.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Approx. 10% of Consideration</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};