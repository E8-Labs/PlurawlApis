import express from "express";
const journalRouter = express.Router();
import {verifyJwtToken}  from "../middleware/jwtmiddleware.js";
import { AddJournal, GetJournals, GenerateListOfMoods, analyzeJournal } from "../controllers/journal.controller.js";



journalRouter.post("/add_journal", verifyJwtToken, AddJournal);
journalRouter.get("/get_user_journals", verifyJwtToken, GetJournals);
journalRouter.get("/get_moods_list", GenerateListOfMoods);



export default journalRouter;