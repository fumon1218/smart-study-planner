
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyPlan = async (subject: string, goal: string, durationDays: number): Promise<GeneratedPlan> => {
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
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a quick, 1-sentence productivity tip or a mnemonic for studying: "${taskTitle}". Keep it encouraging and short.`
  });
  return response.text || "You can do this! Stay focused.";
};
