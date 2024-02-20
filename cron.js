import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import userRouter from "./routes/user.router.js";
import nodeCron from "node-cron";
import chalk from "chalk";
import moment from "moment-timezone";

import { GenerateQuote } from "./controllers/user.controller.js";

import { getWeeklyDates, getJournalsInAWeek, GetSnapshotFromJournals } from "./controllers/journal.controller.js";

// import plaidRouter from "./routes/plaid.router.js";
// import loanRouter from "./routes/loan.router.js";
// import houseRouter from "./routes/hosue.router.js";


import { verifyJwtToken } from "./middleware/jwtmiddleware.js";

import dotenv from 'dotenv'
dotenv.config();




let number = 0// "/2 * * * Monday"
//*/10 0-1 * * Sunday
const job = nodeCron.schedule("*/10 0-2 * * Sunday", async function fetchPendingBankTransactions() {
  // Download the latest info on the transactions and update database accordingly
  console.log(chalk.green("generate context here "));
  // return
  let lastTwoWeekDates = getWeeklyDates(2);
  console.log(lastTwoWeekDates)
  for (let i = 0; i < lastTwoWeekDates.length; i++) {
    let d = lastTwoWeekDates[i];
    // console.log("Dates ", d)
    let dateSt1Full = ""
    let dateSt2Full = ""
    let year = ""
    try {
      dateSt1Full = moment(d.monday).format("MMM DD YYYY")
      dateSt2Full = moment(d.sunday).format("MMM DD YYYY")

      year = moment(d.sunday).format("YYYY")
    }
    catch (error) {
      console.log("Exception ", error)
    }

    let dateSt1 = moment(d.monday).format("MMM DD")
    let dateSt2 = moment(d.sunday).format("MMM DD")

    //get users who have created a journal in the past week
    let UserVibes = {}
    let snapshotText = {} // for every user
    let journals = await getJournalsInAWeek(d.monday, d.sunday, null)
    let users = []
    // console.log("Journals ", journals.length)
    for (let i = 0; i < journals.length; i++) {
      let j = journals[i];
      let uid = j.UserId;
      
      if (snapshotText.hasOwnProperty(`${uid}`)) {
        let t = snapshotText[`${uid}`];
        t = `${t} \n Date: ${j.createdAt} ${j.title} \n ${j.detail} \n Mood: ${j.mood} \nFeeling: ${j.feeling}`;
        snapshotText[`${uid}`] = t;
      }
      else {
        users.push(uid)
        let t = `Date: ${j.createdAt} ${j.title} \n ${j.detail} \n Mood: ${j.mood} \nFeeling: ${j.feeling}`;
        snapshotText[`${uid}`] = t;
      }


      if (UserVibes.hasOwnProperty(`${uid}`)) {
        console.log(`Key with UserId ${uid} exists.`);
        let ujs = UserVibes[`${uid}`]
        ujs.push(j)
        UserVibes[uid] = ujs


      } else {
        console.log(`Key with UserId ${uid} does not exist.`);
        UserVibes[uid] = [j]
      }
    }

    console.log("Generating Snapshot")
    if (users.length > 0) {
      console.log("Generating Snapshot 2" )
      for (let i = 0; i < users.length; i++) {
        console.log("Generating Snapshot loop ", i)
        let u = users[i]
        let t = snapshotText[`${u}`];
        
        let snapshot = await GetSnapshotFromJournals(t);

        // console.log("Snapshot generated is ", snapshot)
        try{
          

        if (snapshot !== "") {
          console.log("Valid Snapshot")
          let jsonSnap = JSON.parse(snapshot)
          let obj = {
            monday: dateSt1,
            sunday: dateSt2,
            mood: jsonSnap.mood,
            year: year,
            date: dateSt1Full + " - " + dateSt2Full,
            snapshot: jsonSnap.snapshot,
            UserId: u
          }
          console.log(chalk.yellow("Have Snapshot"))
          // console.log(JSON.stringify(obj))

        db.weeklySnapshotModel.create(obj).then((result)=>{
          console.log("Saved Snapshot ", result)
        })
        .catch((error)=>{
          console.log("Error creating DB Snapshot ", error)
        })
        }
        
        }
        catch(error){
          console.log("Exception Parse ", error)
        }
      }
    }
    // console.log("User Vibes ")
    // console.log(JSON.stringify(UserVibes))


    // console.log(chalk.yellow("for week "));
    // console.log(chalk.yellow(JSON.stringify(d)));



    //get the journals of this week.
  }
  number = number + 5;

});

job.start();


//run job to get Daily quotes
const quoteJob = nodeCron.schedule("*/2 0-2 * * *", async function fetchPendingBankTransactions() {
  // const currentDate = new Date();
  let time = moment()
  console.log("Quote Crone Job Running at time ", time);
  GenerateQuote();
})
quoteJob.start();


