import React, { useState } from 'react';
import { BookOpen, FileText, ChevronRight, Copy, Search, Scale, Briefcase, Building2, Shield, Feather, Gavel, FileSignature, X, Music, Film, Heart, ScrollText } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { AppView, SavedDocument } from '../types';

interface PrecedentsProps {
  onNavigate: (view: AppView) => void;
}

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  jurisdiction?: string;
  court?: string;
}

const TEMPLATES: Template[] = [
  // --- CIVIL LITIGATION (NLS Standard) ---
  {
    id: 'lit-01',
    category: 'Civil Litigation',
    title: 'Writ of Summons (Lagos State)',
    description: 'Standard originating process for civil actions in Lagos High Court.',
    jurisdiction: 'Lagos',
    court: 'High Court',
    content: `**IN THE HIGH COURT OF LAGOS STATE**
**IN THE [JUDICIAL DIVISION] JUDICIAL DIVISION**
**HOLDEN AT [LOCATION]**

**SUIT NO: ........................**

**BETWEEN**
[CLAIMANT NAME] ............................................................ **CLAIMANT**
**AND**
[DEFENDANT NAME] ............................................................ **DEFENDANT**

**To [DEFENDANT NAME]** of [DEFENDANT ADDRESS]

You are hereby commanded that within forty-two (42) days after the service of this writ on you, inclusive of the day of such service, you do cause an appearance to be entered for you in an action at the suit of **[CLAIMANT NAME]** and take notice that in default of your so doing, the claimant may proceed therein and judgment may be given in your absence.

DATED THIS ...... DAY OF ...... 20....

__________________________
**REGISTRAR**`
  },
  {
    id: 'lit-02',
    category: 'Civil Litigation',
    title: 'Statement of Claim',
    description: 'Claimant\'s pleading setting out facts and reliefs.',
    content: `**IN THE HIGH COURT OF [STATE]**
**IN THE [JUDICIAL DIVISION] JUDICIAL DIVISION**
**HOLDEN AT [LOCATION]**

**SUIT NO: ........................**

**BETWEEN**
[CLAIMANT NAME] ............................................................ **CLAIMANT**
**AND**
[DEFENDANT NAME] ............................................................ **DEFENDANT**

**STATEMENT OF CLAIM**

1. The Claimant is a [Description] resident at [Address].
2. The Defendant is a [Description] resident at [Address].
3. On or about [Date], [State Material Facts].
4. [Details of Breach/Wrong].
5. [Particulars of Loss/Damage].

**WHEREOF the Claimant claims as follows:**
a) A Declaration that [Relief].
b) The sum of ₦[Amount] being [Description].
c) Interest at the rate of [Rate]% until judgment.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[LAWYER NAME]**
Counsel to the Claimant`
  },
  {
    id: 'lit-03',
    category: 'Civil Litigation',
    title: 'Witness Statement on Oath',
    description: 'Mandatory witness deposition for civil suits.',
    content: `**IN THE HIGH COURT OF [STATE]**
**IN THE [JUDICIAL DIVISION] JUDICIAL DIVISION**
**HOLDEN AT [LOCATION]**

**SUIT NO: ........................**

**BETWEEN**
[CLAIMANT NAME] ............................................................ **CLAIMANT**
**AND**
[DEFENDANT NAME] ............................................................ **DEFENDANT**

**WITNESS STATEMENT ON OATH OF [WITNESS NAME]**

I, [WITNESS NAME], [Male/Female], [Christian/Muslim], [Occupation] of [Address], do hereby make Oath and state as follows:

1. That I am the [Claimant/Witness] in this suit.
2. That I am conversant with the facts of this case.
3. [Paragraphs detailing testimony...]
10. That I make this statement in good faith, believing same to be true and correct in accordance with the Oaths Act.

__________________________
**DEPONENT**

**SWORN TO** at the High Court Registry, [Location]
This ...... day of ...... 20....

**BEFORE ME**

__________________________
**COMMISSIONER FOR OATHS**`
  },
  {
    id: 'lit-04',
    category: 'Civil Litigation',
    title: 'Originating Summons',
    description: 'Procedure used where the principal question is construction of a statute or document.',
    content: `**IN THE HIGH COURT OF [STATE]**
**IN THE [JUDICIAL DIVISION] JUDICIAL DIVISION**
**HOLDEN AT [LOCATION]**

**SUIT NO: ........................**

**IN THE MATTER OF [STATUTE/DOCUMENT]**
**BETWEEN**
[APPLICANT NAME] ............................................................ **APPLICANT**
**AND**
[RESPONDENT NAME] ............................................................ **RESPONDENT**

**ORIGINATING SUMMONS**

Let [RESPONDENT NAME] of [ADDRESS] within [DAYS] days after the service of this summons on [him/her/it] inclusive of the day of such service, cause an appearance to be entered for [him/her/it] to this summons.

**QUESTIONS FOR DETERMINATION:**
1. Whether on a proper construction of Section [X] of the [ACT]...
2. Whether the Applicant is entitled to...

**RELIEFS SOUGHT:**
1. A Declaration that...
2. An Order of...

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**REGISTRAR**`
  },

  // --- CRIMINAL LITIGATION ---
  {
    id: 'crim-01',
    category: 'Criminal',
    title: 'Charge Sheet (Magistrate Court)',
    description: 'Standard charge format for summary trials.',
    jurisdiction: 'Generic',
    content: `**IN THE MAGISTRATE COURT OF [STATE]**
**IN THE [MAGISTERIAL DISTRICT] MAGISTERIAL DISTRICT**
**HOLDEN AT [LOCATION]**

**CHARGE NO: ........................**

**BETWEEN**
**COMMISSIONER OF POLICE** ............................................ **COMPLAINANT**
**AND**
[DEFENDANT NAME] ............................................................ **DEFENDANT**

**CHARGE**

That you, [DEFENDANT NAME], on or about the ...... day of ...... 20.... at [LOCATION] in the [Magisterial District] did [OFFENCE DESCRIPTION e.g., steal one laptop belonging to XYZ] and thereby committed an offence punishable under Section [X] of the Criminal Code Law of [STATE].

__________________________
**POLICE OFFICER/PROSECUTOR**`
  },
  {
    id: 'crim-02',
    category: 'Criminal',
    title: 'Application for Bail (Motion on Notice)',
    description: 'Formal application for bail at the High Court after refusal by Police/Magistrate.',
    content: `**IN THE HIGH COURT OF [STATE]**
**HOLDEN AT [LOCATION]**

**SUIT/CHARGE NO: ........................**

**BETWEEN**
[DEFENDANT NAME] ............................................................ **APPLICANT**
**AND**
**THE STATE** ............................................................ **RESPONDENT**

**MOTION ON NOTICE FOR BAIL**
**BROUGHT PURSUANT TO SECTION [X] OF ACJL AND THE INHERENT JURISDICTION OF THE COURT**

**TAKE NOTICE** that this Honourable Court will be moved on the ...... day of ...... 20.... for:
1. **AN ORDER** admitting the Applicant to bail pending the hearing and determination of the charge against him.
2. **AND FOR SUCH FURTHER ORDER(S)** as this Court may deem fit.

**GROUNDS:**
1. The Applicant is presumed innocent until proven guilty.
2. The Applicant has reliable sureties.

__________________________
**[LAWYER NAME]**
Counsel to the Applicant`
  },

  // --- PROPERTY LAW PRACTICE ---
  {
    id: 'prop-01',
    category: 'Property',
    title: 'Deed of Assignment',
    description: 'Transfer of unexpired residue of a leasehold interest (NLS Standard).',
    content: `**THIS DEED OF ASSIGNMENT** is made the ...... day of ...... 20....
**BETWEEN**
[ASSIGNOR NAME] of [ADDRESS] (The "Assignor")
**AND**
[ASSIGNEE NAME] of [ADDRESS] (The "Assignee")

**WHEREAS:**
1. The Assignor is the legal owner of the property at [LOCATION] by virtue of a Certificate of Occupancy No. [X].
2. The Assignor has agreed to assign his interest to the Assignee for ₦[AMOUNT].

**NOW THIS DEED WITNESSES AS FOLLOWS:**
In consideration of the sum of ₦[AMOUNT] now PAID by the Assignee to the Assignor (the Receipt of which the Assignor hereby acknowledges), the Assignor as BENEFICIAL OWNER ASSIGNS ALL THAT parcel of Land with [DESCRIPTION] situate at [LOCATION] to HOLD unto the Assignee for the unexpired residue of the term of the Certificate of Occupancy.

**IN WITNESS OF WHICH** the parties have executed this Deed in the manner below.

__________________________
**ASSIGNOR**

__________________________
**ASSIGNEE**`
  },
  {
    id: 'prop-02',
    category: 'Property',
    title: 'Contract of Sale of Land',
    description: 'Preliminary agreement before the execution of a Deed.',
    content: `**THIS AGREEMENT** is made the ...... day of ...... 20....
**BETWEEN**
[VENDOR NAME] of [ADDRESS] (The "Vendor")
**AND**
[PURCHASER NAME] of [ADDRESS] (The "Purchaser")

**IT IS AGREED AS FOLLOWS:**
1. The Vendor sells and the Purchaser buys ALL THAT property at [LOCATION].
2. The price is ₦[AMOUNT].
3. The Purchaser shall pay a deposit of ₦[DEPOSIT] upon signing.
4. Completion shall be on or before [DATE].
5. Possession shall be delivered upon full payment.

**SIGNED by the Parties:**

__________________________
**VENDOR**

__________________________
**PURCHASER**`
  },
  {
    id: 'prop-03',
    category: 'Property',
    title: 'Power of Attorney (Donation)',
    description: 'Delegation of authority to manage or sell property.',
    content: `**BY THIS POWER OF ATTORNEY** given this ...... day of ...... 20....
I, [DONOR NAME] of [ADDRESS] (The "Donor")
**APPOINT**
[DONEE NAME] of [ADDRESS] (The "Donee")
To be my true and lawful attorney and in my name to do all or any of the following:
1. To manage my property situate at [LOCATION].
2. To collect rents and give receipts.
3. To execute all documents for the sale of the said property.

**AND I DECLARE** that this Power of Attorney shall be IRREVOCABLE for [X] months.

__________________________
**DONOR SIGNATURE**

**IN THE PRESENCE OF:**
Name: ....................
Signature: ...............`
  },
  {
    id: 'prop-04',
    category: 'Property',
    title: 'Simple Will',
    description: 'Last Will and Testament (NLS Template).',
    content: `**THIS IS THE LAST WILL AND TESTAMENT** of me, [TESTATOR NAME] of [ADDRESS].

1. **REVOCATION:** I revoke all former Wills made by me.
2. **EXECUTORS:** I appoint [NAME 1] and [NAME 2] to be the executors of this my Will.
3. **SPECIFIC GIFTS:** I give my [ITEM/HOUSE] at [LOCATION] to my [RELATION/NAME].
4. **RESIDUARY:** I give the residue of my estate to [NAME].

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**TESTATOR SIGNATURE**

**SIGNED** by the Testator in our joint presence:
**WITNESS 1:** ....................
**WITNESS 2:** ....................`
  },

  // --- CORPORATE LAW ---
  {
    id: 'corp-01',
    category: 'Corporate',
    title: 'Board Resolution (General)',
    description: 'Board approval for corporate actions (CAMA 2020).',
    content: `**BOARD RESOLUTION OF [COMPANY NAME] LTD**
**PASSED ON THE ...... DAY OF ...... 20....**

**RESOLVED:**
1. THAT the Company opens a bank account with [BANK NAME].
2. THAT [NAME 1] and [NAME 2] be the signatories to the account.
3. THAT the Company Seal be affixed to all necessary documents.

__________________________
**DIRECTOR**

__________________________
**SECRETARY**`
  },
  {
    id: 'corp-02',
    category: 'Corporate',
    title: 'Objects Clause (Generic Holding)',
    description: 'Standard objects for a holding company under CAMA 2020.',
    content: `**THE OBJECTS FOR WHICH THE COMPANY IS ESTABLISHED ARE:**
1. To carry on business as an investment holding company.
2. To acquire and hold shares, stocks, debentures, and securities.
3. To provide management and consultancy services.
4. To carry on business as general merchants and traders.
5. To do all such other things as are incidental or conducive to the attainment of the above objects.`
  },

  // --- ENTERTAINMENT LAW ---
  {
    id: 'ent-01',
    category: 'Entertainment',
    title: 'Music Split Sheet',
    description: 'Agreement defining ownership percentages under Copyright Act 2023.',
    content: `# MUSIC SPLIT SHEET
**SONG TITLE:** [TITLE]
**DATE OF CREATION:** [DATE]

**OWNERSHIP BREAKDOWN:**
1. **[ARTIST NAME]** (Lyrics/Vocals): [PERCENTAGE]%
2. **[PRODUCER NAME]** (Composition/Beat): [PERCENTAGE]%

**PUBLISHING / PRO DETAILS:**
- Artist PRO: [COSON/MCSN]
- Producer PRO: [COSON/MCSN]

This split sheet is a binding agreement under the **Nigerian Copyright Act 2023**.

__________________________
**ARTIST**

__________________________
**PRODUCER**`
  },
  {
    id: 'ent-02',
    category: 'Entertainment',
    title: 'Artist Management Agreement',
    description: 'Agreement for career representation in the Nigerian industry.',
    content: `**ARTIST MANAGEMENT AGREEMENT**

**PARTIES:**
1. **[MANAGER NAME]** ("Manager")
2. **[ARTIST NAME]** ("Artist")

**1. TERM:** [NUMBER] years from [DATE].
**2. COMMISSION:** Manager shall receive [PERCENTAGE]% of Artist's gross earnings.
**3. AUTHORITY:** Manager is authorized to negotiate contracts and bookings on behalf of the Artist.
**4. GOVERNING LAW:** Laws of the Federal Republic of Nigeria.

__________________________
**MANAGER**

__________________________
**ARTIST**`
  },
  {
    id: 'ent-03',
    category: 'Entertainment',
    title: 'Film Production Location Release',
    description: 'Agreement to use a property for film production.',
    content: `**LOCATION RELEASE AGREEMENT**

I, [OWNER NAME], hereby grant [PRODUCER NAME] the right to enter and use the property at [ADDRESS] for the purpose of filming the production titled "[FILM TITLE]".

**TERMS:**
1. **DATES:** From [START DATE] to [END DATE].
2. **FEE:** ₦[AMOUNT].
3. **RIGHTS:** Producer owns all footage captured.

__________________________
**OWNER**

__________________________
**PRODUCER**`
  },

  // --- PROFESSIONAL ETHICS & SKILLS ---
  {
    id: 'eth-01',
    category: 'Ethics',
    title: 'Bill of Charges (Scale I)',
    description: 'Formal bill for property/mortgage matters.',
    content: `# [LAW FIRM NAME]
**BILL OF CHARGES**

**TO:** [CLIENT NAME]
**DATE:** [DATE]

**RE: [MATTER DESCRIPTION]**

1. **Professional Fees for [Service]** (As per Scale I of the Remuneration Order): ₦[AMOUNT]
2. **Disbursements:**
   - Filing Fees: ₦[AMOUNT]
   - Transport/Logistics: ₦[AMOUNT]
   - Search Fees: ₦[AMOUNT]

**TOTAL DUE:** ₦[TOTAL]

__________________________
**[LAWYER NAME]**
Managing Partner`
  },
  {
    id: 'eth-02',
    category: 'Ethics',
    title: 'Legal Opinion (Formal)',
    description: 'Structured opinion for a client.',
    content: `**LEGAL OPINION**

**TO:** [CLIENT NAME]
**FROM:** [LAWYER NAME]
**DATE:** [DATE]
**RE: [SUBJECT MATTER]**

**1. BRIEF FACTS:**
[Summary of facts...]

**2. ISSUE(S) FOR DETERMINATION:**
[Whether or not...]

**3. LEGAL ANALYSIS:**
[Reference to Statutes e.g. CAMA 2020, Evidence Act 2011...]
[Reference to Case Law...]

**4. CONCLUSION & RECOMMENDATION:**
[Your professional advice...]

__________________________
**[LAWYER NAME]**`
  }
];

export const Precedents: React.FC<PrecedentsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);
  const { saveDocumentToCase, cases, setActiveDoc } = useLegalStore();
  const [showUseModal, setShowUseModal] = useState(false);
  const [useCaseId, setUseCaseId] = useState('');
  const [useTitle, setUseTitle] = useState('');

  const categories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = () => {
    if (viewingTemplate) {
      navigator.clipboard.writeText(viewingTemplate.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTemplate = () => {
    if (!viewingTemplate) return;
    setUseTitle(`${viewingTemplate.title} - Draft`);
    setShowUseModal(true);
  };

  const confirmUseTemplate = () => {
    if (!viewingTemplate || !useCaseId || !useTitle) return;
    const newDocId = Date.now().toString();
    saveDocumentToCase(useCaseId, {
      id: newDocId,
      title: useTitle,
      content: viewingTemplate.content,
      type: 'Draft',
      createdAt: new Date()
    } as Omit<SavedDocument, 'status'>);
    setActiveDoc({ caseId: useCaseId, docId: newDocId });
    setShowUseModal(false);
    onNavigate(AppView.EDITOR);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-legal-gold uppercase tracking-[0.3em] mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-legal-gold animate-pulse"></div>
              Nigerian Precedents
          </div>
          <h2 className="text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Legal Repository</h2>
          <p className="text-slate-400 font-medium font-serif">A comprehensive library of NLS-standard drafts and industrial templates.</p>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${
                selectedCategory === cat 
                  ? 'bg-legal-900 text-white shadow-xl shadow-legal-900/20' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-legal-900'
              }`}
            >
              <div className="flex items-center justify-between">
                {cat}
                {cat === 'Entertainment' && <Music size={12} className={selectedCategory === cat ? 'text-legal-gold' : ''} />}
                {cat === 'Civil Litigation' && <Gavel size={12} />}
                {cat === 'Property' && <Building2 size={12} />}
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="mb-6 relative shrink-0">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, statute or procedure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-legal-gold/5 outline-none transition-all font-bold text-legal-900 shadow-sm"
            />
          </div>

          {!viewingTemplate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-8 custom-scrollbar">
              {filteredTemplates.map(template => (
                <button 
                  key={template.id}
                  onClick={() => setViewingTemplate(template)}
                  className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 hover:border-legal-gold/50 text-left transition-all hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase font-black text-legal-gold tracking-[0.2em]">{template.category}</span>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-legal-gold group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-serif font-black text-legal-900 mb-2 leading-tight group-hover:italic">{template.title}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{template.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 flex-1 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewingTemplate(null)}
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-legal-900 transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <h3 className="text-2xl font-serif font-black text-legal-900 tracking-tight italic">{viewingTemplate.title}</h3>
                    <p className="text-[10px] font-black text-legal-gold uppercase tracking-widest">{viewingTemplate.category} Precedent</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-legal-900 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {copied ? <Shield className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Captured' : 'Yank'}
                  </button>
                  <button 
                    onClick={handleUseTemplate}
                    className="flex items-center gap-3 px-8 py-3 bg-legal-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 transition-all shadow-lg shadow-legal-900/20"
                  >
                    <FileSignature size={16} />
                    Deploy to Editor
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
                <div className="max-w-3xl mx-auto bg-white p-16 shadow-lg rounded-[24px] min-h-full border border-slate-50 relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ScrollText size={120} className="text-legal-900" />
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 leading-[2.2] selection:bg-legal-gold/20 relative z-10">
                    {viewingTemplate.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUseModal && viewingTemplate && (
        <div className="fixed inset-0 bg-legal-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-10 bg-slate-50 border-b border-slate-100">
              <h3 className="text-3xl font-serif font-black text-legal-900 tracking-tighter italic">Initialize Draft</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">Link this precedent to an active case file.</p>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Matter Association</label>
                <select 
                  className="w-full p-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-legal-gold/10 transition-all cursor-pointer" 
                  value={useCaseId} 
                  onChange={e => setUseCaseId(e.target.value)}
                >
                  <option value="">Select Target Matter...</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Document Nomenclature</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-legal-gold/10 transition-all" 
                  value={useTitle} 
                  onChange={e => setUseTitle(e.target.value)} 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowUseModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-legal-900 transition-colors">Abort</button>
                <button 
                  onClick={confirmUseTemplate} 
                  disabled={!useCaseId || !useTitle} 
                  className="flex-[2] py-4 bg-legal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-legal-gold hover:text-legal-900 transition-all shadow-xl disabled:opacity-30"
                >
                  Create & Launch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
