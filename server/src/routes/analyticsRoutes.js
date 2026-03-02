import { Router } from "express";
import { param } from "express-validator";
import {
  endSessionAndAnalyze,
  getAnalytics,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.post(
  "/sessions/:sessionId/end",
  param("sessionId").isMongoId().withMessage("Invalid session ID"),
  validate,
  endSessionAndAnalyze,
);

router.get("/", getAnalytics);

export default router;
