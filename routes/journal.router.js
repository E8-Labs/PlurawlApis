import express from "express";
import multer from "multer";
const journalRouter = express.Router();

const uploadFiles = multer().fields([{ name: "media", maxCount: 10 }]);

import {
  verifyJwtToken,
  verifyJwtTokenOptional,
} from "../middleware/jwtmiddleware.js";
import {
  AddJournal,
  GetJournals,
  GenerateListOfMoods,
  AnalyzeJournal,
  GetCalendarEventPrompt,
  GetInsights,
  fetchWeeklySnapshots,
  fetchRecentJournals,
  GetLastJournal,
} from "../controllers/journal.controller.js";
// import { fetchWeeklySnapshots } from "../cron.js";

journalRouter.post("/add_journal", uploadFiles, verifyJwtToken, AddJournal);
journalRouter.get("/recent_journals", verifyJwtToken, fetchRecentJournals);
journalRouter.get("/get_user_journals", verifyJwtToken, GetJournals);
journalRouter.get(
  "/get_moods_list",
  verifyJwtTokenOptional,
  GenerateListOfMoods
);
journalRouter.post("/analyze_journal", verifyJwtTokenOptional, AnalyzeJournal);
journalRouter.get(
  "/get_calendar_prompt",
  verifyJwtTokenOptional,
  GetCalendarEventPrompt
);
journalRouter.get("/get_insights", verifyJwtToken, GetInsights);
journalRouter.get(
  "/run_snapshot_cron",
  verifyJwtTokenOptional,
  fetchWeeklySnapshots
);
journalRouter.get("/get_last_journal", verifyJwtToken, GetLastJournal);

// journalRouter.get("/generate_snaps", fetchWeeklySnapshots);

export default journalRouter;
