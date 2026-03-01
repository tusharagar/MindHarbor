import StudyPlan from "../models/StudyPlan.js";
import GoogleToken from "../models/GoogleToken.js";
import { generateStudyPlan } from "../services/studyPlannerService.js";
import {
  getAuthUrl,
  exchangeCodeAndSave,
  insertCalendarEvents,
  deleteCalendarEvents,
} from "../services/googleCalendarService.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/planner/generate-plan
//  Body: { syllabusText, syllabusImageUrl?, totalDays, hoursPerDay, startDate }
// ─────────────────────────────────────────────────────────────────────────────
export const generatePlan = asyncHandler(async (req, res) => {
  const { syllabusText, syllabusImageUrl, totalDays, hoursPerDay, startDate } =
    req.body;

  if (!syllabusText?.trim())
    throw new ApiError(400, "syllabusText is required.");
  if (!totalDays || totalDays < 1)
    throw new ApiError(400, "totalDays must be at least 1.");
  if (!hoursPerDay || hoursPerDay < 1)
    throw new ApiError(400, "hoursPerDay must be at least 1.");
  if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    throw new ApiError(400, "startDate must be in YYYY-MM-DD format.");
  }

  const { studyPlan, flowchartMermaid, calendarEvents } =
    await generateStudyPlan({
      syllabusText: syllabusText.trim(),
      syllabusImageUrl: syllabusImageUrl || null,
      totalDays: Number(totalDays),
      hoursPerDay: Number(hoursPerDay),
      startDate,
    });

  // Persist in MongoDB
  const plan = await StudyPlan.create({
    userId: req.user._id,
    syllabusText: syllabusText.trim(),
    syllabusImage: syllabusImageUrl || null,
    totalDays: Number(totalDays),
    hoursPerDay: Number(hoursPerDay),
    startDate,
    studyPlan,
    flowchartMermaid,
    calendarEvents,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        planId: plan._id,
        studyPlan,
        flowchartMermaid,
        calendarEvents,
        totalEvents: calendarEvents.length,
      },
      "Study plan generated successfully.",
    ),
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/planner/auth/google
//  Redirects user to Google OAuth consent screen
// ─────────────────────────────────────────────────────────────────────────────
export const googleAuthRedirect = asyncHandler(async (req, res) => {
  // Embed userId in state param so we can link tokens to user after callback
  const state = Buffer.from(
    JSON.stringify({ userId: req.user._id.toString() }),
  ).toString("base64");
  const authUrl = getAuthUrl() + `&state=${encodeURIComponent(state)}`;
  res.redirect(authUrl);
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/planner/auth/google/callback
//  Google redirects here with ?code=...&state=...
// ─────────────────────────────────────────────────────────────────────────────
export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code, state, error } = req.query;

  if (error) throw new ApiError(400, `Google OAuth denied: ${error}`);
  if (!code) throw new ApiError(400, "Authorization code missing.");
  if (!state) throw new ApiError(400, "State parameter missing.");

  // Decode userId from state
  let userId;
  try {
    const decoded = JSON.parse(
      Buffer.from(decodeURIComponent(state), "base64").toString(),
    );
    userId = decoded.userId;
  } catch {
    throw new ApiError(400, "Invalid state parameter.");
  }

  await exchangeCodeAndSave(code, userId);

  // Redirect back to frontend with success flag
  return res.redirect(`${process.env.CLIENT_URL}/planner?googleConnected=true`);
});

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/planner/calendar/sync
//  Body: { planId } — inserts the plan's events into Google Calendar
// ─────────────────────────────────────────────────────────────────────────────
export const syncToCalendar = asyncHandler(async (req, res) => {
  const { planId } = req.body;
  if (!planId) throw new ApiError(400, "planId is required.");

  // Verify plan belongs to user
  const plan = await StudyPlan.findById(planId);
  if (!plan) throw new ApiError(404, "Study plan not found.");
  if (plan.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied.");
  }

  // Check Google is connected
  const tokenDoc = await GoogleToken.findOne({ userId: req.user._id });
  if (!tokenDoc) {
    throw new ApiError(
      401,
      "Google Calendar not connected. Visit /api/planner/auth/google first.",
    );
  }

  // If already synced before, delete old events first (clean re-sync)
  if (plan.syncedToCalendar && plan.calendarEventIds?.length) {
    await deleteCalendarEvents(req.user._id, plan.calendarEventIds);
  }

  // Insert all events
  const { inserted, failed } = await insertCalendarEvents(
    req.user._id,
    plan.calendarEvents,
  );

  // Save Google event IDs for future re-sync / deletion
  const eventIds = inserted.map((e) => e.eventId);
  await StudyPlan.findByIdAndUpdate(planId, {
    syncedToCalendar: true,
    calendarEventIds: eventIds,
    syncedAt: new Date(),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        planId,
        insertedCount: inserted.length,
        failedCount: failed.length,
        inserted,
        failed,
        calendarLink: "https://calendar.google.com/calendar/r",
      },
      `Synced ${inserted.length} events to Google Calendar.`,
    ),
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/planner/plans
//  List all plans for the logged-in user
// ─────────────────────────────────────────────────────────────────────────────
export const getPlans = asyncHandler(async (req, res) => {
  const plans = await StudyPlan.find({ userId: req.user._id })
    .select(
      "studyPlan.title totalDays hoursPerDay startDate syncedToCalendar syncedAt createdAt",
    )
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, plans, "Plans fetched."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/planner/plans/:planId
//  Get a single full plan
// ─────────────────────────────────────────────────────────────────────────────
export const getPlan = asyncHandler(async (req, res) => {
  const plan = await StudyPlan.findById(req.params.planId).lean();
  if (!plan) throw new ApiError(404, "Plan not found.");
  if (plan.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied.");
  }

  return res.status(200).json(new ApiResponse(200, plan, "Plan fetched."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/planner/google/status
//  Check if user has Google Calendar connected
// ─────────────────────────────────────────────────────────────────────────────
export const googleStatus = asyncHandler(async (req, res) => {
  const tokenDoc = await GoogleToken.findOne({ userId: req.user._id });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        connected: !!tokenDoc,
        connectedAt: tokenDoc?.createdAt || null,
      },
      "Google Calendar status.",
    ),
  );
});
