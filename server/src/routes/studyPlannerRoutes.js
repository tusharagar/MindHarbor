import { Router } from "express";
import { body, param } from "express-validator";

import {
  generatePlan,
  googleAuthRedirect,
  googleAuthCallback,
  syncToCalendar,
  getPlans,
  getPlan,
  googleStatus,
} from "../controllers/studyPlannerController.js";

import { protect } from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// ── Generate Plan (protected) ─────────────────────────────────────────────────
// POST /api/planner/generate-plan
router.post(
  "/generate-plan",
  protect,
  [
    body("syllabusText")
      .trim()
      .notEmpty()
      .withMessage("syllabusText is required"),
    body("totalDays")
      .isInt({ min: 1, max: 365 })
      .withMessage("totalDays: 1–365"),
    body("hoursPerDay")
      .isFloat({ min: 0.5, max: 16 })
      .withMessage("hoursPerDay: 0.5–16"),
    body("startDate")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("startDate must be YYYY-MM-DD"),
    body("syllabusImageUrl")
      .optional()
      .isURL()
      .withMessage("Invalid image URL"),
  ],
  validate,
  generatePlan,
);

// ── Google OAuth (protected — user must be logged in to link their calendar) ──

// GET /api/planner/auth/google  →  redirect to Google consent screen
router.get("/auth/google", protect, googleAuthRedirect);

// GET /api/planner/auth/google/callback  →  Google redirects here (no protect — no cookie yet)
router.get("/auth/google/callback", googleAuthCallback);

// GET /api/planner/google/status  →  is Google Calendar connected?
router.get("/google/status", protect, googleStatus);

// ── Calendar Sync (protected) ─────────────────────────────────────────────────
// POST /api/planner/calendar/sync
router.post(
  "/calendar/sync",
  protect,
  body("planId").isMongoId().withMessage("Invalid planId"),
  validate,
  syncToCalendar,
);

// ── Plan CRUD ─────────────────────────────────────────────────────────────────

// GET /api/planner/plans
router.get("/plans", protect, getPlans);

// GET /api/planner/plans/:planId
router.get(
  "/plans/:planId",
  protect,
  param("planId").isMongoId().withMessage("Invalid planId"),
  validate,
  getPlan,
);

export default router;
