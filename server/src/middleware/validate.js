import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

/**
 * Runs after express-validator rules.
 * Collects all validation errors and throws a single ApiError with all messages.
 */

const validate = validators => {
    return [
      ...validators,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({ error: errors.array() });
        next();
      },
    ];
};

export { validate };
