import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function runGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Gemini Core Error:", error);
    throw error; // Rethrow to allow orchestrator to handle failover
  }
}
