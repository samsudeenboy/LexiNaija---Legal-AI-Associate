export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DOCKET = 'DOCKET',
  RESEARCH = 'RESEARCH',
  DRAFTER = 'DRAFTER',
  SUMMARIZER = 'SUMMARIZER',
  CLIENTS = 'CLIENTS',
  CASES = 'CASES',
  BILLING = 'BILLING',
  EDITOR = 'EDITOR',
  SETTINGS = 'SETTINGS',
  CONFLICT_CHECK = 'CONFLICT_CHECK',
  CALCULATORS = 'CALCULATORS',
  PRECEDENTS = 'PRECEDENTS',
  PRACTICE_GUIDE = 'PRACTICE_GUIDE',
  STRATEGY = 'STRATEGY',
  EVIDENCE = 'EVIDENCE',
  WITNESS = 'WITNESS',
  BRIEFS = 'BRIEFS',
  CORPORATE = 'CORPORATE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  CALCULATOR = 'CALCULATOR',
  ANALYTICS = 'ANALYTICS',
  CASE_LAW = 'CASE_LAW',
  BAILIFF = 'BAILIFF',
  AUDIT = 'AUDIT',
  PORTAL = 'PORTAL',
  LANDING = 'LANDING',
  AUTH = 'AUTH'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ContractParams {
  type: string;
  partyA: string;
  partyB: string;
  jurisdiction: string;
  keyTerms: string;
}

export interface CaseSummary {
  title: string;
  ratioDecidendi: string;
  summary: string;
  relevantStatutes: string[];
}

export interface Client {
  id: string;
  name: string;
  type: 'Individual' | 'Corporate';
  email: string;
  phone: string;
  address: string;
  dateAdded: Date;
}

export interface BillableItem {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: 'Professional Fee' | 'Expense';
}

export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  caseId?: string; // Optional link to a case
}

export interface EvidenceItem {
  id: string;
  description: string;
  type: 'Document' | 'Image' | 'Audio' | 'Physical' | 'Correspondence';
  dateObtained: Date;
  isReliedUpon: boolean; // For "List of Documents to be Relied Upon"
  custodyLocation?: string; // e.g., "Client Safe" or "Chambers Safe"
  notes?: string;
}

export interface Case {
  id: string;
  clientId: string;
  title: string;
  suitNumber?: string;
  court?: string;
  status: 'Open' | 'Pending Court' | 'Closed' | 'Drafting';
  nextHearing?: string;
  notes: string;
  opposingParty?: string; // For conflict checks
  documents: SavedDocument[];
  billableItems: BillableItem[];
  evidence: EvidenceItem[];
  outcome?: 'Won' | 'Lost' | 'Settled' | 'Dismissed' | 'Pending'; // New outcome field
}

export interface DocumentVersion {
  id: string;
  timestamp: Date;
  content: string;
  title: string;
}

export interface SavedDocument {
  id: string;
  title: string;
  content: string;
  type: 'Draft' | 'Research' | 'Summary';
  createdAt: Date;
  versions?: DocumentVersion[];
  status: 'Draft' | 'Under Review' | 'Approved' | 'Signed' | 'Rejected' | 'Archived';
}

export interface Invoice {
  id: string;
  clientId: string;
  caseId?: string;
  amount: number;
  description: string;
  status: 'Draft' | 'Sent' | 'Paid';
  date: Date;
}

export interface FirmProfile {
  name: string;
  address: string;
  email: string;
  phone: string;
  solicitorName: string;
}

export interface LegalAnalytics {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  totalClients: number;
  totalRevenue: number;
  averageCaseValue: number;
  caseStatusDistribution: {
    Open: number;
    'Pending Court': number;
    Closed: number;
    Drafting: number;
  };
  outcomeDistribution: {
    Won: number;
    Lost: number;
    Settled: number;
    Dismissed: number;
    Pending: number;
  };
  winRate: number;
  monthlyRevenue: {
    month: string;
    revenue: number;
    cases: number;
  }[];
  topClients: {
    clientId: string;
    clientName: string;
    totalRevenue: number;
    caseCount: number;
  }[];
  caseTypes: {
    type: string;
    count: number;
    avgValue: number;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  eventType: 'DOCUMENT_CREATED' | 'DOCUMENT_UPDATED' | 'DOCUMENT_VIEWED' | 'DOCUMENT_DELETED';
  documentId?: string;
  caseId?: string;
  userId?: string; // Will be null until authentication is implemented
  details?: string;
}

export interface Suggestion {
  id: string;
  type: 'action' | 'missing_evidence' | 'deadline' | 'insight';
  title: string;
  description: string;
  actionLabel: string;
  targetView: AppView;
  targetState?: any;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: Date;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'Entertainment' | 'G.M IBRU' | 'LAW SCHOOL' | 'CAC' | 'General';
  sourceFile?: string;
  tags?: string[];
  dateAdded: Date;
}
