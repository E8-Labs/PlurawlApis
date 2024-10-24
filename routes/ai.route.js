import express from "express";
const greetingRouter = express.Router();
import {
  verifyJwtToken,
  verifyJwtTokenOptional,
} from "../middleware/jwtmiddleware.js";

import {
  GenerateTwoWordTitle,
  GetQuoteForUser,
} from "../controllers/AIContentGenerationController.js";
// import { fetchWeeklySnapshots } from "../cron.js";

greetingRouter.get("/get_greetings", verifyJwtToken, GenerateTwoWordTitle);
greetingRouter.get("/get_quote_for_user", verifyJwtToken, GetQuoteForUser);

// journalRouter.get("/generate_snaps", fetchWeeklySnapshots);

export default greetingRouter;
