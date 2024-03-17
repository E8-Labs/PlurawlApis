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

import { getWeeklyDates, getJournalsInAWeek, GetSnapshotFromJournals } from "./controllers/journal.controller.js";

// import plaidRouter from "./routes/plaid.router.js";
// import loanRouter from "./routes/loan.router.js";
// import houseRouter from "./routes/hosue.router.js";


import { verifyJwtToken } from "./middleware/jwtmiddleware.js";

import dotenv from 'dotenv'
dotenv.config();




let number = 0// "/2 * * * Monday"
//*/10 0-1 * * Sunday
async function fetchWeeklySnapshots() {
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

    // let created = await db.weeklySnapshotModel.findAll({
    //   where: {
    //     monday: dateSt1,
    //     sunday: dateSt2,
    //     year: year
    //   }
    // })
    // if(created && created.length > 0){
    //   return
    // }

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
        // console.log("Pushing uid dont exist already")
        users.push(uid)
        let t = `Date: ${j.createdAt} ${j.title} \n ${j.detail} \n Mood: ${j.mood} \nFeeling: ${j.feeling}`;
        snapshotText[`${uid}`] = t;
      }


      if (UserVibes.hasOwnProperty(`${uid}`)) {
        // console.log(`Key with UserId ${uid} exists.`);
        let ujs = UserVibes[`${uid}`]
        ujs.push(j)
        UserVibes[uid] = ujs


      } else {
        // console.log(`Key with UserId ${uid} does not exist.`);
        UserVibes[uid] = [j]
      }
    }
    console.log("Users ", users)
    // console.log("Generating Snapshot")
    if (users.length > 0) {
      // console.log("Generating Snapshot 2" )
      for (let i = 0; i < users.length; i++) {
        // console.log("Generating Snapshot loop ", i)
        let u = users[i]
        let t = snapshotText[`${u}`];
        
        let snapshot = await GetSnapshotFromJournals(t);

        // console.log("Snapshot generated is ", snapshot)
        try{
          

        if (snapshot !== "") {
          console.log("Valid Snapshot")
          let jsonSnap = JSON.parse(snapshot)
          // console.log(jsonSnap)
          let obj = {
            monday: dateSt1,
            sunday: dateSt2,
            mood: jsonSnap.mood,
            year: year,
            date: dateSt1Full + " - " + dateSt2Full,
            snapshot: jsonSnap.snapshot,
            tip: jsonSnap.tip,
            reflectionQuestion: jsonSnap.question,
            UserId: u
          }
          console.log("------------------------------------")
          console.log(chalk.yellow("Have Snapshot For User"))
          console.log(u)
          console.log("------------------------------------")

        db.weeklySnapshotModel.create(obj).then((result)=>{
          console.log("Saved Snapshot ")
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

};
const job = nodeCron.schedule("*/59 0-23 * * 0-6", fetchWeeklySnapshots)

// job.start();


//run job to get Daily quotes
const quoteJob = nodeCron.schedule("*/2 0-10 * * *", async function fetchPendingBankTransactions() {
  // const currentDate = new Date();
  let time = moment()
  console.log("Quote Crone Job Running at time ", time);
  GenerateQuote();
})
// quoteJob.start();

export {fetchWeeklySnapshots}
