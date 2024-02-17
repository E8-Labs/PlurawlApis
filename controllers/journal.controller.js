import db from "../models/index.js";
import S3 from "aws-sdk/clients/s3.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import moment from "moment-timezone";

import CheckinMoods from "../models/checkinmoods.js";
// import { fetchOrCreateUserToken } from "./plaid.controller.js";
// const fs = require("fs");
// var Jimp = require("jimp");
// require("dotenv").config();
const User = db.user;
const Op = db.Sequelize.Op;


import UserRole from "../models/userrole.js";

import UserProfileFullResource from "../resources/userprofilefullresource.js";
import CheckInTypes from "../models/checkintype.js";

function addCheckin(data) {

    db.userCheckinModel.create(data).then(async (result) => {
        return result
    })
        .catch((error) => {
            console.log("Checkin using journal error ", error)
            return null
        })
}

export const AddJournal = async (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            let data = req.body;
            let user = authData.user;
            data.UserId = user.id;
            // data.cod = req.body.cd;
            try {
                db.userJournalModel.create(data).then((result) => {

                    if (req.body.save_as_checkin === true) {
                        let checkinData = {
                            mood: req.body.mood,
                            feeling: req.body.feeling,
                            description: req.body.description,
                            acronym: req.body.pronunciation,
                            UserId: user.id,
                            type: CheckInTypes.TypeJournal, // checkintypes
                            userJournalId: result.id
                        }

                        let added = addCheckin(checkinData);

                    }
                    res.send({ status: true, message: "Journal added", data: result })
                })
                    .catch((error) => {
                        res.send({ status: true, message: "Journal not added", data: error })
                    })
            }
            catch (error) {
                res.send({ status: true, message: "Journal not added", data: error })
            }
        }
        else {
            res.send({ status: true, message: "Unauthenticated user", data: null })
        }
    })

}




async function getJournalsInAWeek(lastMonday, lastSunday, userid) {


    // Query to retrieve data for the last week
    let checkins = await db.userJournalModel.findAll({
        where: {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: userid
        }
    })
    let dateSt1 = moment(lastMonday).format("MMM DD")
    let dateSt2 = moment(lastSunday).format("MMM DD")

    var lep = 0
    var hep = 0
    var leup = 0
    var heup = 0
    for (let i = 0; i < checkins.length; i++) {
        let cin = checkins[i];
        if (cin.mood === CheckinMoods.MoodHep) {
            hep = hep + 1
        }
        if (cin.mood === CheckinMoods.MoodLep) {
            lep = lep + 1
        }
        if (cin.mood === CheckinMoods.MoodLeup) {
            leup = leup + 1
        }
        if (cin.mood === CheckinMoods.MoodHeup) {
            heup = heup + 1
        }
    }

    var mostCheckedInMood = CheckinMoods.MoodHep;
    if (lep > hep && lep < leup && lep >> heup) {
        mostCheckedInMood = CheckinMoods.MoodLep;
    }
    else if (leup > hep && leup < lep && leup >> heup) {
        mostCheckedInMood = CheckinMoods.MoodLeup;
    }
    else if (heup > hep && heup < lep && heup >> leup) {
        mostCheckedInMood = CheckinMoods.MoodHeup;
    }


    var lastWeekVibe = {
        checkins: checkins, totalJournals: checkins.length, startDate: lastMonday, endDate: lastSunday, mostCheckedInMood: mostCheckedInMood,
        lep: lep, hep: hep, leup: leup, heup: heup, dateString: dateSt1 + " - " + dateSt2
    }
    // console.log("Vibe is ", lastWeekVibe)
    if(checkins.length == 0){
        return null
    }
    return lastWeekVibe
}
export const GetJournals = (req, res) => {
    const originalDate = new Date();
    const currentDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());

    // Calculate the start and end date of the last week
    let lastSunday = new Date(currentDate);
    lastSunday.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
    let lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);

    let dates = [{monday: lastMonday, sunday: lastSunday}]
    for(let i = 0; i < 30; i++){ // last 10 weeks
        let sunday = new Date(lastMonday)
        let monday = new Date(sunday)

        monday.setDate(sunday.getDate() - 6)

        lastSunday = sunday
        lastMonday = monday
        dates.push({monday: monday, sunday: sunday})
    }
    console.log("Total Dates ", dates);
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if(authData){
            let user = authData.user;
            let userid = user.id;
            var journals = []
            for(let i = 0; i < dates.length; i ++){
                let d = dates[i]
                let vibe = await getJournalsInAWeek(d.monday, d.sunday, user.id)
                if(vibe){
                    journals.push(vibe);
                }
            }

            res.send(journals)
        }
    })

}