import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Case, Invoice, SavedDocument, DocumentVersion, BillableItem, Task, FirmProfile, EvidenceItem, LegalAnalytics, AuditLogEntry } from '../types';

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
    outcome: 'Pending' // Added outcome field
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

// JSON Date Reviver
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const LegalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize State with LocalStorage or Defaults
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

  const [creditsTotal, setCreditsTotal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_credits_total');
      return saved ? parseInt(saved) : 1000;
    } catch (e) { return 1000; }
  });

  const [creditsUsed, setCreditsUsed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_credits_used');
      return saved ? parseInt(saved) : 0;
    } catch (e) { return 0; }
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('lexinaija_auditLog');
      return saved ? JSON.parse(saved, dateReviver) : DEFAULT_AUDIT_LOG;
    } catch (e) { return DEFAULT_AUDIT_LOG; }
  });

  // Persist State Changes
  useEffect(() => {
    const v = localStorage.getItem('lexinaija_store_version');
    if (!v) localStorage.setItem('lexinaija_store_version', STORE_VERSION);
  }, []);
  useEffect(() => {
    localStorage.setItem('lexinaija_firmProfile', JSON.stringify(firmProfile));
  }, [firmProfile]);

  useEffect(() => {
    localStorage.setItem('lexinaija_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('lexinaija_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('lexinaija_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('lexinaija_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lexinaija_credits_total', String(creditsTotal));
  }, [creditsTotal]);

  useEffect(() => {
    localStorage.setItem('lexinaija_credits_used', String(creditsUsed));
  }, [creditsUsed]);

  useEffect(() => {
    localStorage.setItem('lexinaija_auditLog', JSON.stringify(auditLog));
  }, [auditLog]);

  const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    setAuditLog(prevLog => [...prevLog, { id: Date.now().toString(), timestamp: new Date(), ...entry }]);
  };

  const updateFirmProfile = (profile: FirmProfile) => setFirmProfile(profile);

  const consumeCredits = (units: number) => {
    if (creditsUsed + units > creditsTotal) return false;
    setCreditsUsed(creditsUsed + units);
    return true;
  };

  const addCredits = (units: number) => {
    setCreditsTotal(creditsTotal + units);
  };

  const addClient = (client: Client) => setClients([...clients, client]);
  
  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const addCase = (newCase: Case) => setCases([...cases, newCase]);
  
  const updateCase = (id: string, data: Partial<Case>) => {
    setCases(cases.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
  };

  const addInvoice = (invoice: Invoice) => setInvoices([...invoices, invoice]);
  
  const saveDocumentToCase = (caseId: string, doc: Omit<SavedDocument, 'status'>) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        const newDoc: SavedDocument = { ...doc, status: 'Draft' };
        addAuditLogEntry({ eventType: 'DOCUMENT_CREATED', documentId: newDoc.id, caseId: caseId, userId: 'system', details: `Document '${newDoc.title}' created.` });
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
               const version: DocumentVersion = {
                 id: Date.now().toString(),
                 timestamp: new Date(),
                 content: d.content,
                 title: d.title
               };
               const existingVersions = d.versions || [];
               addAuditLogEntry({ eventType: 'DOCUMENT_UPDATED', documentId: docId, caseId: caseId, userId: 'system', details: `Document '${d.title}' updated.` });
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
        return { ...c, billableItems: [...c.billableItems, item] };
      }
      return c;
    }));
  };

  const addEvidence = (caseId: string, item: EvidenceItem) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, evidence: [...(c.evidence || []), item] };
      }
      return c;
    }));
  };

  const deleteEvidence = (caseId: string, evidenceId: string) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, evidence: (c.evidence || []).filter(e => e.id !== evidenceId) };
      }
      return c;
    }));
  };

  const addTask = (task: Task) => setTasks([...tasks, task]);
  
  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...data } : t));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
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
  
      // Generate monthly revenue data for the last 6 months
      const monthlyRevenue = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.date);
          return invDate.getMonth() === month.getMonth() && invDate.getFullYear() === month.getFullYear();
        });
        const revenue = monthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const casesCount = monthInvoices.length;
        monthlyRevenue.push({ month: monthName, revenue, cases: casesCount });
      }
  
      // Calculate top clients by revenue
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
  
      const topClients = Array.from(clientRevenue.entries())
        .map(([clientId, data]) => ({
          clientId,
          clientName: data.name,
          totalRevenue: data.revenue,
          caseCount: data.cases,
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);
  
      // Calculate case types based on case titles
      const caseTypes = new Map<string, { count: number; totalValue: number }>();
      cases.forEach(c => {
        const type = c.title.includes('Tenancy') ? 'Tenancy' :
                     c.title.includes('Contract') ? 'Contract' :
                     c.title.includes('Corporate') ? 'Corporate' :
                     c.title.includes('Divorce') ? 'Family' :
                     c.title.includes('Criminal') ? 'Criminal' : 'General';
        
        const existing = caseTypes.get(type) || { count: 0, totalValue: 0 };
        existing.count += 1;
        const caseInvoices = invoices.filter(inv => inv.caseId === c.id);
        existing.totalValue += caseInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        caseTypes.set(type, existing);
      });
  
      const caseTypesArray = Array.from(caseTypes.entries()).map(([type, data]) => ({
        type,
        count: data.count,
        avgValue: data.count > 0 ? data.totalValue / data.count : 0,
      }));
  
      return {
        totalCases,
        activeCases,
        closedCases,
        totalClients,
        totalRevenue,
        averageCaseValue,
        caseStatusDistribution,
        monthlyRevenue,
        topClients,
        caseTypes: caseTypesArray,
        outcomeDistribution,
        winRate
      };
    };
  return (
    <LegalStoreContext.Provider value={{ 
      firmProfile, clients, cases, invoices, tasks, activeDoc,
      creditsTotal, creditsUsed, consumeCredits, addCredits,
      updateFirmProfile, addClient, updateClient, deleteClient, 
      addCase, updateCase, deleteCase, addInvoice, 
      saveDocumentToCase, updateCaseDocument, addBillableItem, 
      addTask, updateTask, deleteTask, addEvidence, deleteEvidence, setActiveDoc, getAnalytics,
      auditLog, addAuditLogEntry
    }}>
      {children}
    </LegalStoreContext.Provider>
  );
};

export const useLegalStore = () => {
  const context = useContext(LegalStoreContext);
  if (context === undefined) {
    throw new Error('useLegalStore must be used within a LegalStoreProvider');
  }
  return context;
};
