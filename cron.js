import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import userRouter from "./routes/user.router.js";
import nodeCron from "node-cron";
import chalk from "chalk";
import moment from "moment-timezone";

import { GenerateQuote } from "./controllers/user.controller.js";
import db from "./models/index.js";

import { getWeeklyDates, getJournalsInAWeek, GetSnapshotFromJournals, fetchWeeklySnapshots } from "./controllers/journal.controller.js";

// import plaidRouter from "./routes/plaid.router.js";
// import loanRouter from "./routes/loan.router.js";
// import houseRouter from "./routes/hosue.router.js";


import { verifyJwtToken } from "./middleware/jwtmiddleware.js";

import dotenv from 'dotenv'
dotenv.config();




let number = 0// "/2 * * * Monday"
//*/10 0-1 * * Sunday


//"*/30 0-20 * * 1" // actual
//'*/5 * * * *'
const job = nodeCron.schedule("*/10 0-1 * * 1", fetchWeeklySnapshots)

job.start();


//run job to get Daily quotes
const quoteJob = nodeCron.schedule("*/2 0-10 * * *", async function fetchPendingBankTransactions() {
  // const currentDate = new Date();
  let time = moment()
  console.log("Quote Crone Job Running at time ", time);
  GenerateQuote();
})
quoteJob.start();

// export {fetchWeeklySnapshots}
