import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates financial advice based on a summary of transactions and cash flow data.
 * @param financialData A stringified summary of the user's recent financials.
 * @returns A string containing the AI's strategic advice.
 */
export async function generateFinancialAdvice(financialData: string): Promise<string> {
  try {
    const prompt = `
You are an expert financial advisor for Nigerian SMEs.
Based on the following financial data, provide 3 actionable, strategic pieces of advice to improve cash flow and reduce unnecessary expenses. Be concise, professional, and practical.

Financial Data:
${financialData}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use flash model for fast response
      contents: prompt,
    });

    return response.text || "No advice could be generated.";
  } catch (error) {
    console.error("Error in Gemini financial advice generation:", error);
    throw new Error("Failed to communicate with Gemini API.");
  }
}
