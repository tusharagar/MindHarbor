import { google } from "googleapis";
import GoogleToken from "../../models/GoogleToken.js";

const TIMEZONE = "Asia/Kolkata";

// ── Create OAuth2 client from env vars ───────────────────────────────────────
export const createOAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI, // e.g. http://localhost:5000/api/planner/auth/google/callback
  );

// ── Generate Google OAuth consent URL ────────────────────────────────────────
export const getAuthUrl = () => {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // needed to get refresh_token
    prompt: "consent", // force consent screen so refresh_token is always returned
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });
};

// ── Exchange auth code for tokens, store in MongoDB ──────────────────────────
export const exchangeCodeAndSave = async (code, userId) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error(
      "No refresh token returned. Revoke app access at myaccount.google.com/permissions and retry.",
    );
  }

  // Upsert — one token doc per user
  await GoogleToken.findOneAndUpdate(
    { userId },
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      scope: tokens.scope,
      tokenType: tokens.token_type,
      expiryDate: tokens.expiry_date,
    },
    { upsert: true, new: true },
  );

  return tokens;
};

// ── Get a ready-to-use OAuth2 client for a user (handles token refresh) ──────
export const getAuthorizedClient = async (userId) => {
  const tokenDoc = await GoogleToken.findOne({ userId });
  if (!tokenDoc) {
    throw new Error(
      "Google account not connected. Please complete OAuth first.",
    );
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: tokenDoc.accessToken,
    refresh_token: tokenDoc.refreshToken,
    expiry_date: tokenDoc.expiryDate,
  });

  // Auto-refresh if expired
  if (tokenDoc.isExpired()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    // Persist the new access token (refresh token stays the same)
    await GoogleToken.findOneAndUpdate(
      { userId },
      {
        accessToken: credentials.access_token,
        expiryDate: credentials.expiry_date,
      },
    );
    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
};

// ── Insert all calendar events into user's primary Google Calendar ────────────
export const insertCalendarEvents = async (userId, calendarEvents) => {
  const auth = await getAuthorizedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const results = [];
  const errors = [];

  // Insert events sequentially to avoid rate limit issues
  for (const event of calendarEvents) {
    try {
      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
      results.push({
        eventId: res.data.id,
        summary: res.data.summary,
        htmlLink: res.data.htmlLink,
      });
    } catch (err) {
      console.error(`Failed to insert event "${event.summary}":`, err.message);
      errors.push({ summary: event.summary, error: err.message });
    }
  }

  return { inserted: results, failed: errors };
};

// ── Delete all previously synced events (for re-sync) ────────────────────────
export const deleteCalendarEvents = async (userId, eventIds) => {
  const auth = await getAuthorizedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const results = [];
  for (const eventId of eventIds) {
    try {
      await calendar.events.delete({ calendarId: "primary", eventId });
      results.push({ eventId, deleted: true });
    } catch (err) {
      results.push({ eventId, deleted: false, error: err.message });
    }
  }
  return results;
};
