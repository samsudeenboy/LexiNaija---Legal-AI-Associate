import { ContractParams, CaseSummary } from "../types";
import { runAI } from "./aiOrchestrator";

export const generateLegalResearch = async (query: string, context?: string): Promise<string> => {
  const prompt = `LEGAL RESEARCH MEMORANDUM
TO: Nigerian Lawyer
FROM: LexiNaija AI Legal Assistant
DATE: ${new Date().toLocaleDateString()}
RE: Legal Research on "${query}" under Nigerian Law

${context ? `**REFERENCE CONTEXT:**\n${context}\n\n` : ''}
**INSTRUCTIONS:**
Provide a concise legal research memorandum on the query above. Structure the response with the following sections:
1. Executive Summary.
2. Key Principles & Doctrines.
3. Relevant Statutes (cite Nigerian Acts).
4. Landmark Case Law (Nigerian).
5. Practical Application.

**QUERY:**
"${query}"
`;
  return await runAI(prompt);
};

export const draftContract = async (params: ContractParams, context?: string): Promise<string> => {
  const prompt = `DRAFT OF A NIGERIAN LEGAL DOCUMENT
TYPE: ${params.type}
PARTIES: Party A: ${params.partyA}, Party B: ${params.partyB}
JURISDICTION: ${params.jurisdiction}, Nigeria
KEY TERMS: ${params.keyTerms}
${context ? `**REFERENCE CONTEXT:**\n${context}\n\n` : ''}
Draft a full Nigerian ${params.type} agreement.
`;
  return await runAI(prompt);
};

export const getClauseSuggestions = async (contractType: string): Promise<string> => {
  const prompt = `List 6-8 standard Nigerian clauses for a ${contractType} as a comma-separated list.`;
  const result = await runAI(prompt);
  return result.replace(/(\d\.|\*|-|\n)/g, '').split(',').map(s => s.trim()).filter(Boolean).join(',');
};

export const summarizeCaseText = async (text: string): Promise<CaseSummary> => {
  const prompt = `Summarize this Nigerian case text into JSON with: title, ratioDecidendi, summary, relevantStatutes.\nTEXT: ${text}`;
  const result = await runAI(prompt);
  try {
    const cleanedResult = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedResult) as CaseSummary;
  } catch (error) {
    throw new Error("AI returned an invalid summary format.");
  }
};

export const generateFeeNoteDescription = async (details: string): Promise<string> => {
  const prompt = `Generate a formal Nigerian legal fee note description for: "${details}"`;
  return await runAI(prompt);
};

export const refineLegalText = async (text: string, instruction: string): Promise<string> => {
  const prompt = `Refine this legal text based on: "${instruction}". Maintain Nigerian legal tone.\nTEXT: ${text}`;
  return await runAI(prompt);
};

export const generateDailyBrief = async (scheduleData: string): Promise<string> => {
  const prompt = `Generate a professional daily briefing for a Nigerian lawyer based on: ${scheduleData}`;
  return await runAI(prompt);
};

export const generateCaseStrategy = async (facts: string, role: string, jurisdiction: string, caseContext?: string): Promise<string> => {
  const prompt = `CASE STRATEGY ADVISORY
ROLE: ${role}
JURISDICTION: ${jurisdiction}
FACTS: ${facts}

${caseContext ? `**ADDITIONAL MATTER CONTEXT (DOCUMENTS):**\n${caseContext}\n\n` : ''}
**INSTRUCTIONS:**
Provide a comprehensive strategic legal opinion under Nigerian law. Structure as:
1. Executive Summary
2. Merits of the Case (SWOT)
3. Statutory & Judicial Framework
4. Strategic Proposals (Action Plan)
5. Risk Mitigation`;
  return await runAI(prompt);
};

export const generateLegalArgument = async (issue: string, stance: string, facts: string, jurisdiction: string, caseContext?: string): Promise<string> => {
  const prompt = `LEGAL ARGUMENT & WRITTEN ADDRESS
ISSUE: ${issue}
STANCE: ${stance}
FACTS: ${facts}
JURISDICTION: ${jurisdiction}

${caseContext ? `**ADDITIONAL MATTER CONTEXT (DOCUMENTS):**\n${caseContext}\n\n` : ''}
**INSTRUCTIONS:**
Draft a formal Nigerian court argument using the IRAC (Issue, Rule, Application, Conclusion) methodology. Address the Judge as "My Lord". Use authoritative citations from Nigerian statutes and recent Supreme Court or Court of Appeal case law.`;
  return await runAI(prompt);
};

export const analyzeWitnessStatement = async (statement: string, role: string): Promise<string> => {
  const prompt = `Analyze this witness statement (${role}) under Nigerian Evidence Act 2011 logic. Questions included.\nSTATEMENT: ${statement}`;
  return await runAI(prompt);
};

export const generateCorporateObjects = async (description: string): Promise<string> => {
  const prompt = `Generate CAMA 2020 compliant Objects Clauses for: ${description}`;
  return await runAI(prompt);
};

export const generateCorporateResolution = async (action: string, companyName: string, directors: string, type: 'Board' | 'General'): Promise<string> => {
  const prompt = `Draft a Nigerian ${type} Resolution for ${companyName} compliant with CAMA 2020. 
  ACTION: ${action}
  ATTENDANCE: ${directors}
  INSTRUCTIONS: Use formal legal language. Include a preamble about the meeting being duly convened, the specific resolution text, and a signature block for a Director and the Company Secretary.`;
  return await runAI(prompt);
};

export const generateComplianceAdvice = async (query: string): Promise<string> => {
  const prompt = `Provide Nigerian compliance advice for: "${query}". 
  Identify relevant framework (CAMA 2020, Finance Act, Tax laws, etc). 
  Reference specific sections where possible (e.g., Section 370-433 for Annual Returns). 
  Provide a 'Compliance Checklist' for the next 12 months.`;
  return await runAI(prompt);
};

export const generateEntertainmentAdvice = async (query: string, category: string): Promise<string> => {
  const prompt = `You are a Nigerian Entertainment Lawyer. Provide advice on "${query}" (Category: ${category}) using Copyright Act 2022 logic. Structure: Legal Basis, Analysis, Recommendations, Pitfalls.`;
  return await runAI(prompt);
};

export const draftEntertainmentContract = async (type: string, parties: string, keyTerms: string): Promise<string> => {
  const prompt = `Draft a Nigerian ${type} agreement between ${parties} with terms: ${keyTerms}. Use Copyright Act 2022 and industry standards.`;
  return await runAI(prompt);
};
