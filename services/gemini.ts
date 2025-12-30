
import { GoogleGenAI, Type } from "@google/genai";

// Initialize using the environment variable directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeEvidence = async (imageData: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // Standard structure for single turn contents
      contents: {
        parts: [
          { inlineData: { data: imageData.split(',')[1], mimeType: 'image/jpeg' } },
          { text: `Analyze this construction/violation site image. Description provided by reporter: "${description}". Classify the violation and estimate severity (LOW, MEDIUM, HIGH). Return as JSON.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING },
            severity: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["classification", "severity", "confidence"]
        }
      }
    });

    // Access response text as a property, not a method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};