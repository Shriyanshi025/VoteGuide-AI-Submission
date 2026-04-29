import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `
  You are VoteGuide AI, a specialized assistant for the Indian Election process.
  Help only with Indian voter guidance.
  Stay strictly on-topic.
  Use a helpful, customer-support tone.
  
  STRICT RULES:
  1. If the user asks about anything unrelated to Indian elections (e.g., weather, general news, sports, jokes, movies), 
     you MUST return this EXACT message: "I’m VoteGuide AI and I can help only with Indian voter guidance (eligibility, registration, polling booth, voter ID, election help). What would you like help with?"
  2. Maintain absolute political neutrality. Do not favor any party or candidate.
  3. If you are unsure of a fact, advise the user to check the official ECI (Election Commission of India) portal.
  4. Never drift outside the project scope.
`;

export const getGeminiResponse = async (
  message: string,
  history: any[],
  persona: string,
  mode: string,
  language: string
) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT 
  });

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // Filter out the current message from history if it exists, 
  // because we send it via sendMessage() below.
  const contents = history
    .filter(msg => msg.content !== message)
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  const chat = model.startChat({
    history: contents,
    safetySettings
  });

  const prompt = `
    Persona: ${persona}, Mode: ${mode}, Language: ${language}.
    User Message: ${message}
  `;

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};
