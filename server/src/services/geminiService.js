import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Mood label → human-readable description ───────────────────────────────────
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

// ── Build the system prompt using the student's mood ─────────────────────────
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
- If mood score is 7 or above (happy, very_happy, calm), engage positively and help them maintain or build on that state
- Use simple, warm, conversational language — not clinical or robotic
- Reference their detected mood naturally in conversation when relevant
- Suggest breathing exercises, mindfulness, journaling, or peer support when appropriate
- If the student expresses thoughts of self-harm or crisis, immediately provide iCall helpline (9152987821) and encourage them to reach out

BOUNDARIES:
- Do not diagnose any mental health condition
- Do not prescribe medication
- Do not replace professional counseling — encourage it when needed
- Keep responses concise (3-5 sentences max unless the student needs more)
- Always end with an open question to keep the conversation going

Remember: You have access to this student's chat history. Use it to give consistent, personalized support.`;
};

// ── Send a message to Gemini with full chat history ───────────────────────────
export const sendMessage = async (userMessage, chatHistory, moodContext) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = buildSystemPrompt(moodContext);

  // Convert our DB message format to Gemini's format
  // Gemini expects: [{ role: 'user'|'model', parts: [{ text }] }]
  const formattedHistory = chatHistory.map((msg) => ({
    role: msg.role, // 'user' or 'model'
    parts: [{ text: msg.content }],
  }));

  // Start chat with history
  const chat = model.startChat({
    history: formattedHistory,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.75, // slightly creative but grounded
      topP: 0.9,
    },
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;

  return response.text();
};
