import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContractParams, CaseSummary } from "../types";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

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
    throw new Error("Failed to generate content from the AI model.");
  }
}

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
  return await run(prompt);
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
  return await run(prompt);
};

export const getClauseSuggestions = async (contractType: string): Promise<string> => {
  const prompt = `List 6-8 standard Nigerian clauses for a ${contractType} as a comma-separated list.`;
  const result = await run(prompt);
  return result.replace(/(\d\.|\*|-|\n)/g, '').split(',').map(s => s.trim()).filter(Boolean).join(',');
};

export const summarizeCaseText = async (text: string): Promise<CaseSummary> => {
  const prompt = `Summarize this Nigerian case text into JSON with: title, ratioDecidendi, summary, relevantStatutes.\nTEXT: ${text}`;
  const result = await run(prompt);
  try {
    const cleanedResult = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedResult) as CaseSummary;
  } catch (error) {
    throw new Error("AI returned an invalid summary format.");
  }
};

export const generateFeeNoteDescription = async (details: string): Promise<string> => {
  const prompt = `Generate a formal Nigerian legal fee note description for: "${details}"`;
  return await run(prompt);
};

export const refineLegalText = async (text: string, instruction: string): Promise<string> => {
  const prompt = `Refine this legal text based on: "${instruction}". Maintain Nigerian legal tone.\nTEXT: ${text}`;
  return await run(prompt);
};

export const generateDailyBrief = async (scheduleData: string): Promise<string> => {
  const prompt = `Generate a professional daily briefing for a Nigerian lawyer based on: ${scheduleData}`;
  return await run(prompt);
};

export const generateCaseStrategy = async (facts: string, role: string, jurisdiction: string): Promise<string> => {
  const prompt = `Generate a Nigerian case strategy for a ${role} in ${jurisdiction}. Facts: ${facts}`;
  return await run(prompt);
};

export const generateLegalArgument = async (issue: string, stance: string, facts: string, jurisdiction: string): Promise<string> => {
  const prompt = `Draft a Nigerian court argument for a Judge (address as "My Lord"). Issue: ${issue}, Stance: ${stance}, Facts: ${facts}`;
  return await run(prompt);
};

export const analyzeWitnessStatement = async (statement: string, role: string): Promise<string> => {
  const prompt = `Analyze this witness statement (${role}) under Nigerian Evidence Act 2011 logic. Questions included.\nSTATEMENT: ${statement}`;
  return await run(prompt);
};

export const generateCorporateObjects = async (description: string): Promise<string> => {
  const prompt = `Generate CAMA 2020 compliant Objects Clauses for: ${description}`;
  return await run(prompt);
};

export const generateCorporateResolution = async (action: string, companyName: string, directors: string, type: 'Board' | 'General'): Promise<string> => {
  const prompt = `Draft a Nigerian ${type} Resolution for ${companyName}. Action: ${action}, Directors: ${directors}`;
  return await run(prompt);
};

export const generateComplianceAdvice = async (query: string): Promise<string> => {
  const prompt = `Provide Nigerian compliance advice for: "${query}". Identify framework (CAMA, Tax, etc).`;
  return await run(prompt);
};

export const generateEntertainmentAdvice = async (query: string, category: string): Promise<string> => {
  const prompt = `You are a Nigerian Entertainment Lawyer. Provide advice on "${query}" (Category: ${category}) using Copyright Act 2023 logic. Structure: Legal Basis, Analysis, Recommendations, Pitfalls.`;
  return await run(prompt);
};

export const draftEntertainmentContract = async (type: string, parties: string, keyTerms: string): Promise<string> => {
  const prompt = `Draft a Nigerian ${type} agreement between ${parties} with terms: ${keyTerms}. Use Copyright Act 2023 and industry standards.`;
  return await run(prompt);
};
