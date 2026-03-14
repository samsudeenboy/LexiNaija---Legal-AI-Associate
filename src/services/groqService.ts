import Groq from "groq-sdk";

const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;

let groq: Groq | null = null;
if (apiKey) {
  groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Essential for client-side React integration
  });
}

export const runGroq = async (prompt: string): Promise<string> => {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("Neural failover to Groq failed.");
  }
};
