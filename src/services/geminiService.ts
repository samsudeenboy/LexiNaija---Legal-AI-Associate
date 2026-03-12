import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContractParams, CaseSummary } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' });

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001", apiVersion: 'v1' });

async function run(prompt: string): Promise<string> {
  try {
    console.log("AI Model Used:", model.model);
    console.log("Prompt sent to AI:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    // Return a user-friendly error message or re-throw a custom error
    throw new Error("Failed to generate content from the AI model.");
  }
}

// Mock implementation of AI services for offline capability



export const generateLegalResearch = async (query: string): Promise<string> => {
  const prompt = `LEGAL RESEARCH MEMORANDUM
TO: Nigerian Lawyer
FROM: LexiNaija AI Legal Assistant
DATE: ${new Date().toLocaleDateString()}
RE: Legal Research on "${query}" under Nigerian Law

**INSTRUCTIONS:**
Provide a concise legal research memorandum on the query above. Structure the response with the following sections:
1.  **Executive Summary:** A brief overview of the legal position.
2.  **Key Principles & Doctrines:** The core legal rules and principles governing the area.
3.  **Relevant Statutes:** A list of the most important Nigerian statutes (e.g., Acts of the National Assembly, State Laws).
4.  **Landmark Case Law:** Seminal Nigerian cases (Supreme Court or Court of Appeal) that have defined the area. Cite cases with full citations where possible (e.g., *Locus Classicus v. The State (2023) 1 NWLR (Pt. 1234) 567*).
5.  **Practical Application/Conclusion:** A concluding paragraph on how the law is applied in practice.

**QUERY:**
"${query}"

---
**MEMORANDUM**
---
`;
  return await run(prompt);
};

export const draftContract = async (params: ContractParams): Promise<string> => {
  const prompt = `DRAFT OF A NIGERIAN LEGAL DOCUMENT
  
TYPE: ${params.type}
PARTIES:
- Party A: ${params.partyA}
- Party B: ${params.partyB}
JURISDICTION: ${params.jurisdiction}, Nigeria

KEY TERMS TO INCLUDE:
${params.keyTerms}

**INSTRUCTIONS:**
Based on the parameters above, draft a standard Nigerian ${params.type}. The draft should be clean, well-formatted, and ready for a lawyer to review. It must include standard clauses for such an agreement under Nigerian law. Do not include placeholder brackets like "[Date]" or "[Address]"; instead, use "____".

---
**DRAFT DOCUMENT**
---
`;
  return await run(prompt);
};

export const getClauseSuggestions = async (contractType: string): Promise<string> => {
  const prompt = `LEGAL CLAUSE SUGGESTIONS
  
DOCUMENT TYPE: ${contractType} (Nigerian context)

**INSTRUCTIONS:**
List 6-8 standard, essential clauses for a Nigerian ${contractType}. Present the list as a simple, comma-separated string. Do not use numbering or bullet points.

**EXAMPLE:**
"Governing Law Clause,Termination Clause,Confidentiality Clause,Force Majeure Clause"

---
**CLAUSE LIST:**
---
`;
  const result = await run(prompt);
  // Post-process to ensure it's a clean, comma-separated list
  return result.replace(/(\d\.|\*|-|\n)/g, '').split(',').map(s => s.trim()).filter(Boolean).join(',');
};

export const summarizeCaseText = async (text: string): Promise<CaseSummary> => {
  const prompt = `CASE LAW SUMMARY
  
DOCUMENT TEXT:
---
${text}
---

**INSTRUCTIONS:**
Analyze the provided legal text (likely a court judgment or ruling from Nigeria). Extract the following key components and return them as a valid, stringified JSON object.

1.  **title**: A concise, descriptive title for the document.
2.  **ratioDecidendi**: The "Ratio Decidendi" or the core legal principle/reason for the decision.
3.  **summary**: A brief summary of the facts and holding.
4.  **relevantStatutes**: A JavaScript array of key statutes or laws cited (e.g., ["Evidence Act 2011", "CAMA 2020"]).

**JSON OUTPUT STRUCTURE:**
{
  "title": "...",
  "ratioDecidendi": "...",
  "summary": "...",
  "relevantStatutes": ["..."]
}

---
**JSON OUTPUT:**
---
`;
  const result = await run(prompt);
  try {
    // Clean the result to ensure it is valid JSON
    const cleanedResult = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedResult) as CaseSummary;
  } catch (error) {
    console.error("Failed to parse summary from AI:", error);
    // Return a fallback object or rethrow
    throw new Error("AI returned an invalid summary format.");
  }
};

export const generateFeeNoteDescription = async (details: string): Promise<string> => {
  const prompt = `FEE NOTE DESCRIPTION GENERATOR

**TASK:**
Generate a professional, one-sentence description for a fee note based on the following service details. The tone should be formal for a Nigerian legal context.

**SERVICE DETAILS:**
"${details}"

---
**FEE NOTE DESCRIPTION:**
Professional fees for...
`;
  return await run(prompt);
};

export const refineLegalText = async (text: string, instruction: string): Promise<string> => {
  const prompt = `LEGAL TEXT REFINEMENT

**ORIGINAL TEXT:**
---
${text}
---

**REFINEMENT INSTRUCTION:**
"${instruction}"

**INSTRUCTIONS:**
Based on the instruction, refine the original legal text provided above. Maintain a formal, Nigerian legal tone. The output should be only the refined text.

---
**REFINED TEXT:**
---
`;
  return await run(prompt);
};

export const generateDailyBrief = async (scheduleData: string): Promise<string> => {
  const prompt = `DAILY BRIEFING FOR A NIGERIAN LAWYER

**SCHEDULE & TASKS FOR THE DAY:**
---
${scheduleData}
---

**INSTRUCTIONS:**
You are the LexiNaija AI Legal Assistant. Generate a concise, professional daily briefing for a Nigerian lawyer based on the provided schedule. The tone should be encouraging and formal. Include a relevant quote about law or success.

**EXAMPLE STRUCTURE:**
**Daily Brief for Counsel**
Good morning, Learned Counsel.
[Summary of the day's schedule]
**Action Items:**
1. [Action 1]
2. [Action 2]
**Quote of the Day:**
"[Quote]" - [Author]
Best regards,
**LexiNaija Assistant**

---
**BRIEFING:**
---
`;
  return await run(prompt);
};

export const generateCaseStrategy = async (facts: string, role: string, jurisdiction: string): Promise<string> => {
  const prompt = `CASE STRATEGY REPORT (NIGERIAN LAW)

**JURISDICTION:** ${jurisdiction}
**CLIENT'S ROLE:** ${role}
**SUMMARY OF FACTS:**
---
${facts}
---

**INSTRUCTIONS:**
Generate a preliminary case strategy report based on the facts provided. The report should be tailored for a Nigerian legal practitioner. It must include:
1.  **SWOT Analysis** (Strengths, Weaknesses, Opportunities, Threats).
2.  **Key Legal Issues** to be determined.
3.  **Recommended Next Steps** (procedural and substantive).
4.  **Relevant Statutes & Rules** (e.g., High Court Rules, Evidence Act).
5.  A clear disclaimer that this is an AI-generated guide.

---
**STRATEGY REPORT:**
---
`;
  return await run(prompt);
};

export const generateLegalArgument = async (issue: string, stance: string, facts: string, jurisdiction: string): Promise<string> => {
  const prompt = `LEGAL ARGUMENT DRAFT (NIGERIAN COURT)

**COURT/JURISDICTION:** ${jurisdiction}
**LEGAL ISSUE:** ${issue}
**STANCE TO DEFEND:** ${stance}
**RELEVANT FACTS:**
---
${facts}
---

**INSTRUCTIONS:**
Draft a persuasive legal argument based on the provided information. The argument should be structured for a Nigerian court, addressing a Judge as "My Lord". It must:
1.  Start with a formal submission.
2.  State the legal principle (the "trite law").
3.  Cite at least one relevant or illustrative Nigerian case.
4.  Apply the principle to the given facts.
5.  Conclude with a prayer urging the court to find in favor of the specified stance.

---
**DRAFT ARGUMENT:**
---
`;
  return await run(prompt);
};

export const analyzeWitnessStatement = async (statement: string, role: string): Promise<string> => {
  const prompt = `WITNESS STATEMENT ANALYSIS & CROSS-EXAMINATION STRATEGY (NIGERIAN LAW)

**WITNESS ROLE:** ${role} (e.g., Claimant's Witness, Defendant's Expert Witness)
**WITNESS STATEMENT ON OATH:**
---
${statement}
---

**INSTRUCTIONS:**
Analyze the provided witness statement from a Nigerian litigation context. Generate a cross-examination strategy guide that includes:
1.  **Potential Inconsistencies & Gaps:** Identify weaknesses or areas lacking detail.
2.  **Credibility Issues:** Note any potential motives, bias, or reliance on hearsay (referencing the Evidence Act 2011 where relevant).
3.  **Suggested Cross-Examination Questions:** Propose 3-4 pointed questions to ask the witness. Frame them as a Nigerian lawyer would (e.g., "I put it to you that...").
4.  **Strategic Goal:** State the main objective of the cross-examination.

---
**ANALYSIS & STRATEGY:**
---
`;
  return await run(prompt);
};

export const generateCorporateObjects = async (description: string): Promise<string> => {
  const prompt = `CORPORATE OBJECTS CLAUSE GENERATOR (NIGERIAN COMPANY)

**PRIMARY BUSINESS ACTIVITY:**
${description}

**INSTRUCTIONS:**
Generate 3-4 standard "Objects Clauses" for the Memorandum of Association of a Nigerian company based on the primary business activity described above. The clauses should be concise and compliant with the Companies and Allied Matters Act (CAMA) 2020. The output should be a simple, numbered list.

---
**SUGGESTED OBJECTS CLAUSES:**
---
`;
  return await run(prompt);
};

export const generateCorporateResolution = async (action: string, companyName: string, directors: string, type: 'Board' | 'General'): Promise<string> => {
  const prompt = `CORPORATE RESOLUTION DRAFTER (NIGERIAN COMPANY)

**COMPANY NAME:** ${companyName}
**RESOLUTION TYPE:** ${type} Meeting
**ACTION TO BE RESOLVED:** ${action}
**DIRECTORS/MEMBERS PRESENT (if provided):** ${directors}

**INSTRUCTIONS:**
Draft a standard ${type} Resolution for the company named above to approve the specified action. The resolution should be formatted cleanly for a Nigerian corporate context. It must include fields for the date, attendees, the "WHEREAS" pre-amble, the "IT IS HEREBY RESOLVED" clauses, and signature lines for directors (or director/secretary). Use "____" for dates and signatures.

---
**DRAFT RESOLUTION:**
---
`;
  return await run(prompt);
};

export const generateComplianceAdvice = async (query: string): Promise<string> => {
  const prompt = `CORPORATE COMPLIANCE ADVISORY (NIGERIAN LAW)

**COMPLIANCE QUERY:**
"${query}"

**INSTRUCTIONS:**
Provide preliminary compliance advice on the query above from the perspective of Nigerian law. Your advice should:
1.  Identify the primary regulatory framework (e.g., CAMA 2020, tax laws).
2.  Provide 2-3 high-level recommendations or points of caution.
3.  Suggest a concrete next step or action point for the user.

---
**PRELIMINARY ADVICE:**
---
`;
  return await run(prompt);
};
