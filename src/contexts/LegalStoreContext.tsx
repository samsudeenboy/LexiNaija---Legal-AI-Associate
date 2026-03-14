import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Case, Invoice, SavedDocument, DocumentVersion, BillableItem, Task, FirmProfile, EvidenceItem, LegalAnalytics, AuditLogEntry, Suggestion, AppView, KnowledgeItem } from '../types';
import { supabase } from '../services/supabaseClient';

interface LegalStoreContextType {
  firmProfile: FirmProfile;
  clients: Client[];
  cases: Case[];
  invoices: Invoice[];
  tasks: Task[];
  activeDoc: { caseId: string; docId: string } | null;
  setActiveDoc: (doc: { caseId: string; docId: string } | null) => void;
  creditsTotal: number;
  creditsUsed: number;
  consumeCredits: (units: number) => boolean;
  addCredits: (units: number) => void;
  updateFirmProfile: (profile: FirmProfile) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addCase: (newCase: Case) => void;
  updateCase: (id: string, data: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  saveDocumentToCase: (caseId: string, doc: Omit<SavedDocument, 'status'>) => void;
  updateCaseDocument: (caseId: string, docId: string, updates: Partial<SavedDocument>) => void;
  addBillableItem: (caseId: string, item: BillableItem) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addEvidence: (caseId: string, item: EvidenceItem) => void;
  deleteEvidence: (caseId: string, evidenceId: string) => void;
  getAnalytics: () => LegalAnalytics;
  auditLog: AuditLogEntry[];
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  suggestions: Suggestion[];
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  dismissSuggestion: (id: string) => void;
  activeSuggestion: Suggestion | null;
  setActiveSuggestion: (s: Suggestion | null) => void;
  knowledgeItems: KnowledgeItem[];
  addKnowledgeItem: (item: KnowledgeItem) => void;
  deleteKnowledgeItem: (id: string) => void;
  currentView: AppView;
  setView: (view: AppView) => void;
  loadMoreCases: () => Promise<void>;
  hasMoreCases: boolean;
  isLoadingMore: boolean;
}

const LegalStoreContext = createContext<LegalStoreContextType | undefined>(undefined);
const STORE_VERSION = '1';

// Default Data
const DEFAULT_FIRM_PROFILE: FirmProfile = {
  name: 'LexiNaija Chambers',
  address: '12 Victoria Island, Lagos',
  email: 'info@lexinaija.com',
  phone: '0800-LEXI-NAIJA',
  solicitorName: 'A. I. Lawyer, Esq.'
};

const DEFAULT_CLIENTS: Client[] = [
  { id: '1', name: 'Musa Properties Ltd', type: 'Corporate', email: 'info@musaproperties.ng', phone: '08031234567', address: '45, Adetokunbo Ademola, VI, Lagos', dateAdded: new Date() },
  { id: '2', name: 'Chief Emeka Okonkwo', type: 'Individual', email: 'emeka.okonkwo@email.com', phone: '09098765432', address: '12, Wuse 2, Abuja', dateAdded: new Date() }
];

const DEFAULT_CASES: Case[] = [
  { 
    id: '101', 
    clientId: '1', 
    title: 'Tenancy Recovery - 15 Awolowo Way', 
    suitNumber: 'MC/L/123/2024', 
    court: 'Magistrate Court, Yaba', 
    status: 'Pending Court', 
    nextHearing: '2024-05-20', 
    notes: 'Tenant has not paid for 2 years. Statutory notices served.',
    opposingParty: 'Mr. Johnson Chukwuma',
    documents: [],
    billableItems: [
      { id: 'b1', description: 'Consultation Fee', amount: 50000, date: new Date('2024-01-15'), type: 'Professional Fee' },
      { id: 'b2', description: 'Filing of Writ of Summons', amount: 25000, date: new Date('2024-02-01'), type: 'Expense' }
    ],
    evidence: [
      {
        id: 'ev1',
        description: 'Tenancy Agreement dated 2020',
        type: 'Document',
        dateObtained: new Date('2020-01-01'),
        isReliedUpon: true,
        custodyLocation: 'Original with Client'
      },
      {
        id: 'ev2',
        description: 'Notice to Quit (Duplicate Copy)',
        type: 'Document',
        dateObtained: new Date('2023-11-01'),
        isReliedUpon: true,
        custodyLocation: 'Case File'
      }
    ],
    outcome: 'Pending'
  }
];

const DEFAULT_INVOICES: Invoice[] = [
  { id: '1001', clientId: '1', caseId: '101', amount: 75000, description: 'Professional fees for consultation and filing of recovery action.', status: 'Draft', date: new Date() }
];

const DEFAULT_TASKS: Task[] = [
    { id: 't1', title: 'File Motion Ex-Parte', dueDate: new Date('2024-05-18'), priority: 'High', status: 'Pending', caseId: '101' },
    { id: 't2', title: 'Call Client for Updates', dueDate: new Date('2024-05-19'), priority: 'Low', status: 'Pending', caseId: '101' }
];

const DEFAULT_AUDIT_LOG: AuditLogEntry[] = [
  { id: 'al1', timestamp: new Date(), eventType: 'DOCUMENT_CREATED', documentId: '101', caseId: '101', userId: 'system', details: 'Initial case document created' }
];

const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const LegalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firmProfile, setFirmProfile] = useState<FirmProfile>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_firmProfile');
      return saved ? JSON.parse(saved) : DEFAULT_FIRM_PROFILE;
    } catch (e) { return DEFAULT_FIRM_PROFILE; }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_clients');
      return saved ? JSON.parse(saved, dateReviver) : DEFAULT_CLIENTS;
    } catch (e) { return DEFAULT_CLIENTS; }
  });

  const [cases, setCases] = useState<Case[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_cases');
      return saved ? JSON.parse(saved, dateReviver) : DEFAULT_CASES;
    } catch (e) { return DEFAULT_CASES; }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_invoices');
      return saved ? JSON.parse(saved, dateReviver) : DEFAULT_INVOICES;
    } catch (e) { return DEFAULT_INVOICES; }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_tasks');
      return saved ? JSON.parse(saved, dateReviver) : DEFAULT_TASKS;
    } catch (e) { return DEFAULT_TASKS; }
  });

  const [activeDoc, setActiveDoc] = useState<{ caseId: string; docId: string } | null>(null);

  const [creditsTotal, setCreditsTotal] = useState<number>(1000);
  const [creditsUsed, setCreditsUsed] = useState<number>(0);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_auditLog');
      return saved ? JSON.parse(saved, dateReviver) : DEFAULT_AUDIT_LOG;
    } catch (e) { return DEFAULT_AUDIT_LOG; }
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);
  const [currentView, setView] = useState<AppView>(AppView.LANDING);

  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_knowledgeItems');
      return saved ? JSON.parse(saved, dateReviver) : [];
    } catch (e) { return []; }
  });

  const [hasMoreCases, setHasMoreCases] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [casesPage, setCasesPage] = useState(0);
  const PAGE_SIZE = 20;

  const pushToCloud = async (table: string, action: 'insert'|'update'|'delete', data: any, id?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      if (action !== 'delete') {
        data.user_id = session.user.id;
        // Inject firm_id for institutional collaboration if Enterprise mode is active
        if (firmProfile.isEnterprise && firmProfile.firmId) {
          data.firm_id = firmProfile.firmId;
        }
      }

      if (action === 'insert') await supabase.from(table).insert([data]);
      else if (action === 'update') {
        if (table === 'profiles') await supabase.from(table).update(data).eq('id', session.user.id);
        else await supabase.from(table).update(data).match({ id });
      }
      else if (action === 'delete') await supabase.from(table).delete().match({ id });
    } catch (err) {
      console.warn(`Cloud sync failed for ${table}, using fallback mode.`);
    }
  };

  useEffect(() => {
    if (activeCaseId) {
        runAgenticAudit(activeCaseId);
    } else {
        setSuggestions([]);
    }
  }, [activeCaseId, cases]);

  const runAgenticAudit = (caseId: string) => {
    const activeCase = cases.find(c => c.id === caseId);
    if (!activeCase) return;

    const newSuggestions: Suggestion[] = [];
    
    const titleLower = activeCase.title.toLowerCase();
    const evidenceDesc = (activeCase.evidence || []).map(e => e.description.toLowerCase());

    if (titleLower.includes('tenancy') || titleLower.includes('possession')) {
        const hasNotice = evidenceDesc.some(d => d.includes('notice to quit') || d.includes('7 days notice'));
        if (!hasNotice) {
            newSuggestions.push({
                id: 'suggest_notice_quit',
                type: 'missing_evidence',
                title: 'Missing Statutory Notice',
                description: 'This is a tenancy recovery matter, but no "Notice to Quit" has been logged in the evidence locker.',
                actionLabel: 'Draft Notice',
                targetView: AppView.DRAFTER,
                targetState: { 
                    type: 'Notice to Quit', 
                    jurisdiction: activeCase.court?.includes('Lagos') ? 'Lagos State' : 'Federal Territory',
                    prefillCaseId: activeCase.id 
                },
                priority: 'High',
                timestamp: new Date()
            });
        }
    }

    if (activeCase.nextHearing) {
        const hearingDate = new Date(activeCase.nextHearing);
        const diffDays = Math.ceil((hearingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 7) {
            newSuggestions.push({
                id: 'suggest_hearing_prep',
                type: 'deadline',
                title: 'Upcoming Hearing',
                description: `Matter is set for hearing in ${diffDays} days. Shall I draft the Trial Brief and Witness Statements?`,
                actionLabel: 'Prepare Brief',
                targetView: AppView.BRIEFS,
                targetState: {
                    prefillCaseId: activeCase.id,
                    initialIssue: 'Whether the Claimant has proved its case on the balance of probabilities and is entitled to the reliefs sought.'
                },
                priority: 'High',
                timestamp: new Date()
            });
        }
    }

    if (activeCase.documents.length > 0 && !activeCase.documents.some(d => d.title.includes('Argument'))) {
        newSuggestions.push({
            id: 'suggest_brief_draft',
            type: 'action',
            title: 'Draft Advocacy Address',
            description: 'You have case facts and research stored. Shall I synthesize them into a Written Address?',
            actionLabel: 'Draft Now',
            targetView: AppView.BRIEFS,
            priority: 'Medium',
            timestamp: new Date()
        });
    }

    if (activeCase.status === 'Open' && (!activeCase.billableItems || activeCase.billableItems.length === 0)) {
        newSuggestions.push({
            id: 'suggest_billing_setup',
            type: 'insight',
            title: 'Unbilled Professional Matter',
            description: 'This matter is active but no professional fees have been logged. Configure your fee note structure.',
            actionLabel: 'Setup Billing',
            targetView: AppView.BILLING,
            priority: 'Medium',
            timestamp: new Date()
        });
    }

    const createdAt = new Date(activeCase.id === '101' ? '2024-01-01' : parseInt(activeCase.id));
    const ageHours = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) {
        newSuggestions.push({
            id: 'suggest_conflict_check',
            type: 'action',
            title: 'Conflict of Interest Sweep',
            description: 'New matter file detected. Perform a conflict check against current adverse parties database.',
            actionLabel: 'Run Check',
            targetView: AppView.CONFLICT_CHECK,
            priority: 'High',
            timestamp: new Date()
        });
    }

    setSuggestions(newSuggestions);
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const loadMoreCases = async () => {
    if (isLoadingMore || !hasMoreCases) return;
    setIsLoadingMore(true);
    const nextPage = casesPage + 1;
    
    try {
        const from = nextPage * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data } = await supabase.from('cases').select('*').range(from, to).order('created_at', { ascending: false });
        
        if (data) {
            const newCases = data.map((c: any) => ({
                id: c.id, clientId: c.client_id, title: c.title, suitNumber: c.suit_number, court: c.court, status: c.status,
                nextHearing: c.next_hearing, notes: c.notes, opposingParty: c.opposing_party, outcome: c.outcome,
                documents: [], billableItems: [], evidence: []
            }));
            setCases(prev => [...prev, ...newCases]);
            setHasMoreCases(data.length === PAGE_SIZE);
            setCasesPage(nextPage);
        }
    } catch (e) {
        console.error('Failed to load more cases', e);
    } finally {
        setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const v = localStorage.getItem('lexinaija_store_version');
    if (!v) localStorage.setItem('lexinaija_store_version', STORE_VERSION);

    const initCloudData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const [clientsRes, casesRes, docsRes, billRes, evRes, taskRes] = await Promise.all([
          supabase.from('clients').select('*').limit(100).order('date_added', { ascending: false }),
          supabase.from('cases').select('*').range(0, PAGE_SIZE - 1).order('created_at', { ascending: false }),
          supabase.from('documents').select('*, document_versions(*)').limit(100).order('updated_at', { ascending: false }),
          supabase.from('billable_items').select('*').limit(200).order('date', { ascending: false }),
          supabase.from('evidence').select('*').limit(200).order('created_at', { ascending: false }),
          supabase.from('tasks').select('*').limit(100).order('due_date', { ascending: false })
        ]);

        if (clientsRes.data?.length) {
          setClients(clientsRes.data.map((c: any) => ({
            id: c.id, name: c.name, type: c.type, email: c.email, phone: c.phone, address: c.address, dateAdded: new Date(c.date_added)
          })));
        }

        if (casesRes.data?.length) {
          setHasMoreCases(casesRes.data.length === PAGE_SIZE);
          setCases(casesRes.data.map((c: any) => {
            const caseDocs = (docsRes.data || []).filter((d: any) => d.case_id === c.id).map((d: any) => ({
              id: d.id, title: d.title, content: d.content, type: d.type, status: d.status, timestamp: new Date(d.updated_at), createdAt: new Date(d.created_at),
              versions: (d.document_versions || []).map((v: any) => ({ id: v.id, timestamp: new Date(v.timestamp), content: v.content, title: v.title }))
            }));
            const caseBills = (billRes.data || []).filter((b: any) => b.case_id === c.id).map((b: any) => ({
              id: b.id, description: b.description, amount: b.amount, type: b.type, date: new Date(b.date)
            }));
            const caseEvs = (evRes.data || []).filter((e: any) => e.case_id === c.id).map((e: any) => ({
              id: e.id, description: e.description, type: e.type, dateObtained: new Date(e.date_obtained), isReliedUpon: e.is_relied_upon, custodyLocation: e.custody_location
            }));
            return {
              id: c.id, clientId: c.client_id, title: c.title, suitNumber: c.suit_number, court: c.court, status: c.status,
              nextHearing: c.next_hearing, notes: c.notes, opposingParty: c.opposing_party, outcome: c.outcome,
              documents: caseDocs, billableItems: caseBills, evidence: caseEvs
            };
          }));
        }
        
        if (taskRes.data?.length) {
          setTasks(taskRes.data.map((t: any) => ({
            id: t.id, title: t.title, dueDate: t.due_date ? new Date(t.due_date) : undefined, priority: t.priority, status: t.status, caseId: t.case_id
          })));
        }

        // Initialize Profile and Credits from Cloud
        const { data: profile } = await supabase.from('profiles').select('*').single();
        if (profile) {
          setFirmProfile({
            name: profile.firm_name || DEFAULT_FIRM_PROFILE.name,
            address: profile.address || DEFAULT_FIRM_PROFILE.address,
            email: profile.email || session.user.email || '',
            phone: profile.phone || DEFAULT_FIRM_PROFILE.phone,
            solicitorName: profile.solicitor_name || DEFAULT_FIRM_PROFILE.solicitorName,
            firmLogoUrl: profile.firm_logo_url,
            firmId: profile.firm_id,
            isEnterprise: profile.is_enterprise
          });
          setCreditsTotal(profile.credits_total ?? 1000);
          setCreditsUsed(profile.credits_used ?? 0);
        }
      } catch (e) {
        console.warn('Cloud sync failed, using LocalStorage fallback.', e);
      }
    };
    initCloudData();
    supabase.auth.onAuthStateChange((event) => { if (event === 'SIGNED_IN') initCloudData(); });
  }, []);

  useEffect(() => { localStorage.setItem('lexinaija_firmProfile', JSON.stringify(firmProfile)); }, [firmProfile]);
  useEffect(() => { localStorage.setItem('lexinaija_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('lexinaija_cases', JSON.stringify(cases)); }, [cases]);
  useEffect(() => { localStorage.setItem('lexinaija_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('lexinaija_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('lexinaija_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('lexinaija_auditLog', JSON.stringify(auditLog)); }, [auditLog]);
  useEffect(() => { localStorage.setItem('lexinaija_knowledgeItems', JSON.stringify(knowledgeItems)); }, [knowledgeItems]);

  const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = { id: Date.now().toString(), timestamp: new Date(), ...entry };
    setAuditLog(prevLog => [...prevLog, newEntry]);
    pushToCloud('audit_logs', 'insert', { 
      id: newEntry.id, 
      event_type: newEntry.eventType, 
      document_id: newEntry.documentId, 
      case_id: newEntry.caseId, 
      details: newEntry.details 
    });
  };

  const updateFirmProfile = (profile: FirmProfile) => {
    setFirmProfile(profile);
    pushToCloud('profiles', 'update', { 
        firm_name: profile.name,
        address: profile.address,
        email: profile.email,
        phone: profile.phone,
        solicitor_name: profile.solicitorName,
        firm_logo_url: profile.firmLogoUrl,
        is_enterprise: profile.isEnterprise
    }, '');
  };

  const consumeCredits = (units: number) => {
    if (creditsUsed + units > creditsTotal) return false;
    const newUsed = creditsUsed + units;
    setCreditsUsed(newUsed);
    pushToCloud('profiles', 'update', { credits_used: newUsed }, ''); // Empty ID because RLS/auth handles single profile
    return true;
  };

  const addCredits = (units: number) => {
    const newTotal = creditsTotal + units;
    setCreditsTotal(newTotal);
    pushToCloud('profiles', 'update', { credits_total: newTotal }, '');
  };

  const addClient = (client: Client) => {
    setClients([...clients, client]);
    pushToCloud('clients', 'insert', { id: client.id, name: client.name, type: client.type, email: client.email, phone: client.phone, address: client.address, date_added: client.dateAdded });
  };
  
  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...data } : c));
    const dbData: any = { ...data };
    if (data.dateAdded) dbData.date_added = data.dateAdded; delete dbData.dateAdded;
    pushToCloud('clients', 'update', dbData, id);
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    pushToCloud('clients', 'delete', {}, id);
  };

  const addCase = (newCase: Case) => {
    setCases([...cases, newCase]);
    pushToCloud('cases', 'insert', { id: newCase.id, client_id: newCase.clientId, title: newCase.title, suit_number: newCase.suitNumber, court: newCase.court, status: newCase.status, next_hearing: newCase.nextHearing, notes: newCase.notes, opposing_party: newCase.opposingParty, outcome: newCase.outcome });
  };
  
  const updateCase = (id: string, data: Partial<Case>) => {
    setCases(cases.map(c => c.id === id ? { ...c, ...data } : c));
    const dbData: any = { ...data };
    if (data.clientId) dbData.client_id = data.clientId; delete dbData.clientId;
    if (data.opposingParty) dbData.opposing_party = data.opposingParty; delete dbData.opposingParty;
    pushToCloud('cases', 'update', dbData, id);
  };

  const deleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
    pushToCloud('cases', 'delete', {}, id);
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
    pushToCloud('invoices', 'insert', { 
      id: invoice.id, 
      client_id: invoice.clientId, 
      case_id: invoice.caseId, 
      amount: invoice.amount, 
      description: invoice.description, 
      status: invoice.status, 
      date: invoice.date 
    });
  };
  
  const saveDocumentToCase = (caseId: string, doc: Omit<SavedDocument, 'status'>) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        const newDoc: SavedDocument = { ...doc, status: 'Draft' };
        addAuditLogEntry({ eventType: 'DOCUMENT_CREATED', documentId: newDoc.id, caseId: caseId, userId: 'system', details: `Document '${newDoc.title}' created.` });
        pushToCloud('documents', 'insert', { id: newDoc.id, case_id: caseId, title: newDoc.title, content: newDoc.content, type: newDoc.type, status: newDoc.status });
        return { ...c, documents: [...c.documents, newDoc] };
      }
      return c;
    }));
  };

  const updateCaseDocument = (caseId: string, docId: string, updates: Partial<SavedDocument>) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          documents: c.documents.map(d => {
            if (d.id === docId) {
               const version: DocumentVersion = { id: Date.now().toString(), timestamp: new Date(), content: d.content, title: d.title };
               const existingVersions = d.versions || [];
               addAuditLogEntry({ eventType: 'DOCUMENT_UPDATED', documentId: docId, caseId: caseId, userId: 'system', details: `Document '${d.title}' updated.` });
               pushToCloud('documents', 'update', { title: updates.title || d.title, content: updates.content || d.content, status: updates.status || d.status }, docId);
               pushToCloud('document_versions', 'insert', { id: version.id, document_id: docId, content: version.content, title: version.title });
               return { ...d, ...updates, versions: [version, ...existingVersions] };
            }
            return d;
          })
        };
      }
      return c;
    }));
  };

  const addBillableItem = (caseId: string, item: BillableItem) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        pushToCloud('billable_items', 'insert', { id: item.id, case_id: caseId, description: item.description, amount: item.amount, type: item.type, date: item.date });
        return { ...c, billableItems: [...c.billableItems, item] };
      }
      return c;
    }));
  };

  const addEvidence = (caseId: string, item: EvidenceItem) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        pushToCloud('evidence', 'insert', { id: item.id, case_id: caseId, description: item.description, type: item.type, date_obtained: item.dateObtained, is_relied_upon: item.isReliedUpon, custody_location: item.custodyLocation });
        return { ...c, evidence: [...(c.evidence || []), item] };
      }
      return c;
    }));
  };

  const deleteEvidence = (caseId: string, evidenceId: string) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        pushToCloud('evidence', 'delete', {}, evidenceId);
        return { ...c, evidence: (c.evidence || []).filter(e => e.id !== evidenceId) };
      }
      return c;
    }));
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    pushToCloud('tasks', 'insert', { id: task.id, case_id: task.caseId, title: task.title, due_date: task.dueDate, priority: task.priority, status: task.status });
  };
  
  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...data } : t));
    const dbData: any = { ...data };
    if (data.caseId) dbData.case_id = data.caseId; delete dbData.caseId;
    if (data.dueDate) dbData.due_date = data.dueDate; delete dbData.dueDate;
    pushToCloud('tasks', 'update', dbData, id);
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    pushToCloud('tasks', 'delete', {}, id);
  };

  const addKnowledgeItem = (item: KnowledgeItem) => {
    setKnowledgeItems(prev => [...prev, item]);
    pushToCloud('knowledge_items', 'insert', { id: item.id, title: item.title, content: item.content, category: item.category, source_file: item.sourceFile, tags: item.tags, date_added: item.dateAdded });
  };

  const deleteKnowledgeItem = (id: string) => {
    setKnowledgeItems(prev => prev.filter(k => k.id !== id));
    pushToCloud('knowledge_items', 'delete', {}, id);
  };

  const getAnalytics = (): LegalAnalytics => {
    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status === 'Open' || c.status === 'Pending Court' || c.status === 'Drafting').length;
    const closedCases = cases.filter(c => c.status === 'Closed').length;
    const totalClients = clients.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const averageCaseValue = totalCases > 0 ? totalRevenue / totalCases : 0;

    const caseStatusDistribution = {
      Open: cases.filter(c => c.status === 'Open').length,
      'Pending Court': cases.filter(c => c.status === 'Pending Court').length,
      Closed: closedCases,
      Drafting: cases.filter(c => c.status === 'Drafting').length,
    };

    const outcomeDistribution = {
      Won: cases.filter(c => c.outcome === 'Won').length,
      Lost: cases.filter(c => c.outcome === 'Lost').length,
      Settled: cases.filter(c => c.outcome === 'Settled').length,
      Dismissed: cases.filter(c => c.outcome === 'Dismissed').length,
      Pending: cases.filter(c => c.outcome === 'Pending').length,
    };

    const totalResolvedCases = cases.filter(c => c.outcome && c.outcome !== 'Pending').length;
    const wonCases = cases.filter(c => c.outcome === 'Won').length;
    const winRate = totalResolvedCases > 0 ? (wonCases / totalResolvedCases) * 100 : 0;

    const monthlyRevenue = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const revenue = invoices.filter(inv => {
        const d = new Date(inv.date);
        return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
      }).reduce((sum, inv) => sum + inv.amount, 0);
      monthlyRevenue.push({ month: monthName, revenue, cases: invoices.filter(inv => (new Date(inv.date)).getMonth() === month.getMonth()).length });
    }

    const clientRevenue = new Map<string, { name: string; revenue: number; cases: number }>();
    invoices.forEach(inv => {
      const client = clients.find(c => c.id === inv.clientId);
      if (client) {
        const existing = clientRevenue.get(inv.clientId) || { name: client.name, revenue: 0, cases: 0 };
        existing.revenue += inv.amount;
        existing.cases += 1;
        clientRevenue.set(inv.clientId, existing);
      }
    });

    const topClients = Array.from(clientRevenue.entries()).map(([clientId, data]) => ({ clientId, clientName: data.name, totalRevenue: data.revenue, caseCount: data.cases })).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);

    const caseTypes = new Map<string, { count: number; totalValue: number }>();
    cases.forEach(c => {
      const type = c.title.includes('Tenancy') ? 'Tenancy' : c.title.includes('Contract') ? 'Contract' : c.title.includes('Corporate') ? 'Corporate' : c.title.includes('Divorce') ? 'Family' : c.title.includes('Criminal') ? 'Criminal' : 'General';
      const existing = caseTypes.get(type) || { count: 0, totalValue: 0 };
      existing.count += 1;
      existing.totalValue += invoices.filter(inv => inv.caseId === c.id).reduce((sum, inv) => sum + inv.amount, 0);
      caseTypes.set(type, existing);
    });

    return { totalCases, activeCases, closedCases, totalClients, totalRevenue, averageCaseValue, caseStatusDistribution, outcomeDistribution, winRate, monthlyRevenue, topClients, caseTypes: Array.from(caseTypes.entries()).map(([type, data]) => ({ type, count: data.count, avgValue: data.count > 0 ? data.totalValue / data.count : 0 })) };
  };

  return (
    <LegalStoreContext.Provider value={{ 
      firmProfile, clients, cases, invoices, tasks, activeDoc,
      creditsTotal, creditsUsed, consumeCredits, addCredits,
      updateFirmProfile, addClient, updateClient, deleteClient, 
      addCase, updateCase, deleteCase, addInvoice, 
      saveDocumentToCase, updateCaseDocument, addBillableItem, 
      addTask, updateTask, deleteTask, addEvidence, deleteEvidence, setActiveDoc, getAnalytics,
      auditLog, addAuditLogEntry,
      suggestions,      activeCaseId, setActiveCaseId, dismissSuggestion,
      activeSuggestion, setActiveSuggestion,
      knowledgeItems, addKnowledgeItem, deleteKnowledgeItem,
      currentView, setView,
      loadMoreCases, hasMoreCases, isLoadingMore
    }}>
      {children}
    </LegalStoreContext.Provider>
  );
};

export const useLegalStore = () => {
  const context = useContext(LegalStoreContext);
  if (context === undefined) throw new Error('useLegalStore must be used within a LegalStoreProvider');
  return context;
};
