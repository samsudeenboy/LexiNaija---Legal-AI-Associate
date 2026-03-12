import React, { useState } from 'react';
import { Book, CheckSquare, ChevronRight, ListChecks, ArrowRightCircle, Building2, Home, Scale, User, ShieldCheck } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { AppView } from '../types';

interface Guide {
  id: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
}

const GUIDES: Guide[] = [
  // --- PROPERTY ---
  {
    id: 'nls-civil-w3',
    category: 'NLS Curriculum',
    title: 'Week 3: Overview of Civil Litigation',
    description: 'Foundational concepts and jurisdiction of courts in Nigeria.',
    steps: [
      'Identify the appropriate court based on subject matter jurisdiction.',
      'Check monetary jurisdiction (Magistrate vs. High Court).',
      'Verify geographical jurisdiction (where the cause of action arose or defendant resides).',
      'Determine the applicable Rules of Court (e.g., Lagos 2019, Abuja 2018).',
      'Consider ethical issues arising from choosing the wrong court.'
    ]
  },
  {
    id: 'nls-civil-w5',
    category: 'NLS Curriculum',
    title: 'Week 5: Pre-Action Considerations',
    description: 'Mandatory steps before filing a civil suit.',
    steps: [
      'Check for valid Cause of Action.',
      'Verify if the suit is Statute Barred (Statutory Limitation).',
      'Serve Pre-Action Notice where required (e.g., against Government agencies).',
      'Attempt Alternative Dispute Resolution (ADR) or Mediation.',
      'Prepare Pre-Action Counseling Certificate (Form 01 in Lagos).',
      'Confirm exhaustion of internal remedies.'
    ]
  },
  {
    id: 'nls-civil-w6',
    category: 'NLS Curriculum',
    title: 'Week 6: Commencement of Action',
    description: 'Filing originating processes in the High Court.',
    steps: [
      'Prepare the Writ of Summons (where facts are in dispute).',
      'Draft the Statement of Claim.',
      'Prepare Witness Statement on Oath.',
      'Compile list of witnesses and list of exhibits/documents.',
      'Attach Pre-Action Protocol Form 01 (Lagos).',
      'File processes at the Registry and pay prescribed fees.',
      'Ensure service by the Court Bailiff.'
    ]
  },
  {
    id: 'nls-civil-w10',
    category: 'NLS Curriculum',
    title: 'Week 10: Pre-Trial Proceedings',
    description: 'Case management and discovery phase.',
    steps: [
      'Apply for Case Management Conference (CMC).',
      'Prepare Case Management Information Sheet.',
      'Conduct Discovery and Inspection of Documents.',
      'Serve Interrogatories where necessary.',
      'Attend CMC for settlement of issues or possible ADR referral.',
      'Obtain Pre-Trial Report.'
    ]
  },
  {
    id: 'nls-crim-w8',
    category: 'NLS Curriculum',
    title: 'Week 8: Drafting Charges',
    description: 'Procedure for drafting valid criminal charges.',
    steps: [
      'Identify the Accused Person(s) by name and description.',
      'State the date and place of the offence.',
      'Describe the offence concisely (Statement of Offence).',
      'Cite the specific section of the law contravened (Particulars of Offence).',
      'Avoid Duplicity (joining two offences in one count).',
      'Avoid Misjoinder of offences or offenders.',
      'Ensure the charge is signed by an authorized person.'
    ]
  },
  {
    id: 'g1',
    category: 'Property',
    title: 'Perfection of Title (Lagos State)',
    description: 'Procedure for obtaining Governor\'s Consent and registering title at the Lands Registry.',
    steps: [
      'Application letter for Governor\'s Consent to the Director of Land Services.',
      'Submit Form 1C duly signed by parties.',
      'Submit 3 Certified True Copies (CTC) of Root of Title.',
      'Submit 4 copies of the Deed of Assignment (with survey plans attached).',
      'Pay Charting Fee and Endorsement Fee.',
      'Obtain Demand Notice for Consent Fee, Capital Gains Tax, Stamp Duties, and Registration Fee.',
      'Make payments to designated banks and obtain Treasury Receipts.',
      'Submit receipts for verification.',
      'Stamping of Deeds at the Stamp Duties Office.',
      'Registration of Deeds at the Lands Registry.',
      'Collection of Perfected Deed.'
    ]
  },
  
  // --- CORPORATE ---
  {
    id: 'g2',
    category: 'Corporate',
    title: 'Company Incorporation (Private Ltd)',
    description: 'Steps to register a private company limited by shares under CAMA 2020 via CRP.',
    steps: [
      'Create account on CAC Companies Registration Portal (CRP).',
      'Conduct Name Search/Reservation (Availability Check).',
      'Complete Pre-incorporation Form (Form CAC 1.1) online.',
      'Input details of Directors, Shareholders, and PSCs (Persons with Significant Control).',
      'Prepare Memorandum and Articles of Association (can use model articles).',
      'Pay Filing Fees and Stamp Duties online via Remita.',
      'Download pre-filled documents for signature.',
      'Upload scanned signature pages and IDs of Directors/Shareholders.',
      'Wait for approval and download E-Certificate and Certified True Copies.'
    ]
  },
  {
    id: 'g3',
    category: 'Corporate',
    title: 'Trademark Registration',
    description: 'Procedure for registering a trademark in Nigeria.',
    steps: [
      'Conduct availability search at the Trademarks, Patents and Designs Registry.',
      'File Application for Registration (Form 01) with the Registrar.',
      'Receive Acknowledgement Letter (Official Receipt).',
      'Receive Acceptance Letter (if trademark is distinctive and not deceptive).',
      'Publication in the Trademarks Journal for opposition (2 months window).',
      'If no opposition, apply for Trademark Certificate.',
      'Collection of Trademark Certificate.'
    ]
  },

  // --- LITIGATION ---
  {
    id: 'g4',
    category: 'Litigation',
    title: 'Recovery of Premises (Lagos)',
    description: 'Statutory procedure for evicting tenants under the Tenancy Law of Lagos State.',
    steps: [
      'Determine the nature of tenancy (Weekly, Monthly, Yearly, Fixed).',
      'Serve valid Notice to Quit (Form TL2 or TL3) - (7 days, 1 month, or 6 months).',
      'Wait for expiration of Notice to Quit.',
      'Serve 7 Days Notice of Owner\'s Intention to Recover Possession (Form TL4).',
      'File Writ of Summons and Particulars of Claim at Magistrate or High Court (depending on rental value).',
      'Serve Court Processes on the Defendant/Tenant.',
      'Trial / Hearing.',
      'Obtain Judgment and Order for Possession.',
      'Apply for Warrant of Possession if tenant refuses to vacate.'
    ]
  },
  {
    id: 'g5',
    category: 'Litigation',
    title: 'Fundamental Rights Enforcement',
    description: 'Procedure under the FREP Rules 2009.',
    steps: [
      'Prepare Motion on Notice.',
      'Prepare Statement setting out the name and description of applicant, relief sought, and grounds.',
      'Prepare Affidavit in Support of the application.',
      'Prepare Written Address in support of the application.',
      'File processes at the High Court (State or Federal depending on respondent).',
      'Serve Respondent(s) within 5 days of filing.',
      'Respond to Counter-Affidavits if filed.',
      'Hearing of the Application.'
    ]
  },
  {
    id: 'g6',
    category: 'Litigation',
    title: 'Bail Application (High Court)',
    description: 'Procedure for applying for bail pending trial.',
    steps: [
      'File Motion on Notice for Bail.',
      'Support with Affidavit stating facts (e.g., medical condition, credible sureties).',
      'Attach exhibits (e.g., Medical Report, Charge Sheet).',
      'File Written Address citing relevant authorities (e.g., ACJA 2015).',
      'Serve the Prosecution/Complainant.',
      'Move the application in Court.',
      'If granted, perfect bail conditions (Sureties to verify address, etc.).'
    ]
  },

  // --- FAMILY & PROBATE ---
  {
    id: 'g7',
    category: 'Family',
    title: 'Dissolution of Marriage (Divorce)',
    description: 'Petition for Decree Nisi/Absolute under Matrimonial Causes Act.',
    steps: [
      'Verify jurisdiction and domicile.',
      'Draft Petition stating facts and grounds (Two years separation, adultery, etc.).',
      'Complete Verifying Affidavit and Certificate of Reconciliation.',
      'File Petition at the High Court.',
      'Serve Petition on the Respondent.',
      'Wait for Answer (if any). If undefended, set down for hearing.',
      'Trial/Hearing (Petitioner gives evidence).',
      'Judge grants Decree Nisi.',
      'Wait 3 months for Decree Absolute.'
    ]
  },
  {
    id: 'g8',
    category: 'Family',
    title: 'Probate Application (Grant of Probate)',
    description: 'Procedure for obtaining Grant of Probate (Testate).',
    steps: [
      'Search for the Will at the Probate Registry.',
      'Reading of the Will to the beneficiaries.',
      'Executors apply for Grant of Probate (Form 1, 2, 3, etc.).',
      'Pay Estate Duty/Fees based on estate value.',
      'Publication of Notice in Newspaper and Gazette.',
      'Wait for 21 days (to allow for Caveats).',
      'If no objection, Probate Registry issues Grant of Probate.'
    ]
  },

  // --- GENERAL ---
  {
    id: 'g9',
    category: 'General',
    title: 'Change of Name (Deed Poll)',
    description: 'Legal procedure for changing a name in Nigeria.',
    steps: [
      'Depose to an Affidavit of Change of Name at the High Court Registry.',
      'Draft a Deed Poll reflecting the old and new names.',
      'Publish the change of name in a National Newspaper.',
      'Publish in the Official Gazette (optional but recommended for official use).',
      'Update records with banks, NIMC, and other institutions.'
    ]
  },
  {
    id: 'g10',
    category: 'Entertainment',
    title: 'Copyright Registration (NCC)',
    description: 'Procedure for registering creative works with the Nigerian Copyright Commission under the 2023 Act.',
    steps: [
      'Confirm eligibility (Literary, Musical, Artistic, Audiovisual, etc.).',
      'Ensure "Fixation" in a definite medium.',
      'Access NCC e-Registration portal.',
      'Upload the work and complete prescribed forms.',
      'Pay registration fees via Remita.',
      'Download the Certificate of Registration upon approval.'
    ]
  },
  {
    id: 'g11',
    category: 'Entertainment',
    title: 'Royalty & PRO Registration',
    description: 'Procedure for music royalty collection in Nigeria.',
    steps: [
      'Signed Split Sheet among all contributors.',
      'Join a Collective Management Organization (MCSN or COSON).',
      'Register the work metadata with the CMO.',
      'Register with digital aggregators for DSP distribution.',
      'Confirm ISRC and UPC codes are correctly embedded.'
    ]
  }
];

export const PracticeGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(GUIDES.map(g => g.category)))];

  const filteredGuides = selectedCategory === 'All' 
    ? GUIDES 
    : GUIDES.filter(g => g.category === selectedCategory);

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-legal-900">Practice Guides</h2>
          <p className="text-gray-600 mt-2">Step-by-step procedural guides for Nigerian law practice.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
          <h3 className="font-semibold text-gray-700 mb-4 px-2">Categories</h3>
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-legal-50 text-legal-900 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredGuides.map(guide => (
              <div 
                key={guide.id}
                className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                  activeGuide === guide.id ? 'border-legal-gold ring-1 ring-legal-gold' : 'border-gray-200'
                }`}
              >
                <div 
                  onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                  className="p-5 cursor-pointer flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      guide.category === 'Property' ? 'bg-orange-100 text-orange-600' :
                      guide.category === 'Corporate' ? 'bg-blue-100 text-blue-600' :
                      guide.category === 'Litigation' ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {guide.category === 'Property' && <Home className="w-5 h-5" />}
                      {guide.category === 'Corporate' && <Building2 className="w-5 h-5" />}
                      {guide.category === 'Litigation' && <Scale className="w-5 h-5" />}
                      {guide.category === 'Family' && <User className="w-5 h-5" />}
                      {guide.category === 'General' && <CheckSquare className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-legal-900 text-lg">{guide.title}</h3>
                      <p className="text-sm text-gray-500">{guide.description}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeGuide === guide.id ? 'rotate-90' : ''}`} />
                </div>

                {activeGuide === guide.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100 bg-gray-50/50">
                    <div className="mt-4 space-y-3">
                      {guide.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 rounded hover:bg-white transition-colors">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-legal-100 text-legal-700 flex items-center justify-center text-xs font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
