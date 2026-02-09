
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPlan } from "../types";

const getApiKey = () => {
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) return savedKey;
  // @ts-ignore
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const getAIInstance = () => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');
  return new GoogleGenAI({ apiKey });
};

export const generateStudyPlan = async (subject: string, goal: string, durationDays: number): Promise<GeneratedPlan> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a structured study plan for the subject "${subject}" with the goal "${goal}" over ${durationDays} days.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          goal: { type: Type.STRING },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                focus: { type: Type.STRING },
              },
              required: ["time", "activity", "focus"]
            }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "goal", "schedule", "tips"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getQuickAdvice = async (taskTitle: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a quick, 1-sentence productivity tip or a mnemonic for studying: "${taskTitle}". Keep it encouraging and short.`
  });
  return response.text || "You can do this! Stay focused.";
};
