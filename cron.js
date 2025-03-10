import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import userRouter from "./routes/user.router.js";
import nodeCron from "node-cron";
import chalk from "chalk";
import moment from "moment-timezone";
import { CheckinMoods } from "./models/checkinmoods.js";

import { GenerateQuote } from "./controllers/user.controller.js";
import db from "./models/index.js";

import {
  getWeeklyDates,
  getJournalsInAWeek,
  GetSnapshotFromJournals,
  fetchWeeklySnapshots,
  GetFeelingsromGpt,
} from "./controllers/journal.controller.js";

// import plaidRouter from "./routes/plaid.router.js";
// import loanRouter from "./routes/loan.router.js";
// import houseRouter from "./routes/hosue.router.js";

import {
  verifyJwtToken,
  verifyJwtTokenOptional,
} from "./middleware/jwtmiddleware.js";

import dotenv from "dotenv";
import { RetrieveASubscriptions } from "./controllers/stripe.js";
import { SendAutoEmails } from "./controllers/AutoEmailController.js";
dotenv.config();

let number = 0; // "/2 * * * Monday"
//*/10 0-1 * * Sunday

//"*/30 0-20 * * 1" // actual
//'*/5 * * * *'
const job = nodeCron.schedule("*/50 0-4 * * 0,1,2,3", fetchWeeklySnapshots);

job.start();

//subscription updates
//Every two min '*/2 * * * *'
//Every 3 hours "0 */3 * * *"
// const jobSub = nodeCron.schedule("*/1 * * * *", async function GetSubUpdates(){

//   let subs = await db.subscriptionModel.findAll();
//   if(subs && subs.length > 0){
//     subs.forEach(async(item)=>{
//       let subid = item.subid;//subscription object id from stripe
//       let sub = JSON.parse(item.data)
//       let plan = sub.plan;
//       //console.log("Plan is ", plan)
//       if(plan.active){
//         //console.log("Plan is active")
//         let subscription = await RetrieveASubscriptions(subid)
//         item.data = JSON.stringify(subscription);
//         let saved = item.save();
//         if(saved){
//           //console.log("Sub updated", subscription)
//         }
//       }
//       else{
//         //console.log("Plan is inactive")
//       }

//     })
//   }

// })

// jobSub.start();

//run job to get Daily quotes
const quoteJob = nodeCron.schedule(
  "*/30 0-1 * * *",
  async function fetchPendingBankTransactions() {
    // const currentDate = new Date();
    let time = moment();
    ////console.log("Quote Crone Job Running at time ", time);
    GenerateQuote();
  }
);
// quoteJob.start();

//run job to get Daily quotes
//'0 0 1-7/2 * *' // every two weeks

let index = 0;
//runs on 1st and 15th of every month '0 2 1,15 * *'
// Every 2 min btw 0-2 am on 1st 15th and 30th '*/2 0-2 1,15,30 * *'
const moodJob = nodeCron.schedule(
  "0 2 1,15 * *",
  async function fetchPendingBankTransactions() {
    // const currentDate = new Date();
    let time = moment();
    //console.log("Mood Cron Job Running at time ", time);
    if (index === 0) {
      index += 1;
      ////console.log("Running api ")
      let moodKeys = [
        "Low energy, Pleasant",
        "High energy, Pleasant",
        "Low energy, Unpleasant",
        "High energy, Unpleasant",
      ];
      for (let i = 0; i < moodKeys.length; i++) {
        let mood = moodKeys[i];
        let feelings = await GetFeelingsromGpt(mood);
        //console.log("Feelings obtained ", feelings)
        if (feelings && feelings.length > 0) {
          //console.log("Adding feelings to db")
          await db.checkinMoodModel.destroy({
            where: {
              mood: mood,
            },
          });
          feelings.forEach(async (item) => {
            let saved = await db.checkinMoodModel.create({
              feeling: item.feeling,
              description: item.description,
              pronunciation: item.pronunciation,
              mood: mood,
            });
          });
        }

        // add to the database
      }
    } else {
    }
  }
);
moodJob.start();

const autoEmailCron = nodeCron.schedule("*/5 * * * *", SendAutoEmails);
autoEmailCron.start();
