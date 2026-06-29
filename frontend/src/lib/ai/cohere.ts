import { CohereClient } from "cohere-ai";

// Initialize the Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

/**
 * Generates embeddings for a list of text documents (e.g., transaction descriptions).
 * @param texts Array of strings to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await cohere.embed({
      texts: texts,
      model: "embed-english-v3.0",
      inputType: "search_document",
    });
    
    // The v3 embeddings return an array of arrays of numbers (float arrays)
    return response.embeddings as number[][];
  } catch (error) {
    console.error("Error generating Cohere embeddings:", error);
    throw new Error("Failed to communicate with Cohere API.");
  }
}

/**
 * Perform a semantic search query embedding.
 * @param query The search query string
 * @returns The embedding vector for the search query
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  try {
    const response = await cohere.embed({
      texts: [query],
      model: "embed-english-v3.0",
      inputType: "search_query",
    });
    
    return (response.embeddings as number[][])[0];
  } catch (error) {
    console.error("Error generating Cohere query embedding:", error);
    throw new Error("Failed to communicate with Cohere API.");
  }
}
