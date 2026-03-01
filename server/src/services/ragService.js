import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatSummary from "../models/ChatSummary.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// How many past summaries to retrieve per new session message
const MAX_RETRIEVED_SUMMARIES = 3;

// Min messages needed before a session is worth summarizing
const MIN_MESSAGES_TO_SUMMARIZE = 4;

// ── 1. SUMMARIZE a completed session and store it as a RAG document ───────────
export const summarizeAndStoreSession = async (session) => {
  if (
    !session.messages ||
    session.messages.length < MIN_MESSAGES_TO_SUMMARIZE
  ) {
    console.log(
      `[RAG] Session ${session._id} has too few messages to summarize. Skipping.`,
    );
    return null;
  }

  // Format conversation for Gemini to summarize
  const conversationText = session.messages
    .map((m) => `${m.role === "user" ? "Student" : "AI"}: ${m.content}`)
    .join("\n");

  const moodLabel = session.moodContext?.label || "unknown";
  const moodScore = session.moodContext?.score || "N/A";

  const summaryPrompt = `You are summarizing a mental health support chat session for a university student.

MOOD AT TIME OF CHAT: ${moodLabel} (score: ${moodScore}/10)

CONVERSATION:
${conversationText}

Please provide:
1. SUMMARY: A 3-5 sentence summary of what the student discussed, how they were feeling, and what support was provided. Write in third person ("The student...").
2. THEMES: List 3-6 key themes or topics discussed (e.g., "exam stress", "sleep issues", "breathing exercises", "relationship problems"). Comma-separated.

Respond in this exact format:
SUMMARY: <your summary here>
THEMES: <theme1>, <theme2>, <theme3>`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(summaryPrompt);
  const text = result.response.text();

  // Parse the response
  const summaryMatch = text.match(/SUMMARY:\s*(.+?)(?=THEMES:|$)/s);
  const themesMatch = text.match(/THEMES:\s*(.+)/s);

  const summary = summaryMatch ? summaryMatch[1].trim() : text.trim();
  const themes = themesMatch
    ? themesMatch[1]
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Store in MongoDB as a RAG document
  const stored = await ChatSummary.create({
    userId: session.userId,
    sessionId: session._id,
    moodContext: session.moodContext,
    summary,
    themes,
    messageCount: session.messages.length,
    sessionStartedAt: session.createdAt,
    sessionEndedAt: new Date(),
  });

  console.log(
    `[RAG] Session ${session._id} summarized and stored. Themes: ${themes.join(", ")}`,
  );
  return stored;
};

// ── 2. RETRIEVE relevant past summaries for the current session context ────────
export const retrieveRelevantContext = async (
  userId,
  currentMessage,
  currentMoodLabel,
) => {
  // Strategy: combine two retrieval approaches for better relevance
  // A) Mood-matching: past sessions with same/similar mood
  // B) Text search: summaries mentioning similar topics to current message

  const results = [];

  // A) Mood-similar sessions (same mood label or adjacent score range)
  const moodQuery = { userId };
  if (currentMoodLabel) {
    // Group moods into emotional families for smarter matching
    const moodGroups = {
      negative: ["very_sad", "sad", "anxious", "stressed"],
      positive: ["happy", "very_happy", "calm"],
      neutral: ["neutral"],
    };
    const currentGroup = Object.entries(moodGroups).find(([, moods]) =>
      moods.includes(currentMoodLabel),
    );
    if (currentGroup) {
      moodQuery["moodContext.label"] = { $in: currentGroup[1] };
    }
  }

  const moodMatches = await ChatSummary.find(moodQuery)
    .sort({ createdAt: -1 })
    .limit(MAX_RETRIEVED_SUMMARIES)
    .lean();

  results.push(...moodMatches);

  // B) Text search on summary content (if message has enough words)
  const words = currentMessage.trim().split(/\s+/);
  if (words.length >= 3) {
    try {
      const textMatches = await ChatSummary.find(
        {
          userId,
          $text: { $search: currentMessage },
          // Don't duplicate mood matches
          _id: { $nin: results.map((r) => r._id) },
        },
        { score: { $meta: "textScore" } },
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(2)
        .lean();

      results.push(...textMatches);
    } catch (_) {
      // Text search might fail if index not ready yet — that's fine
    }
  }

  // Deduplicate and limit
  const seen = new Set();
  const unique = results.filter((r) => {
    const id = r._id.toString();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return unique.slice(0, MAX_RETRIEVED_SUMMARIES);
};

// ── 3. FORMAT retrieved summaries into a context block for Gemini ──────────────
export const formatContextBlock = (summaries) => {
  if (!summaries || summaries.length === 0) return null;

  const blocks = summaries.map((s, i) => {
    const date = new Date(s.sessionStartedAt || s.createdAt).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
    const mood = s.moodContext?.label
      ? `${s.moodContext.label} (${s.moodContext.score}/10)`
      : "unknown mood";
    const themes = s.themes?.length ? s.themes.join(", ") : "general";

    return `[Past Session ${i + 1} — ${date} | Mood: ${mood} | Topics: ${themes}]
${s.summary}`;
  });

  return `RELEVANT PAST CONTEXT (from student's previous sessions):
${blocks.join("\n\n")}

Use this context to give more personalized and consistent support. Reference past discussions naturally when relevant.`;
};
