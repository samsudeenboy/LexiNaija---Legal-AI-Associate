import React, { useState } from 'react';
import { Calculator, Landmark, Home, FileText, Info, HelpCircle } from 'lucide-react';

export const FeeCalculator: React.FC = () => {
    const [transactionType, setTransactionType] = useState<'mortgage' | 'sale' | 'lease'>('sale');
    const [amount, setValue] = useState<number>(0);
    const [role, setRole] = useState<'mortgagor' | 'mortgagee' | 'vendor' | 'purchaser' | 'lessor' | 'lessee'>('vendor');
    const [result, setResult] = useState<{ total: number; breakdown: string[] } | null>(null);

    const calculateFees = () => {
        let total = 0;
        const breakdown: string[] = [];

        if (transactionType === 'sale' || transactionType === 'mortgage') {
            const isPurchaserOrMortgagee = role === 'purchaser' || role === 'mortgagee';
            const rates = isPurchaserOrMortgagee 
                ? { first: 22.50, second: 22.60, third: 7.70, remainder: 5.00 }
                : { first: 11.25, second: 11.25, third: 3.75, remainder: 2.50 };

            let remaining = amount;
            
            // First 1000
            const first1000 = Math.min(remaining, 1000);
            const fee1 = (first1000 / 100) * rates.first;
            total += fee1;
            if (first1000 > 0) breakdown.push(`First ₦1,000 (per ₦100 @ ₦${rates.first}): ₦${fee1.toLocaleString()}`);
            remaining -= first1000;

            // Second and Third 1000 (N1001 to N3000)
            const next2000 = Math.min(remaining, 2000);
            const fee2 = (next2000 / 100) * rates.second;
            total += fee2;
            if (next2000 > 0) breakdown.push(`Next ₦2,000 (per ₦100 @ ₦${rates.second}): ₦${fee2.toLocaleString()}`);
            remaining -= next2000;

            // Fourth to Twentieth 1000 (N3001 to N20000)
            const next17000 = Math.min(remaining, 17000);
            const fee3 = (next17000 / 100) * rates.third;
            total += fee3;
            if (next17000 > 0) breakdown.push(`Next ₦17,000 (per ₦100 @ ₦${rates.third}): ₦${fee3.toLocaleString()}`);
            remaining -= next17000;

            // Remainder (Above N20000)
            if (remaining > 0) {
                const fee4 = (remaining / 100) * rates.remainder;
                total += fee4;
                breakdown.push(`Remainder above ₦20,000 (per ₦100 @ ₦${rates.remainder}): ₦${fee4.toLocaleString()}`);
            }
        } else if (transactionType === 'lease') {
            // Scale II logic
            // Where rent exceeds N1,000: 
            // N37.50 for first N100
            // N25 for next N100 up to N1,000
            // N12.50 for each subsequent N100
            
            let remaining = amount;
            const isLessor = role === 'lessor';
            
            if (remaining > 1000) {
                total += 37.50; // First 100
                breakdown.push(`First ₦100 of rent: ₦37.50`);
                
                total += (900/100) * 25; // Next 900
                breakdown.push(`Next ₦900 of rent: ₦225.00`);
                
                const over1000 = remaining - 1000;
                const fee3 = (over1000/100) * 12.50;
                total += fee3;
                breakdown.push(`Rent above ₦1,000: ₦${fee3.toLocaleString()}`);
            } else {
                // Simplified for small rents
                total = (remaining / 100) * 37.50;
                breakdown.push(`Base rent calculation: ₦${total.toLocaleString()}`);
            }

            if (!isLessor) {
                const lesseeFee = total / 2;
                breakdown.push(`Lessee's solicitor is entitled to half: ₦${total.toLocaleString()} / 2 = ₦${lesseeFee.toLocaleString()}`);
                total = lesseeFee;
            }
        }

        setResult({ total, breakdown });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-legal-gold rounded-xl flex items-center justify-center shadow-lg shadow-legal-gold/20">
                        <Calculator className="text-legal-900 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-legal-900">Remuneration Calculator</h2>
                        <p className="text-sm text-slate-500">Legal Practitioners Remuneration Order (Scales I & II)</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 border-r border-slate-200 bg-white p-8 overflow-y-auto">
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Transaction Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'sale', label: 'Sale', icon: Home },
                                    { id: 'mortgage', label: 'Mortgage', icon: Landmark },
                                    { id: 'lease', label: 'Lease', icon: FileText }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => {
                                            setTransactionType(type.id as any);
                                            setRole(type.id === 'lease' ? 'lessor' : type.id === 'sale' ? 'vendor' : 'mortgagor');
                                        }}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${transactionType === type.id ? 'border-legal-gold bg-legal-gold/5 text-legal-900' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <type.icon className="w-5 h-5" />
                                        <span className="text-xs font-bold">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Acting For</label>
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-legal-gold focus:outline-none text-sm font-medium"
                            >
                                {transactionType === 'sale' && (
                                    <>
                                        <option value="vendor">Vendor</option>
                                        <option value="purchaser">Purchaser</option>
                                    </>
                                )}
                                {transactionType === 'mortgage' && (
                                    <>
                                        <option value="mortgagor">Mortgagor</option>
                                        <option value="mortgagee">Mortgagee</option>
                                    </>
                                )}
                                {transactionType === 'lease' && (
                                    <>
                                        <option value="lessor">Lessor</option>
                                        <option value="lessee">Lessee</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                {transactionType === 'lease' ? 'Annual Rent (₦)' : 'Transaction Value (₦)'}
                            </label>
                            <input 
                                type="number"
                                value={amount || ''}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-legal-gold focus:outline-none text-lg font-serif"
                                placeholder="0.00"
                            />
                        </div>

                        <button
                            onClick={calculateFees}
                            className="w-full py-4 bg-legal-900 text-white rounded-xl font-bold hover:bg-legal-800 transition-all shadow-xl shadow-legal-900/20"
                        >
                            Calculate Professional Fees
                        </button>

                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                            <Info className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-[10px] text-amber-800 leading-relaxed italic">
                                These calculations are based on the <strong>Legal Practitioners Remuneration Order</strong>. Note that some states may have variations, and "One Solicitor" rules apply when acting for both parties.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-12 bg-slate-50 flex flex-col items-center justify-center">
                    {result ? (
                        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="bg-legal-900 p-8 text-center">
                                <span className="text-[10px] font-black text-legal-gold uppercase tracking-[0.3em]">Estimated Total Fee</span>
                                <div className="text-4xl font-serif font-bold text-white mt-2">
                                    ₦{result.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Calculation Breakdown</h4>
                                <ul className="space-y-3">
                                    {result.breakdown.map((item, i) => (
                                        <li key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                                            <span className="text-slate-500">{item.split(':')[0]}</span>
                                            <span className="font-bold text-legal-900">{item.split(':')[1]}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <button className="w-full py-3 border-2 border-legal-900 text-legal-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-legal-900 hover:text-white transition-all">
                                        Generate Invoice Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-20">
                            <Calculator className="w-32 h-32 text-legal-900 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif font-bold text-legal-900 uppercase tracking-widest">Fee Ledger</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
