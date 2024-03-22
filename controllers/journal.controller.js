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
import JournalResource from "../resources/journal.resource.js";

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
            let chatid = req.body.chatid;

            let type = CheckInTypes.TypeJournal;
            if (typeof (req.body.type) !== 'undefined') {
                type = req.body.type;
            }
            let createdAt = moment()
            if (typeof (req.body.created_at) !== 'undefined') {
                createdAt = req.body.created_at
            }
            data.createdAt = createdAt
            data.updatedAt = createdAt
            console.log("Created at ", createdAt)
            // data.cod = req.body.cd;
            try {
                db.userJournalModel.create(data).then(async (result) => {

                    if (req.body.save_as_checkin === true) {
                        let checkinData = {
                            mood: req.body.mood,
                            feeling: req.body.feeling,
                            description: req.body.description,
                            acronym: req.body.pronunciation,
                            UserId: user.id,
                            type: type, // checkintypes
                            UserJournalId: result.id,
                            createdAt: createdAt,
                            updatedAt: createdAt
                        }

                        let added = addCheckin(checkinData);

                    }
                    if (result) {
                        // set Journal Id to chat.
                        if (typeof (req.body.chatid) !== 'undefined') {
                            let chat = await db.chatModel.findByPk(chatid)
                            chat.UserJournalId = result.id
                            let chatSaved = await chat.save();
                            console.log("Chat Saved ", chatSaved)
                        }
                    }
                    res.send({ status: true, message: "Journal added", data: result })
                })
                    .catch((error) => {
                        console.log(error)
                        res.send({ status: true, message: "Journal not added", data: error })
                    })
            }
            catch (error) {
                console.log("Try ", error)
                res.send({ status: true, message: "Journal not added", data: error })
            }
        }
        else {
            res.send({ status: true, message: "Unauthenticated user", data: null })
        }
    })

}


export const getJournalsInAWeek = async (lastMonday, lastSunday, userid = null, type = null) => {


    // Query to retrieve data for the last week
    let condition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        }
    }
    if (userid !== null) {
        if (type === null) { // if null then fetch all except drafts
            condition = {
                createdAt: {
                    [Op.between]: [lastMonday, lastSunday]
                },
                type: {
                    [Op.ne]: 'draft'
                },
                UserId: userid
            }
        }
        else { //if type is provided then only fetch that type | always drafts
            condition = {
                createdAt: {
                    [Op.between]: [lastMonday, lastSunday]
                },
                type: type,
                UserId: userid
            }
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
        },
        [Op.or]: [
            { type: { [Op.ne]: 'draft' } }, // type not equal to 'draft'
            { type: { [Op.is]: null } }     // type is NULL
          ],
    }
    let draftCondition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        },
        [Op.and]: [
            { type: { [Op.eq]: 'draft' } }, // type not equal to 'draft'
            { type: { [Op.not]: null } }     // type is not NULL
          ],
    }
    if (userid !== null) {
        condition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            [Op.or]: [
                { type: { [Op.ne]: 'draft' } }, // type not equal to 'draft'
                { type: { [Op.is]: null } }     // type is NULL
              ],
            UserId: userid
        }

        draftCondition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            [Op.and]: [
                { type: { [Op.eq]: 'draft' } }, // type not equal to 'draft'
                { type: { [Op.not]: null } }     // type is not NULL
              ],
            UserId: userid
        }
    }


    let journals = await db.userJournalModel.findAll({
        where: condition
    })
    // let journals = await JournalResource(js)

    let drafts = await db.userJournalModel.findAll({
        where: draftCondition
    })
    // let drafts = await JournalResource(dfs)
    let chatCondition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        },
    }
    if (userid !== null) {
        chatCondition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: userid
        }
    }

    //get chats in a week
    let chats = await db.chatModel.findAll({
        where: chatCondition
    })


    console.log("Chats", chats)

    let songsCondition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        },
    }
    if (userid !== null) {
        songsCondition = {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: userid
        }
    }

    //get chats in a week
    let songs = await db.spotifySongModel.findAll({
        where: songsCondition,
        limit: 5
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
    if (userid != null) {
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
        journals: journals, chats: chats, drafts: drafts, totalJournals: journals.length, startDate: lastMonday, endDate: lastSunday, mostCheckedInMood: mostCheckedInMood,
        lep: lep, hep: hep, leup: leup, heup: heup, dateString: dateSt1 + " - " + dateSt2, checkins: checkins, tracks: songs
    }
    
    console.log(chalk.red("Vibe is ", JSON.stringify(lastWeekVibe)))
    if (journals.length == 0 && drafts.length == 0) {
        return null
    }
    return lastWeekVibe
}

function generateWeeklyDates(numberOfWeeks = 30) {
    const dates = [];
    let currentDate = moment().startOf('week'); // Start from the beginning of the current week
    console.log("Start of current week date is ", currentDate)
    let m = currentDate.add(1, 'day')
    let s = moment()
    // dates.push({ monday: m.toDate(), sunday: s.toDate() })


    for (let i = 0; i < numberOfWeeks; i++) { // Generate dates for 4 weeks only
        // Calculate Monday and Sunday for each week
        let monday = currentDate.clone().startOf('isoWeek');
        // monday = monday.add(1, 'day')
        let sunday = currentDate.clone().endOf('isoWeek');

        // Add the dates to the array
        dates.push({ monday: monday.toDate(), sunday: sunday.toDate() });

        // Move to the next week
        currentDate = monday.subtract(1, 'day');
    }

    return dates; // Reverse the array to have the dates in chronological order
}

export const getWeeklyDates = (numberOfWeeks = 30) => {
    let weekdates = generateWeeklyDates(30);
// console.log(weekdates)
    return weekdates;
    const originalDate = new Date();
    const currentDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());
 //monday - sunday
    // Calculate the start and end date of the last week
    let lastSunday = new Date(currentDate); //current date
    // lastSunday.setDate(currentDate.getDate() - currentDate.getDay());
    let lastMonday = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate() - (currentDate.getDay() - 1));
    // lastMonday.setDate(lastSunday.getDate() - (currentDate.getDay() - 1));

    lastMonday.setUTCHours(0, 0, 0, 0)
    lastSunday.setUTCHours(23, 59, 59, 999)

    console.log("Current  ", currentDate.getDay())
    console.log("Last Sunday Date", lastSunday)
    console.log("Last Mon Date", lastMonday)
    // return
    let dates = []
    // if (lastSunday.getDate() !== currentDate.getDate) {
    //     let thisWeekMonday = new Date(lastMonday)

    //     thisWeekMonday.setDate(lastSunday.getDate() + 1) // get this ongoing week's monday
    //     thisWeekMonday.setUTCHours(0, 0, 0, 0)
    //     let todayDate = new Date()
    //     todayDate.setDate(thisWeekMonday.getDate() + 7)
    //     todayDate.setUTCHours(23, 59, 59, 999)
    //     console.log("This week is ongoing ", { monday: thisWeekMonday, sunday: todayDate })
    //     dates.push({ monday: thisWeekMonday, sunday: todayDate })
    // }

    dates.push({ monday: lastMonday, sunday: lastSunday })
    for (let i = 0; i < numberOfWeeks; i++) { // last 10 weeks
        
        let monday = new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate() - 7);
        let sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
        
        // lastMonday.setDate(lastMonday.getDate() - 7)
        // lastSunday.setDate(lastMonday.getDate() + 6)
        // lastSunday = sunday
        // lastMonday = monday
        monday.setUTCHours(1, 3, 0, 0)
        sunday.setUTCHours(23, 59, 59, 999)
        dates.push({ monday: monday, sunday: sunday })
        lastMonday = new Date(monday)
        lastSunday = new Date(sunday)
    }

    return dates;
}

export const GetJournals = (req, res) => {
    let dates = getWeeklyDates(30);
    const originalDate = new Date();
    const currentDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());
    // Calculate the start and end date of the last week
    let lastSunday = new Date(currentDate);
    lastSunday.setDate(currentDate.getDate() - currentDate.getDay());
    // dates.slice(0, 0, { monday: originalDate, sunday: lastSunday })
    console.log("Total Dates ", dates.length);
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            let user = authData.user;
            let userid = user.id;
            var journals = []
            for (let i = 0; i < dates.length; i++) {
                console.log("Fetching for date ", dates[i])
                let d = dates[i]
                let vibe = await getJournalsVibeInAWeek(d.monday, d.sunday, user.id)
                if (vibe) {
                    console.log("Vibe exists ")
                    let dateSt1 = moment(d.monday).format("MMM DD")
                    let dateSt2 = moment(d.sunday).format("MMM DD")
                    let year = moment(d.sunday).format("YYYY");
                    console.log("Searching for Snapshot ", year)
                    console.log(user.id)
                    console.log(dateSt1)
                    console.log(dateSt2)

                    let snapshot = await db.weeklySnapshotModel.findOne({
                        where: {
                            sunday: dateSt2,
                            monday: dateSt1,
                            year: year,
                            UserId: user.id,
                        }
                    })
                    vibe.snapshot = snapshot;
                    journals.push(vibe);
                }
                else{
                    console.log("Vibe doesn't exist ")
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
        The json object should be as follows. Also create a relfection question based on the summary of the week.
        {mood: High energy, Pleasant, snapshot: snapshot of the week goes here., tip: Tip for the week to improve my mood or any other suggestion in context of my journals. No more than 150 words, question: 20 words reflection question here}
        
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
    catch (error) {
        console.log("Exception gpt", error)
    }

    return ""
}




export const AnalyzeJournal = async (req, res) => {
    // setShowIndicator(true)
    let paragraph = req.body.paragraph;
    let text = `Depending on the following journal written by me give me the mood of the writer from one of these:  Moods: "High energy, Pleasant", "High energy, Unpleasant", "Low energy, Pleasant", "Low energy, unpleasant" And also give me a proper feeling in one word that best describes the paragraph and falls under the mood selected above. Also give me the acronym for this feeling and a little description describing the meaning of that word. Include how we can pronounce this feeling word as well. This is the paragraph: ${paragraph} Now give me a snapshot of the conversation which is a small description that tells how i am feeling and what is mood and energy is. Do mention the mood and feeling in the paragraph and give me appropriate information that i can use to highlight those words or sentences in the snapshot using react native.
    
    It should also provide me one of the following 7 cognitive distortions (CD). List of Cognitive distortions, Blame, Filtering, Polarized Thinking, Personalization, Fortune-Telling, Negative Emotional reasoning, 
    Also add the hightlight sentences for the snapshot separately. These should be to highlight words or sentences from the generated summary.
    Now the response should be a json object with the following keys: 
    
    {
        mood: Hight energy, Pleasant
        feeling: {
            title: Anxious,
            acronym: acronym here,
            description: Description goes here,
        pronunciation: “how to pronounce”
        },
        snapshot: Snapshot of the conversation,
        snapshotTextHighlights: [Array of words],
        cd: this is cognitive distortions,
        texthighlight:[
            // info about highlighting text here
        ],
    comments:"Further comments you want to add
    }

    in the texthighlight key, only give me a list(array of strings) of words and sentences that should be highlighted.
    Make sure that the response string is just a json object and no extra text. If you want to add additional info. Then add it inside the comment key in the json object. 
    `
    let messageData = []
    messageData.push({
        role: "user",
        content: text,
    })

    const APIKEY = process.env.AIKey;
    // console.log(APIKEY)
    // console.log(messageData)
    const headers = {}
    const data = {
        model: "gpt-4-1106-preview",
        messages: messageData,
        // max_tokens: 1000,
    }

    try {
        console.log("Creating snapshot")
        const result = await axios.post("https://api.openai.com/v1/chat/completions", data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${APIKEY}`
            }
        });

        // console.log("Api result is ", result)
        if (result.status === 200) {
            let gptMessage = result.data.choices[0].message.content;
            gptMessage = gptMessage.replace('```', '');
            gptMessage = gptMessage.replace('json', '');
            gptMessage = gptMessage.replace('```', '');
            // console.log("GPT Response is  ", gptMessage)
            let json = JSON.parse(gptMessage)
            console.log("Json obejct is ", json)
            res.send({ status: true, data: json, message: "Snapshot" })
            // return gptMessage;
        }
        else {
            res.send({ status: false, message: "Snapshot not obtained", data: null })
        }
    }
    catch (error) {
        res.send({ status: false, message: "snapshot exception", data: error })
    }

}


export const GenerateListOfMoods = async (req, res) => {
    console.log("Fetching moods from gpt")
    let userMood = req.query.mood
    let messageData = [];
    messageData.push({
        role: "user",
        content: `Generate me a list of 10 single word moods that fall under this category. Category: ${userMood}.
        Make sure the list is a javascript object list and there is nothing extra on the list so that i can parse it easily in the code. 
Each javascript object should consist of the following keys:
{
feeling: "feeling for the category goes here",
"description": "description of the feeling word",
pronunciation: "How to pronounce the word"
}  Just give me a json object and no extra text out of the json object so that i can parse it to json in code .Don't add any extra text other than the json object.` // this data is being sent to chatgpt so only message should be sent
    });
    const APIKEY = process.env.AIKey;
    // console.log(APIKEY)
    // console.log(messageData)
    const headers = {}
    const data = {
        model: "gpt-4-1106-preview",
        messages: messageData,
        // max_tokens: 1000,
    }
    try {
        const result = await axios.post("https://api.openai.com/v1/chat/completions", data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${APIKEY}`
            }
        });

        console.log("Api result is ", result)
        if (result.status === 200) {
            let gptMessage = result.data.choices[0].message.content;
            gptMessage = gptMessage.replace('```', '');
            gptMessage = gptMessage.replace('json', '');
            gptMessage = gptMessage.replace('```', '');
            console.log("List of moods is ", gptMessage)
            let listOfMoods = JSON.parse(gptMessage)
            // setMoods(listOfMoods)
            // setShowIndicater(false)
            console.log("Moods array is ", listOfMoods)
            res.send({ status: true, message: "Moods", data: listOfMoods })
            // return gptMessage;
        }
        else {
            res.send({ status: false, message: "Moods", data: null })
        }
    }
    catch (error) {
        console.log("Exception in open ai call ", error)
        res.send({ status: false, message: "Moods", data: error })
    }
}


export const GetCalendarEventPrompt = async (req, res) => {

    let text = "Generate a motivational prompt from the following list of events from my calendar that tells me to get ready for the upcoming meetings and events. Response should be a string and it should only contain 100 characters of text from the above events summary."
    if (typeof (req.query.eventTitle) !== 'undefined') {
        //   text = `Generate a motivational prompt from the following list of events from my calendar that tells me to get ready for the upcoming meetings and events, 
        // Event Title : ${event[0].title} at ${event[0].startDate}
        // Notes: ${event[0].notes}.

        // Response should be a string and it should only contain 100 characters of text from the above events summary.
        // Don't include any extra text. The prompt should be 100 characters.`



        text = `Use the calendar event “${req.query.eventTitle}” to generate positive affirmations for the user. The output should be no more than X number of characters. For example, if the event name is “Product Demo with Shawn” create positive affirmations like the following:

    “You got this! “Event Name” coming up soon” 
    
    “Breath to prep for “event name”
    
    "Ace it at 'Product Demo with Shawn'!"
    (Under 75 characters)
    "You're ready! 'Product Demo with Shawn' will be great."
    
    Response should be a string and it should only contain 100 characters of text from the above events summary.
    Don't include any extra text. The prompt should not exceed 150 characters at max.
    `
    }
    let messageData = []
    messageData.push({
        role: "user",
        content: text,
    })

    const APIKEY = process.env.AIKey;
    // console.log(APIKEY)
    // console.log(messageData)
    const data = {
        model: "gpt-4-1106-preview",
        messages: messageData,
        // max_tokens: 1000,
    }

    try {
        console.log("Creating snapshot")
        const result = await axios.post("https://api.openai.com/v1/chat/completions", data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${APIKEY}`
            }
        });

        // console.log("Api result is ", result)
        if (result.status === 200) {
            let gptMessage = result.data.choices[0].message.content;
            // gptMessage = gptMessage.replace('```json', '');
            // gptMessage = gptMessage.replace('json', '');
            // gptMessage = gptMessage.replace('```', '');
            console.log("GPT Response is  ", gptMessage)
            res.send({ data: gptMessage, status: true, message: "Prompt generated" });

            // return gptMessage;
        }
        else {
            console.log("error message in open ai call ", json.messsage)
            res.send({ data: "", status: false, message: "Prompt not generated" });
        }
    }
    catch (error) {
        res.send({ data: "", status: false, message: "Prompt not generated", error: error });
        console.log("Exception in open ai call ", error)
    }
};





export const GetInsights = (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            let user = authData.user;
            console.log("Getting insights for user ", user.name);
            //get data for the last month for now
            getCheckinsForLast60Days(user).then(dateCheckins => {
                console.log(dateCheckins); // Output the result
                let hep = 0;
                let lep = 0;
                let heup = 0;
                let leup = 0;

                for (let i = 0; i < dateCheckins.length; i++) {
                    let chkin = dateCheckins[i];
                    let checkins = chkin.checkins;
                    if (checkins.length > 0) {
                        for (let j = 0; j < checkins.length; j++) {
                            let item = checkins[j];
                            if (item.mood === CheckinMoods.MoodHep) {
                                hep = hep + 1
                            }
                            if (item.mood === CheckinMoods.MoodLep) {
                                lep = lep + 1
                            }
                            if (item.mood === CheckinMoods.MoodLeup) {
                                leup = leup + 1
                            }
                            if (item.mood === CheckinMoods.MoodHeup) {
                                heup = heup + 1
                            }
                        }
                    }
                }

                let totalMoods = lep + leup + hep + heup;


                res.send({ data: { checkins: dateCheckins, total: totalMoods, lep: lep / totalMoods * 100, hep: hep / totalMoods * 100, leup: leup / totalMoods * 100, heup: heup / totalMoods * 100, }, status: true, message: "Data obtained" });
            }).catch(error => {
                console.error('Error fetching check-ins:', error);
                res.send({ data: null, status: false, message: "Some error", error: error });
            });

        }
        else {
            res.send({ data: null, status: false, message: "Unauthorized access" });
        }
    })
}



async function getCheckinsForLast60Days(user) {
    const dateCheckins = []; // Array to hold the check-ins for each date

    // Generate dates for the last 30 days
    for (let i = 0; i < 60; i++) {
        const date = moment().subtract(i, 'days').format('YYYY-MM-DD'); // Get date i days ago
        const startDate = moment(date).startOf('day').toDate(); // Start of day
        const endDate = moment(date).endOf('day').toDate(); // End of day

        // Fetch check-ins for the current date
        const checkins = await db.userCheckinModel.findAll({
            where: {
                createdAt: {
                    [db.Sequelize.Op.gte]: startDate,
                    [db.Sequelize.Op.lt]: endDate
                },
                UserId: user.id
            }
        });

        // Store the date and its check-ins in the array
        dateCheckins.push({
            date,
            checkins
        });
    }

    return dateCheckins; // Return the array of dates and their corresponding check-ins
}

// Call the function and handle the promise as needed




// Cron Job 
function getMDDateFormat(date) {
    //2024-03-18T19:00:00.000Z
    console.log("COnverting date ", date)
    const month = date.getMonth(); // Month starts from 0, so add 1 to get the correct month
    const day = date.getUTCDate();
  
    const formattedDay = day < 10 ? '0' + day : day;
  
    // Construct the MM dd string
    // const formattedDate = formattedMonth + ' ' + formattedDay;
    let Months = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    console.log("Here now", day)
    let d = Months[month] + " " + formattedDay
    console.log("Formated ", d)
    return d
  }
  
  function getMDYDateFormat(date) {
    //2024-03-18T19:00:00.000Z
    console.log("COnverting date ", date)
    const month = date.getMonth(); // Month starts from 0, so add 1 to get the correct month
    const day = date.getUTCDate();
    const year = date.getYear();
  
    const formattedDay = day < 10 ? '0' + day : day;
  
    // Construct the MM dd string
    // const formattedDate = formattedMonth + ' ' + formattedDay;
    let Months = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    console.log("Here now", day)
    let d = Months[month] + " " + formattedDay + " " + year
    console.log("Formated ", d)
    return d
  }
  export async function fetchWeeklySnapshots() {
    // Download the latest info on the transactions and update database accordingly
    console.log(chalk.green("generate context here "));
    // return
    let lastTwoWeekDates = getWeeklyDates(2);
    console.log("Dates ")
    // return
    console.log(lastTwoWeekDates)
    // return
    for (let i = 0; i < lastTwoWeekDates.length; i++) {
      let d = lastTwoWeekDates[i];
      // console.log("Dates ", d)
      let dateSt1Full = ""
      let dateSt2Full = ""
      let year = ""
      let m = moment(d.monday)
      let s = moment(m.sunday)
      try {
        dateSt1Full = getMDYDateFormat(d.monday)//m.format("MMM DD YYYY")
        dateSt2Full = getMDYDateFormat(d.sunday)//s.format("MMM DD YYYY")
  
        year = m.format("YYYY")
      }
      catch (error) {
        console.log("Exception ", error)
      }
  
      let dateSt1 = getMDDateFormat(d.monday)//m.format("MMM DD")
      let dateSt2 = getMDDateFormat(d.sunday)//s.format("MMM DD")
      console.log("#################################################################")
      console.log("Converting date ", { monday: d.monday, sunday: d.sunday })
      console.log(`M ${dateSt1} - S ${dateSt2}`)
      console.log("#################################################################")
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
    }//for loop ends here
    // number = number + 5;
  
  };