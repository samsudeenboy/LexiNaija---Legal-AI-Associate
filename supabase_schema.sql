-- SQL SCHEMA FOR LEXINAIJA

-- 1. Profiles (Chambers & Lawyers)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  firm_name TEXT,
  firm_id UUID DEFAULT gen_random_uuid(), -- Unified identifier for Enterprise firms
  address TEXT,
  phone TEXT,
  solicitor_name TEXT,
  credits_total INTEGER DEFAULT 1000,
  credits_used INTEGER DEFAULT 0,
  sso_domain TEXT,
  is_enterprise BOOLEAN DEFAULT FALSE,
  firm_logo_url TEXT,
  firm_website TEXT,
  vat_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  firm_id UUID,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Individual', 'Corporate')),
  email TEXT,
  phone TEXT,
  address TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cases (Matters)
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  firm_id UUID, -- Cascading firm identifier for Enterprise scaling
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  suit_number TEXT,
  court TEXT,
  status TEXT CHECK (status IN ('Open', 'Pending Court', 'Closed', 'Drafting')),
  next_hearing TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  opposing_party TEXT,
  outcome TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Documents
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  firm_id UUID,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('Draft', 'Research', 'Summary')),
  status TEXT CHECK (status IN ('Draft', 'Under Review', 'Approved', 'Signed', 'Rejected', 'Archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.b Document Versions
CREATE TABLE document_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Billable Items
CREATE TABLE billable_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT CHECK (type IN ('Professional Fee', 'Expense')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tasks (Docket)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  firm_id UUID,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT CHECK (status IN ('Pending', 'Completed'))
);

-- 7. Evidence Locker
CREATE TABLE evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('Document', 'Image', 'Audio', 'Physical', 'Correspondence')),
  date_obtained TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_relied_upon BOOLEAN DEFAULT TRUE,
  custody_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE billable_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Supporting Solo + Enterprise Multi-user)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Multi-user Firm Access logic: Users can view data if they created it OR if they share the same firm_id in Enterprise mode
CREATE POLICY "Multi-user client access" ON clients FOR ALL USING (
  auth.uid() = user_id OR 
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_enterprise = TRUE AND p.firm_id = clients.firm_id))
);

CREATE POLICY "Multi-user case access" ON cases FOR ALL USING (
  auth.uid() = user_id OR 
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_enterprise = TRUE AND p.firm_id = cases.firm_id))
);

CREATE POLICY "Multi-user document access" ON documents FOR ALL USING (
  auth.uid() = user_id OR 
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_enterprise = TRUE AND p.firm_id = documents.firm_id))
);

CREATE POLICY "Multi-user task access" ON tasks FOR ALL USING (
  auth.uid() = user_id OR 
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_enterprise = TRUE AND p.firm_id = tasks.firm_id))
);

CREATE POLICY "Multi-user evidence access" ON evidence FOR ALL USING (
  auth.uid() = user_id OR 
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_enterprise = TRUE AND p.firm_id = evidence.firm_id))
);

CREATE POLICY "Multi-user version access" ON document_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM documents d WHERE d.id = document_id AND (d.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_enterprise = TRUE AND p.firm_id = d.firm_id)))
);
-- 10. Hearings (Full Cause List History)
CREATE TABLE hearings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hearing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT NOT NULL, -- e.g., 'Mention', 'Trial', 'Judgment', 'Adoption of Addresses'
  status TEXT CHECK (status IN ('Scheduled', 'Adjourned', 'Concluded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Knowledge Items (AI Context Sync)
CREATE TABLE knowledge_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Conflict Investigations (Ethical Audit)
CREATE TABLE conflict_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  is_clear BOOLEAN DEFAULT TRUE,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- 13. Service of Process (Bailiff Tracker)
CREATE TABLE service_of_process (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  party_to_be_served TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending Dispatch', 'With Bailiff', 'Served', 'Attempted', 'Substituted Service')),
  date_served TIMESTAMP WITH TIME ZONE,
  proof_of_service_url TEXT,
  notes TEXT
);

-- 14. Master Audit Log (Evidence Act Sec 84 Compliance)
-- Immutable trail of data entry/modifications
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'DOC_CREATED', 'CASE_MODIFIED'
  target_id UUID,
  target_table TEXT,
  prev_state JSONB,
  new_state JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  integrity_hash TEXT -- Hash of (prev_state + new_state + timestamp) for court validation
);

-- RLS for institutional tables
ALTER TABLE hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_of_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own hearings" ON hearings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own knowledge" ON knowledge_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conflict checks" ON conflict_checks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own service tracking" ON service_of_process FOR ALL USING (
  EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid())
);
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);

-- 15. Firm Precedents (Standardized Templates)
CREATE TABLE firm_precedents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- e.g., 'Litigation', 'Corporate', 'Property'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE firm_precedents ENABLE ROW LEVEL SECURITY;
-- Note: AUDIT LOGS should ideally be INSERT ONLY for users via triggers/functions, preventing deletion of history.

-- 16. Performance Indexing (Scaling for 5000+ Users)
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_case_id ON tasks(case_id);
CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_evidence_user_id ON evidence(user_id);
CREATE INDEX idx_hearings_case_id ON hearings(case_id);
CREATE INDEX idx_hearings_user_id ON hearings(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_case_id ON invoices(case_id);
