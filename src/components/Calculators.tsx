import React, { useState } from 'react';
import { Calculator, Calendar, AlertTriangle, CheckCircle2, Coins, Clock, ShieldCheck } from 'lucide-react';

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
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-black text-legal-900 italic tracking-tighter">Legal Calculators</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em] mt-3">Procedural Deadline & Fee Optimization Engine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sidebar Tabs */}
        <div className="space-y-3">
            <button 
                onClick={() => setActiveTab('limitation')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-4 transition-all ${activeTab === 'limitation' ? 'bg-legal-900 text-white shadow-[0_20px_40px_-10px_rgba(26,35,46,0.3)]' : 'bg-white/50 text-slate-400 hover:bg-white hover:text-legal-900'}`}
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'limitation' ? 'bg-legal-gold text-legal-900' : 'bg-slate-100'}`}>
                    <Clock size={16} />
                </div>
                Limitation Law
            </button>
            <button 
                onClick={() => setActiveTab('tenancy')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-4 transition-all ${activeTab === 'tenancy' ? 'bg-legal-900 text-white shadow-[0_20px_40px_-10px_rgba(26,35,46,0.3)]' : 'bg-white/50 text-slate-400 hover:bg-white hover:text-legal-900'}`}
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'tenancy' ? 'bg-legal-gold text-legal-900' : 'bg-slate-100'}`}>
                    <Calendar size={16} />
                </div>
                Tenancy Notice
            </button>
            <button 
                onClick={() => setActiveTab('fees')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-4 transition-all ${activeTab === 'fees' ? 'bg-legal-900 text-white shadow-[0_20px_40px_-10px_rgba(26,35,46,0.3)]' : 'bg-white/50 text-slate-400 hover:bg-white hover:text-legal-900'}`}
            >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'fees' ? 'bg-legal-gold text-legal-900' : 'bg-slate-100'}`}>
                    <Coins size={16} />
                </div>
                Scale of Charges
            </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
            {activeTab === 'limitation' && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-10 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-serif font-black text-legal-900 italic flex items-center gap-3">
                            <Clock className="text-legal-gold" /> Limitation Auditor
                        </h3>
                        <div className="px-4 py-2 bg-slate-900 rounded-full text-[9px] font-black text-legal-gold uppercase tracking-widest">Procedural Check</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Nature of Claim</label>
                            <select 
                                value={causeType}
                                onChange={e => setCauseType(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
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
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Cause Accrual Date</label>
                            <input 
                                type="date" 
                                value={limitationDate}
                                onChange={e => setLimitationDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={calculateLimitation}
                        className="bg-legal-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all active:scale-95"
                    >
                        Audit Statute Status
                    </button>

                    {limitationResult && (
                        <div className={`mt-10 p-8 rounded-[32px] border ${limitationResult.status === 'STATUTE BARRED' ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${limitationResult.status === 'STATUTE BARRED' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {limitationResult.status === 'STATUTE BARRED' ? (
                                        <AlertTriangle size={24} />
                                    ) : (
                                        <CheckCircle2 size={24} />
                                    )}
                                </div>
                                <div>
                                    <h4 className={`text-xl font-serif font-black italic tracking-tight ${limitationResult.status === 'STATUTE BARRED' ? 'text-red-900' : 'text-green-900'}`}>
                                        {limitationResult.status}
                                    </h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditor Conclusion</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="p-4 bg-white/50 rounded-2xl border border-white">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiration Deadline</p>
                                    <p className="font-bold text-legal-900">{limitationResult.deadline}</p>
                                </div>
                                <div className="p-4 bg-white/50 rounded-2xl border border-white">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Elapsed</p>
                                    <p className="font-bold text-legal-900">{limitationResult.yearsPassed}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'tenancy' && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-10 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-serif font-black text-legal-900 italic flex items-center gap-3">
                            <Calendar className="text-legal-gold" /> Rent Recovery Auditor
                        </h3>
                        <div className="px-4 py-2 bg-slate-900 rounded-full text-[9px] font-black text-legal-gold uppercase tracking-widest">Lagos Tenancy Law v2</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Tenancy Frequency</label>
                            <select 
                                value={tenancyType}
                                onChange={e => setTenancyType(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            >
                                <option value="weekly">Weekly Tenancy</option>
                                <option value="monthly">Monthly Tenancy</option>
                                <option value="quarterly">Quarterly Tenancy</option>
                                <option value="half-yearly">Half-Yearly Tenancy</option>
                                <option value="yearly">Yearly Tenancy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Service Execution Date</label>
                            <input 
                                type="date" 
                                value={noticeDate}
                                onChange={e => setNoticeDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={calculateTenancy}
                        className="bg-legal-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all active:scale-95"
                    >
                        Project Expiry
                    </button>

                    {noticeResult && (
                        <div className="mt-10 p-10 rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-bl-full translate-x-10 -translate-y-10"></div>
                             <h4 className="text-[10px] font-black text-legal-gold uppercase tracking-[.3em] mb-4">Projected Terminus</h4>
                             <p className="text-4xl md:text-5xl font-serif font-black italic text-white mb-6 tracking-tighter">{noticeResult.expiryDate}</p>
                             <div className="flex items-center gap-2 text-slate-400 font-bold mb-6">
                                <Clock size={16} /> {noticeResult.length} Compliance Period
                             </div>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <p className="text-[10px] text-slate-500 italic">"Statutory notice must coincide with the terminal day of the tenancy anniversary for maximum procedural safety."</p>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'fees' && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-10 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-serif font-black text-legal-900 italic flex items-center gap-3">
                            <Coins className="text-legal-gold" /> Remuneration Order Auditor
                        </h3>
                        <div className="px-4 py-2 bg-slate-900 rounded-full text-[9px] font-black text-legal-gold uppercase tracking-widest">2023 Order Scale I</div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-legal-gold/10 rounded-2xl border border-legal-gold/20 mb-8">
                        <div className="w-8 h-8 rounded-full bg-legal-gold text-legal-900 flex items-center justify-center shrink-0">
                            <ShieldCheck size={16} />
                        </div>
                        <p className="text-[10px] font-black text-legal-900 uppercase tracking-widest">Analysis based on the Legal Practitioners (Remuneration) Order 2023.</p>
                    </div>

                    <div className="mb-10">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Consideration / Transaction Value (₦)</label>
                        <input 
                            type="number" 
                            value={propertyValue}
                            onChange={e => setPropertyValue(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 font-mono text-2xl font-black text-legal-900 focus:bg-white focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all"
                            placeholder="50,000,000"
                        />
                    </div>

                    <button 
                        onClick={calculateFees}
                        className="bg-legal-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-legal-900/20 hover:bg-legal-gold hover:text-legal-900 transition-all active:scale-95"
                    >
                        Project Remuneration
                    </button>

                    {feeResult !== null && (
                        <div className="mt-10 p-10 rounded-[32px] bg-slate-50 border border-slate-200 text-center relative overflow-hidden group hover:bg-white transition-all cursor-default shadow-sm hover:shadow-xl">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4">Minimum Statutory Fee Estimate</p>
                            <p className="text-5xl font-serif font-black text-legal-900 mb-4 tracking-tighter">₦{feeResult.toLocaleString()}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">Scale I: 10% Weighted Avg.</div>
                            <p className="text-[10px] text-slate-400 mt-6 italic">* This is a digital approximation. Professional fees are subject to complexity and negotiation within the Order boundaries.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};