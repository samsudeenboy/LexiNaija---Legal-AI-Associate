import { runGemini } from "./geminiCore";
import { runGroq } from "./groqService";

/**
 * AI Neural Orchestrator
 * Implements high-availability routing for LexiNaija Pro.
 * Primary: Gemini 2.0 Flash (Native Jurisprudence)
 * Secondary: Groq Llama-3 (High-speed Failover)
 */
export const runAI = async (prompt: string): Promise<string> => {
  try {
    // Attempt Primary Neural Core (Gemini)
    console.log("Orchestrator: Engaging Gemini 2.0 Flash...");
    return await runGemini(prompt);
  } catch (geminiError: any) {
    console.warn("Orchestrator: Gemini Core Quota/Failure detected. Initiating Failover...");
    
    // Check if it's specifically a quota issue (429) or general failure
    const isQuotaError = geminiError.message.includes("quota") || geminiError.message.includes("429");
    
    try {
      // Attempt Secondary Neural Core (Groq)
      console.log("Orchestrator: Engaging Groq Llama-3 Failover...");
      return await runGroq(prompt);
    } catch (groqError: any) {
      console.error("Orchestrator: Dual-Engine failure. Neural blackout.");
      throw new Error("Critical Neural Engine Failure. Please contact system administrator.");
    }
  }
};
