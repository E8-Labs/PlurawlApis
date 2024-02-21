import db from "../models/index.js";
import S3 from "aws-sdk/clients/s3.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import axios from "axios";

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
import chalk from "chalk";

function addCheckin(data) {

    db.userCheckinModel.create(data).then(async (result) => {
        return result
    })
        .catch((error) => {
            // console.log("Checkin using journal error ", error)
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
                            UserJournalId: result.id
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


export const getJournalsInAWeek = async (lastMonday, lastSunday, userid = null) => {


    // Query to retrieve data for the last week
    let condition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        }
    }
    if (userid !== null) {
        condition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: userid
        }
    }


    let journals = await db.userJournalModel.findAll({
        where: condition
    })



    return journals
}

export const getJournalsVibeInAWeek = async (lastMonday, lastSunday, userid = null) => {


    // Query to retrieve data for the last week
    let condition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        }
    }
    if (userid !== null) {
        condition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: userid
        }
    }


    let journals = await db.userJournalModel.findAll({
        where: condition
    })
    let dateSt1 = moment(lastMonday).format("MMM DD")
    let dateSt2 = moment(lastSunday).format("MMM DD")

    var lep = 0
    var hep = 0
    var leup = 0
    var heup = 0
    for (let i = 0; i < journals.length; i++) {
        let cin = journals[i];
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


    let checkinCondition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        },
    }
    if(userid != null){
        checkinCondition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: userid,
        }
    }
    let checkins = await db.userCheckinModel.findAll({
        where: checkinCondition
    })


    var lastWeekVibe = {
        journals: journals, totalJournals: journals.length, startDate: lastMonday, endDate: lastSunday, mostCheckedInMood: mostCheckedInMood,
        lep: lep, hep: hep, leup: leup, heup: heup, dateString: dateSt1 + " - " + dateSt2, checkins: checkins
    }
    // console.log("Vibe is ", lastWeekVibe)
    // if (journals.length == 0) {
    //     return null
    // }
    return lastWeekVibe
}


export const getWeeklyDates = (numberOfWeeks = 30) => {
    const originalDate = new Date();
    const currentDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());

    // Calculate the start and end date of the last week
    let lastSunday = new Date(currentDate);
    lastSunday.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
    let lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);

    let dates = [{ monday: lastMonday, sunday: lastSunday }]
    for (let i = 0; i < numberOfWeeks; i++) { // last 10 weeks
        let sunday = new Date(lastMonday)
        let monday = new Date(sunday)

        monday.setDate(sunday.getDate() - 6)

        lastSunday = sunday
        lastMonday = monday
        dates.push({ monday: monday, sunday: sunday })
    }

    return dates;
}

export const GetJournals = (req, res) => {
    let dates = getWeeklyDates(30);
    console.log("Total Dates ", dates);
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            let user = authData.user;
            let userid = user.id;
            var journals = []
            for (let i = 0; i < dates.length; i++) {
                let d = dates[i]
                let vibe = await getJournalsVibeInAWeek(d.monday, d.sunday, user.id)
                if (vibe) {
                    let dateSt1 = moment(d.monday).format("MMM DD")
                    let dateSt2 = moment(d.sunday).format("MMM DD")
                    let year = moment(d.sunday).format("YYYY");
                    console.log("Searching for Snapshot ", year)
                    console.log(user.id)
                    console.log(dateSt1)
                    console.log(dateSt2)

                    let snapshot = await db.weeklySnapshotModel.findOne({
                        where:{
                            sunday: dateSt2,
                            monday: dateSt1,
                            year: year,
                            UserId: user.id,
                        }
                    })
                    vibe.snapshot = snapshot;
                    journals.push(vibe);
                }
            }

            res.send({ status: true, message: "Weekly vibes", data: journals })
        }
    })

}


export const GetSnapshotFromJournals = async (text) => {
    console.log("In GetSnapshptFromJournals Method")
    // let gptMe = "{\n  \"mood\": \"Low energy, Pleasant\",\n  \"snapshot\": \"Over the past week, I have been grappling with feelings of doubt and anxiety about my tech project. Despite receiving positive feedback and even having companies pay for my work, the launch of a similar product by Apple and the dominance of companies like Calm and Headspace in the market have left me questioning my ability to compete. The critical inner voice has been persistent, undermining my confidence and making me fear that no one will download my app. Nonetheless, there's a part of me that yearns to shift to a positive mindset and to see myself as confident and capable, as a thought leader in my field. Amidst these conflicting emotions, there remains an undercurrent of bliss, possibly reflecting the intrinsic satisfaction I get from working on this project despite the external doubts.\"\n}"
    // gptMe = gptMe.replace(new RegExp("\n", 'g'), '');
    // return gptMe
// console.log("creating snapshot for text " + text)

    let messageData = []
    // console.log("Sending this summary to api ", summary);
    messageData.push({
        role: "system",
        content: `You're a helpful assistant. Create a snapshot of my journals that i am providing for the past week. Provide a weekly summary of my journal, my mood, how i was feeling
        Provide the mood from one of the followings.
        Moods: High energy, Pleasant or High energy, Unpleasant or Low energy, Pleasant or Low energy, Unpleasant.
        
        Give the response in a json object. The response should not contain any piece of text other than the json object itself.
        The json object should be as follows. 
        {mood: High energy, Pleasant, snapshot: snapshot of the week goes here.}
        
        The weekly journals are as below. Don't include any word like json or anything like that.
        ${text}`, // summary will go here if the summary is created.

    });

    //   messageData.push({
    //     role: "user",
    //     content: message // this data is being sent to chatgpt so only message should be sent
    //   });
    let APIKEY = process.env.AIKey;
    // APIKEY = "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"
    console.log(APIKEY)
    const headers = {}
    const data = {
        model: "gpt-4-1106-preview",
        // temperature: 1.2,
        messages: messageData,
        // max_tokens: 1000,
    }
    // setMessages(old => [...old, {message: "Loading....", from: "gpt", id: 0, type: MessageType.Loading}])
    try {
        const result = await axios.post("https://api.openai.com/v1/chat/completions", data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${APIKEY}`
            }
        });
        // console.log(result.data.data)
        if (result.status === 200) {
            let gptMessage = result.data.choices[0].message.content;
             gptMessage = gptMessage.replace(new RegExp("```json", 'g'), '');
             gptMessage = gptMessage.replace(new RegExp("```", 'g'), '');
             gptMessage = gptMessage.replace(new RegExp("\n", 'g'), '');
            console.log(chalk.green(JSON.stringify(gptMessage)))
            // return ""
            return gptMessage
        }
        else {
            console.log(chalk.red("Error in gpt response"))
            return ""
        }
    }
    catch(error){
        console.log("Exception gpt", error )
    }

    return ""
}