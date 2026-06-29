import Groq from "groq-sdk";

// Initialize the Groq client
// It automatically picks up GROQ_API_KEY from the environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Sends a message to the Groq chatbot API and returns the response.
 * @param message The user's input message
 * @param systemPrompt Optional system prompt to guide the AI behavior
 * @returns The chatbot's reply as a string
 */
export async function generateChatResponse(message: string, systemPrompt?: string): Promise<string> {
  try {
    const messages: any[] = [];
    
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    
    messages.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192", // Fast and efficient model for chat
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in Groq chat generation:", error);
    throw new Error("Failed to communicate with Groq API.");
  }
}
