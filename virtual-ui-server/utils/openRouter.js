import { GoogleGenAI } from "@google/genai";

export const askAI = async (messages) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is missing. Check your .env file."
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    const systemMessage = messages.find(
      (message) => message.role === "system"
    );

    const userMessages = messages
      .filter((message) => message.role !== "system")
      .map((message) => message.content)
      .join("\n\n");

    console.log("🤖 Sending request to Gemini 3.6 Flash...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: userMessages,

      config: {
        systemInstruction: systemMessage?.content || "",

        maxOutputTokens: 8000,

        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text || !text.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("✅ Gemini response received");

    return text;

  } catch (error) {
    console.error("====================================");
    console.error("❌ GEMINI API ERROR");
    console.error("====================================");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("====================================");

    throw new Error(
      error.message || "Gemini API Error"
    );
  }
};