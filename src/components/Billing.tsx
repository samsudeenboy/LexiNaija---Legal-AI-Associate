import React, { useState } from 'react';
import { CreditCard, FileText, Send, Sparkles, Download } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateFeeNoteDescription } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { Invoice } from '../types';
import { useToast } from '../contexts/ToastContext';

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
      addInvoice({
        id: Date.now().toString(),
        clientId: newInvoice.clientId,
        caseId: newInvoice.caseId,
        amount: parseFloat(newInvoice.amount),
        description: newInvoice.finalDescription,
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
    doc.text("Thank you for your instructions.", 20, totalY + 45);
    
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900">Billing & Fees</h2>
          <p className="text-gray-500 text-sm mt-1">Generate professional Fee Notes compliant with the Legal Practitioners Remuneration Order.</p>
        </div>
        <button 
           onClick={() => setDrafting(true)}
           className="bg-legal-900 text-white px-4 py-2 rounded-lg hover:bg-legal-800 flex items-center gap-2 text-sm font-medium"
        >
          <FileText size={16} /> Draft Fee Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-700">Recent Invoices</h3>
          {invoices.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300 text-gray-400">
              No invoices generated yet.
            </div>
          ) : (
            invoices.map(inv => (
              <div key={inv.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-legal-gold transition-colors">
                <div className="flex-1">
                   <p className="text-xs text-gray-400 font-mono mb-1">REF: INV-{inv.id.slice(-4)}</p>
                   <h4 className="font-bold text-legal-900">{clients.find(c => c.id === inv.clientId)?.name}</h4>
                   <p className="text-sm text-gray-500 mt-1 max-w-md truncate">{inv.description}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-lg font-bold text-legal-900">₦{inv.amount.toLocaleString()}</p>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{inv.status}</span>
                    </div>
                    <button 
                        onClick={() => generatePDF(inv)}
                        className="p-2 text-legal-gold hover:bg-yellow-50 rounded-full transition-colors" 
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
          <div className="bg-legal-gold bg-opacity-10 p-6 rounded-xl border border-legal-gold border-opacity-20">
            <h3 className="font-bold text-legal-900 mb-2 flex items-center gap-2"><CreditCard size={18}/> Scale of Charges</h3>
            <p className="text-sm text-gray-700 mb-4">Quick reference for property transactions:</p>
            <ul className="text-xs space-y-2 text-gray-600">
              <li className="flex justify-between"><span>Conveyance (State Land)</span> <span>10%</span></li>
              <li className="flex justify-between"><span>Conveyance (Private)</span> <span>10-15%</span></li>
              <li className="flex justify-between"><span>Tenancy (Solicitor)</span> <span>10%</span></li>
              <li className="flex justify-between"><span>Mortgages</span> <span>Varies</span></li>
            </ul>
          </div>
        </div>
      </div>

      {drafting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-legal-900">Draft Professional Fee Note</h3>
                <button onClick={() => setDrafting(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select className="w-full border p-2 rounded" onChange={e => setNewInvoice({...newInvoice, clientId: e.target.value})}>
                  <option value="">-- Select --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Matter (Optional)</label>
                <select className="w-full border p-2 rounded" onChange={e => setNewInvoice({...newInvoice, caseId: e.target.value})}>
                  <option value="">-- Select --</option>
                  {cases.filter(c => !newInvoice.clientId || c.clientId === newInvoice.clientId).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Fees (₦)</label>
              <input type="number" className="w-full border p-2 rounded text-lg font-mono" placeholder="0.00" onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-gray-700">Service Description</label>
                 <button 
                    onClick={handleAiRefine}
                    disabled={!newInvoice.rawDescription || loadingAi}
                    className="text-xs text-legal-gold flex items-center gap-1 hover:text-yellow-600 disabled:opacity-50"
                 >
                   <Sparkles size={12}/> {loadingAi ? 'Refining...' : 'Refine with AI'}
                 </button>
              </div>
              <textarea 
                className="w-full border p-2 rounded h-24 text-sm" 
                placeholder="e.g. I went to court for the tenancy matter and filed papers."
                value={newInvoice.rawDescription}
                onChange={e => setNewInvoice({...newInvoice, rawDescription: e.target.value, finalDescription: e.target.value})}
              />
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Final Invoice Narrative</label>
              <textarea 
                className="w-full bg-transparent border-none p-0 text-sm font-serif text-legal-900 focus:ring-0 resize-none" 
                rows={4}
                value={newInvoice.finalDescription}
                onChange={e => setNewInvoice({...newInvoice, finalDescription: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setDrafting(false)} className="px-6 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-legal-900 text-white py-2 rounded hover:bg-legal-800 flex items-center justify-center gap-2">
                <Send size={16} /> Generate Fee Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};