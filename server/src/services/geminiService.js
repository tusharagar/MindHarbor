import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log(
  process.env.GEMINI_API_KEY
    ? "✅ Gemini API key loaded"
    : "❌ Gemini API key missing",
);

const MOOD_DESCRIPTIONS = {
  very_sad: "feeling very sad and down",
  sad: "feeling sad",
  neutral: "feeling neutral / okay",
  happy: "feeling happy",
  very_happy: "feeling very happy and energetic",
  anxious: "feeling anxious and worried",
  stressed: "feeling stressed and overwhelmed",
  calm: "feeling calm and relaxed",
};

export const buildSystemPrompt = (moodContext) => {
  const moodDesc = moodContext?.label
    ? MOOD_DESCRIPTIONS[moodContext.label] || moodContext.label
    : "unknown mood";
  const moodScore = moodContext?.score
    ? `${moodContext.score}/10`
    : "not recorded";
  const detectedVia =
    moodContext?.detectedVia === "facial"
      ? "facial expression analysis"
      : moodContext?.detectedVia || "self-report";

  return `You are MindSpace AI, a compassionate and supportive mental health chatbot designed specifically for university students in India.

STUDENT'S CURRENT EMOTIONAL STATE:
- Mood: ${moodDesc}
- Mood score: ${moodScore}
- Detected via: ${detectedVia}
- Recorded at: ${moodContext?.recordedAt ? new Date(moodContext.recordedAt).toLocaleString("en-IN") : "recently"}

YOUR ROLE:
- Provide empathetic, non-judgmental emotional support tailored to the student's current mood
- Offer practical coping strategies appropriate to their emotional state
- If mood score is 3 or below (very_sad, anxious, stressed), gently check in about their wellbeing first before giving advice
- If mood score is 7 or above (happy, very_happy, calm), engage positively
- Use simple, warm, conversational language — not clinical or robotic
- Suggest breathing exercises, mindfulness, journaling, or peer support when appropriate
- If the student expresses thoughts of self-harm or crisis, immediately provide iCall helpline (9152987821)

BOUNDARIES:
- Do not diagnose or prescribe medication
- Keep responses concise (3-5 sentences max)
- Always end with an open question`;
};

export const sendMessage = async (
  userMessage,
  chatHistory = [],
  moodContext = null,
  ragContextBlock = null,
) => {
  try {
    const systemInstruction = buildSystemPrompt(moodContext);

    // ── Build history for Gemini ───────────────────────────────────────────
    // Rules:
    //   1. roles must strictly alternate: user → model → user → model ...
    //   2. history must START with a user turn
    //   3. history must END with a model turn (current user message added separately)
    //   4. valid roles: "user" and "model" only (NOT "assistant")

    const trimmedHistory = chatHistory.slice(-10); // last 5 pairs

    const formattedHistory = trimmedHistory
      .filter((msg) => msg.role === "user" || msg.role === "model")
      .map((msg) => ({
        role: msg.role, // keep "user" or "model" as-is
        parts: [{ text: msg.content }],
      }));

    // ── Inject RAG context into the first user message if available ────────
    // Prepend it to the current user message rather than adding an extra role
    const messageWithContext = ragContextBlock
      ? `${ragContextBlock}\n\n---\n\nStudent message: ${userMessage}`
      : userMessage;

    // ── Final contents array ───────────────────────────────────────────────
    // history (alternating user/model) + current user message
    const contents = [
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: messageWithContext }],
      },
    ];

    // ── Call Gemini using systemInstruction (NOT a user role message) ──────
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction, // ← correct way to pass system prompt
        maxOutputTokens: 300,
        temperature: 0.75,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini error:", JSON.stringify(error.message || error));
    throw new Error("AI service unavailable. Please try again.");
  }
};
