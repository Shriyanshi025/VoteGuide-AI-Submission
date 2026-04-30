import { GoogleGenerativeAI } from '@google/generative-ai';

interface EnhanceParams {
  userQuery: string;
  localAnswer: string;
  persona: string;
  language: string;
}

/**
 * Optionally enhances a local deterministic answer using Google Gemini.
 * Fails silently to the local answer if anything goes wrong.
 */
export const enhanceWithGemini = async ({
  userQuery,
  localAnswer,
  persona,
  language
}: EnhanceParams): Promise<string | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are VoteGuide AI, a specialized assistant for Indian voter guidance.
      
      SOURCE DATA (Verified Local Answer):
      "${localAnswer}"
      
      USER QUERY:
      "${userQuery}"
      
      CONTEXT:
      Voter Persona: ${persona}
      Preferred Language: ${language}
      
      INSTRUCTIONS:
      1. Use the provided SOURCE DATA as the absolute source of truth.
      2. Improve clarity and wording to be more voter-friendly.
      3. Do not invent any legal rules, dates, or registration details not present in the SOURCE DATA.
      4. Keep the answer concise and professional.
      5. If the USER QUERY is unrelated to Indian elections (off-topic), return the exact local answer without enhancement.
      6. Return ONLY the improved answer text.
    `;

    // 3 second timeout using Promise.race
    const resultPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 3000)
    );

    const result = await Promise.race([resultPromise, timeoutPromise]) as any;
    
    if (!result) return null;
    
    const response = await result.response;
    const text = response.text();
    
    return text.trim() || null;
  } catch (error) {
    // Fail silently - never leak API errors to the frontend
    console.error('Gemini Enhancement Error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};
