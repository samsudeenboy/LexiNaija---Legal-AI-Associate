import React, { useState } from 'react';
import { CreditCard, FileText, Send, Sparkles, Download, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateFeeNoteDescription } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { Invoice } from '../types';
import { useToast } from '../contexts/ToastContext';
import { calculateLPROFee, formatCurrency, getLPROReference, type TransactionType } from '../services/lproCalculator';

export const Billing: React.FC = () => {
  const { showToast } = useToast();
  const { clients, cases, invoices, addInvoice, firmProfile, consumeCredits } = useLegalStore();
  const [drafting, setDrafting] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    caseId: '',
    amount: '',
    rawDescription: '',
    finalDescription: ''
  });

  const [showLproCalc, setShowLproCalc] = useState(false);
  const [lproInput, setLproInput] = useState({
    propertyValue: '',
    transactionType: 'Sale' as TransactionType,
    isCommercial: false
  });
  const [lproResult, setLproResult] = useState<ReturnType<typeof calculateLPROFee> | null>(null);

  const calculateLpro = () => {
      const value = parseFloat(lproInput.propertyValue);
      if (!value) {
        showToast("Enter property value", "error");
        return;
      }
      
      const result = calculateLPROFee({
        transactionType: lproInput.transactionType,
        propertyValue: value,
        isCommercial: lproInput.isCommercial
      });
      setLproResult(result);
  };

  const applyLpro = () => {
      if (lproResult) {
          setNewInvoice(prev => ({ ...prev, amount: lproResult.professionalFee.toString() }));
          setShowLproCalc(false);
          showToast("LPRO Statutory Fee applied.", "success");
      }
  };

  const handleAiRefine = async () => {
    if (!newInvoice.rawDescription) return;
    if (!consumeCredits(1)) {
      showToast("Insufficient Intelligence Credits.", "error");
      return;
    }
    setLoadingAi(true);
    try {
      const refined = await generateFeeNoteDescription(newInvoice.rawDescription);
      setNewInvoice(prev => ({ ...prev, finalDescription: refined }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = () => {
    if (newInvoice.clientId && newInvoice.amount && newInvoice.finalDescription) {
      const baseAmount = parseFloat(newInvoice.amount);
      const vatAmount = baseAmount * 0.075; // 7.5% VAT (FIRS)
      const totalAmount = baseAmount + vatAmount;
      addInvoice({
        id: Date.now().toString(),
        clientId: newInvoice.clientId,
        caseId: newInvoice.caseId,
        amount: totalAmount,
        description: newInvoice.finalDescription + `\n\n[Professional Fees: ₦${baseAmount.toLocaleString()} | VAT @ 7.5%: ₦${vatAmount.toLocaleString()} | Total: ₦${totalAmount.toLocaleString()}]`,
        status: 'Draft',
        date: new Date()
      });
      setDrafting(false);
      setNewInvoice({ clientId: '', caseId: '', amount: '', rawDescription: '', finalDescription: '' });
    }
  };

  const generatePDF = (inv: Invoice) => {
    const doc = new jsPDF();
    const client = clients.find(c => c.id === inv.clientId);
    const caseItem = cases.find(c => c.id === inv.caseId);
    
    // Header (Use Firm Profile)
    doc.setFontSize(22);
    doc.setFont("times", "bold");
    doc.text("FEE NOTE", 150, 20);
    
    doc.setFontSize(16);
    doc.text(firmProfile.name, 20, 20);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("Barristers, Solicitors & Notaries Public", 20, 26);
    
    // Split address if too long
    const addressLines = doc.splitTextToSize(firmProfile.address, 100);
    doc.text(addressLines, 20, 31);
    
    let yOffset = 31 + (addressLines.length * 5);
    doc.text(`${firmProfile.email} | ${firmProfile.phone}`, 20, yOffset);
    
    // Line
    yOffset += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yOffset, 190, yOffset);
    
    // To Client
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("TO:", 20, yOffset);
    doc.setFont("times", "normal");
    doc.text(client?.name || "Client", 20, yOffset + 7);
    if (client?.address) {
        doc.text(doc.splitTextToSize(client.address, 80), 20, yOffset + 14);
    }
    
    // Invoice Details
    doc.setFont("times", "bold");
    doc.text("INVOICE DETAILS:", 130, yOffset);
    doc.setFont("times", "normal");
    doc.text(`Invoice No: INV-${inv.id.slice(-4)}`, 130, yOffset + 7);
    doc.text(`Date: ${new Date(inv.date).toLocaleDateString()}`, 130, yOffset + 14);
    
    yOffset += 40;
    if (caseItem) {
        doc.text(`Re: ${caseItem.title}`, 20, yOffset);
        yOffset += 10;
    }

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yOffset, 170, 10, "F");
    doc.setFont("times", "bold");
    doc.text("DESCRIPTION", 25, yOffset + 6);
    doc.text("AMOUNT (NGN)", 150, yOffset + 6);
    
    // Content
    yOffset += 20;
    doc.setFont("times", "normal");
    const descLines = doc.splitTextToSize(inv.description, 110);
    doc.text(descLines, 25, yOffset);
    doc.text(inv.amount.toLocaleString(), 150, yOffset);
    
    // Total
    const totalY = yOffset + (descLines.length * 7) + 10;
    doc.line(20, totalY, 190, totalY);
    doc.setFont("times", "bold");
    doc.text("TOTAL DUE:", 110, totalY + 10);
    doc.setFontSize(14);
    doc.text(`NGN ${inv.amount.toLocaleString()}`, 150, totalY + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("times", "italic");
    doc.text("Payment terms: Due upon receipt.", 20, totalY + 40);
    doc.text("Note: This fee note includes VAT @ 7.5% as required by FIRS.", 20, totalY + 45);
    doc.text("Thank you for your instructions.", 20, totalY + 50);
    
    if (firmProfile.solicitorName) {
        doc.setFont("times", "normal");
        doc.text("Signed:", 130, totalY + 40);
        doc.setFont("times", "bold");
        doc.text(firmProfile.solicitorName, 130, totalY + 50);
        doc.setFont("times", "normal");
        doc.text("PP: " + firmProfile.name, 130, totalY + 55);
    }
    
    doc.save(`Invoice_${inv.id}.pdf`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Financial Management
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Billing & Fees</h2>
          <p className="text-slate-400 font-medium">Generate professional Fee Notes perfectly compliant with existing LPRO standards.</p>
        </div>
        <button 
           onClick={() => setDrafting(true)}
           className="bg-legal-900 text-white px-8 py-4 rounded-2xl hover:bg-legal-gold hover:text-legal-900 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-legal-900/20 transition-all shrink-0 group"
        >
          <FileText size={16} className="group-hover:-translate-y-1 transition-transform" /> Draft Fee Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-2">Recent Invoices</h3>
          {invoices.length === 0 ? (
            <div className="bg-slate-50 py-24 text-center rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                   <FileText className="w-6 h-6 text-slate-300" />
               </div>
               <p className="text-lg font-serif italic text-slate-400">No invoices generated yet.</p>
            </div>
          ) : (
            invoices.map(inv => (
              <div key={inv.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-lg hover:border-legal-gold/50 transition-all group">
                <div className="flex-1 pr-6">
                   <p className="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-2">REF: INV-{inv.id.slice(-4)}</p>
                   <h4 className="font-serif font-black text-xl italic text-legal-900 tracking-tight">{clients.find(c => c.id === inv.clientId)?.name}</h4>
                   <p className="text-sm font-medium text-slate-500 mt-2 line-clamp-2 leading-relaxed">{inv.description}</p>
                </div>
                <div className="flex items-center gap-6 border-l border-slate-100 pl-6 h-full">
                    <div className="text-right">
                        <p className="text-2xl font-black text-legal-900 tracking-tight">₦{inv.amount.toLocaleString()}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full mt-1 inline-block">{inv.status}</span>
                    </div>
                    <button 
                        onClick={() => generatePDF(inv)}
                        className="p-3 text-slate-400 hover:text-legal-900 hover:bg-slate-50 rounded-xl transition-colors shrink-0 object-contain" 
                        title="Download PDF"
                    >
                        <Download size={20} />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="bg-legal-900 p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-legal-gold opacity-10 rounded-full translate-x-16 -translate-y-16 blur-2xl"></div>
            <h3 className="font-serif font-black italic text-2xl text-legal-gold mb-4 flex items-center gap-3"><CreditCard size={24}/> Scale of Charges</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Reference: LPRO (Non-Contentious)</p>
            <ul className="text-sm space-y-4 font-medium text-slate-300">
              <li className="flex justify-between items-center border-b border-legal-800 pb-3"><span>Conveyance (State Land)</span> <span className="text-legal-gold font-bold">10%</span></li>
              <li className="flex justify-between items-center border-b border-legal-800 pb-3"><span>Conveyance (Private)</span> <span className="text-legal-gold font-bold">10-15%</span></li>
              <li className="flex justify-between items-center border-b border-legal-800 pb-3"><span>Tenancy (Solicitor)</span> <span className="text-legal-gold font-bold">10%</span></li>
              <li className="flex justify-between items-center border-b border-legal-800 pb-3"><span>Mortgages</span> <span className="text-legal-gold font-bold">Varies</span></li>
              <li className="flex justify-between items-center pt-1"><span>VAT (All Fees)</span> <span className="text-amber-400 font-bold">+ 7.5%</span></li>
            </ul>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">Contentious matters: Fees determined by counsel. All professional fees attract 7.5% VAT per FIRS regulations.</p>
          </div>
        </div>
      </div>

      {drafting && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-slate-50">
                <h3 className="text-2xl font-serif font-black italic tracking-tight text-legal-900 flex items-center gap-3">
                  <FileText className="text-legal-gold" size={24} /> Generate Fee Note
                </h3>
                <button onClick={() => setDrafting(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full hover:bg-slate-100"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Client Destination</label>
                  <select 
                     className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm cursor-pointer" 
                     onChange={e => setNewInvoice({...newInvoice, clientId: e.target.value})}
                  >
                    <option value="">-- Designate Client --</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Related Matter (Optional)</label>
                  <select 
                     className="w-full border border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-sm cursor-pointer" 
                     onChange={e => setNewInvoice({...newInvoice, caseId: e.target.value})}
                  >
                    <option value="">-- Select Matter --</option>
                    {cases.filter(c => !newInvoice.clientId || c.clientId === newInvoice.clientId).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Professional Fees Minimum (₦)</label>
                <div className="relative">
                    <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-2xl font-mono text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all" 
                    placeholder="0.00" 
                    value={newInvoice.amount}
                    onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} 
                    />
                    <button 
                        onClick={() => setShowLproCalc(true)}
                        className="absolute right-2 top-2 bottom-2 px-4 bg-legal-900 text-legal-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 transition-all flex items-center gap-2"
                    >
                        <Sparkles size={14} /> LPRO Scale
                    </button>
                </div>
              </div>

              {showLproCalc && (
                  <div className="bg-slate-900 p-6 rounded-3xl border border-legal-800 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-legal-gold font-serif font-black italic text-lg tracking-tight flex items-center gap-2">
                          <CheckCircle size={18} /> LPRO 2023 Statutory Calculator
                        </h4>
                        <button onClick={() => setShowLproCalc(false)} className="text-white/40 hover:text-white"><X size={18}/></button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="col-span-2">
                              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Transaction Type</label>
                              <select
                                value={lproInput.transactionType}
                                onChange={(e) => setLproInput({...lproInput, transactionType: e.target.value as TransactionType})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none cursor-pointer"
                              >
                                  <option value="Sale" className="text-legal-900">Sale of Property</option>
                                  <option value="Lease" className="text-legal-900">Lease Agreement</option>
                                  <option value="Mortgage" className="text-legal-900">Deed of Mortgage</option>
                                  <option value="Assignment" className="text-legal-900">Deed of Assignment</option>
                              </select>
                          </div>
                          <div className="col-span-2">
                              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Property/Transaction Value (₦)</label>
                              <input
                                type="number"
                                value={lproInput.propertyValue}
                                onChange={e => setLproInput({...lproInput, propertyValue: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-legal-gold outline-none"
                                placeholder="e.g. 100000000"
                              />
                          </div>
                          {(lproInput.transactionType === 'Lease') && (
                            <div className="col-span-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={lproInput.isCommercial}
                                      onChange={(e) => setLproInput({...lproInput, isCommercial: e.target.checked})}
                                      className="w-5 h-5 accent-legal-gold"
                                    />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commercial Property (10% vs 7.5% for Residential)</span>
                                </label>
                            </div>
                          )}
                      </div>
                      <button
                        onClick={calculateLpro}
                        className="w-full bg-legal-gold text-legal-900 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 hover:bg-legal-gold/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={16} /> Calculate Statutory Fee
                      </button>
                      {lproResult && (
                          <div className="space-y-3">
                              {lproResult.warning && (
                                <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 flex items-start gap-2">
                                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                  <p className="text-[9px] font-black text-amber-200">{lproResult.warning}</p>
                                </div>
                              )}
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fee Breakdown (LPRO 2023)</h5>
                                  {lproResult.breakdown.map((item, idx) => (
                                    <p key={idx} className="text-xs text-slate-300">{item}</p>
                                  ))}
                                  <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-400">Professional Fee:</span>
                                      <span className="text-white font-bold">{formatCurrency(lproResult.professionalFee)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-400">VAT @ 7.5%:</span>
                                      <span className="text-white font-bold">{formatCurrency(lproResult.vat)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-400">Stamp Duty (est.):</span>
                                      <span className="text-white font-bold">{formatCurrency(lproResult.stampDuty)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black">
                                      <span className="text-legal-gold">TOTAL:</span>
                                      <span className="text-white">{formatCurrency(lproResult.total)}</span>
                                    </div>
                                  </div>
                              </div>
                              <button
                                onClick={applyLpro}
                                className="w-full bg-emerald-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={16} /> Apply Statutory Fee to Invoice
                              </button>
                          </div>
                      )}
                  </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-3">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Raw Service Narrative</label>
                   <button 
                      onClick={handleAiRefine}
                      disabled={!newInvoice.rawDescription || loadingAi}
                      className="text-[10px] font-black uppercase tracking-widest text-legal-gold bg-legal-gold/10 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-legal-gold/20 disabled:opacity-50 transition-colors"
                   >
                     <Sparkles size={14}/> {loadingAi ? 'Refining...' : 'Actionable AI Refinement'}
                   </button>
                </div>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl h-24 text-sm font-medium text-legal-900 focus:ring-4 focus:ring-legal-gold/10 focus:border-legal-gold outline-none transition-all shadow-inner resize-none placeholder:font-normal placeholder:text-slate-300" 
                  placeholder="e.g. I went to court for the tenancy matter and filed papers."
                  value={newInvoice.rawDescription}
                  onChange={e => setNewInvoice({...newInvoice, rawDescription: e.target.value, finalDescription: e.target.value})}
                />
              </div>

              <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 shadow-inner">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2">Final Invoice Statement (Legal Pro AI)</label>
                <textarea 
                  className="w-full bg-transparent border-none p-0 text-sm font-serif font-medium text-legal-900 focus:ring-0 resize-none leading-relaxed" 
                  rows={4}
                  value={newInvoice.finalDescription}
                  onChange={e => setNewInvoice({...newInvoice, finalDescription: e.target.value})}
                  placeholder="AI generated formal narrative will appear here..."
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button onClick={() => setDrafting(false)} className="flex-1 py-4 text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Terminate Directive</button>
                <button onClick={handleSave} className="flex-[2] bg-legal-900 text-legal-gold py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-legal-gold hover:text-legal-900 transition-all shadow-xl shadow-legal-900/10 flex items-center justify-center gap-3 group px-4">
                  Commit to Financial Register <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};