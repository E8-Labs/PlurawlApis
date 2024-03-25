import db from "../models/index.js";
import CheckInTypes from "../models/checkintype.js";
import {CheckinMoods, GenerateRandomGif} from "../models/checkinmoods.js";
import { getJournalsInAWeek, getWeeklyDates } from "../controllers/journal.controller.js";

import moment from "moment-timezone";
// import LoanStatus from "../../models/loanstatus.js";
// import PlaidTokenTypes from "../../models/plaidtokentypes.js";
// import UserLoanFullResource from "../loan/loan.resource.js";
const Op = db.Sequelize.Op;

const UserProfileFullResource = async (user, currentUser = null) => {
    if (!Array.isArray(user)) {
        //console.log("Not array")
        return await getUserData(user, currentUser);
    }
    else {
        //console.log("Is array")
        const data = []
        for (let i = 0; i < user.length; i++) {
            const p = await getUserData(user[i], currentUser)
            //console.log("Adding to index " + i)
            data.push(p);
        }

        return data;
    }
}

async function getUserData(user, currentUser = null) {


    let checkin = await db.userCheckinModel.findOne({
        where: {
            UserId: user.id,
            type: CheckInTypes.TypeManual
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    });

    let today = moment().format("DD MM YYYY");
    let quote = await db.dailyQuoteModel.findOne({
        where: {
            date: today
        }
    })


    const originalDate = new Date();
    const currentDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());

    // Calculate the start and end date of the last week
    const lastSunday = new Date(currentDate);
    console.log(`Date Calc${currentDate.getDate()} - ${currentDate.getDay()}`);
    lastSunday.setDate(currentDate.getDate() - (currentDate.getDay()));
    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);
    console.log("Last Sunday is ", lastSunday)
    console.log("Last Monday is ", lastMonday)

    let journals = await getJournalsInAWeek(lastMonday, lastSunday, user.id)

    // Query to retrieve data for the last week
    let checkins = await db.userCheckinModel.findAll({
        where: {
            createdAt: {
                [Op.between]: [lastMonday, lastSunday]
            },
            UserId: user.id
        }
    })
    // .then((result) => {
    //     console.log(result);
    //     checins = result;
    // }).catch((error) => {
    //     console.error('Error retrieving data:', error);
    // });
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
    let gif = GenerateRandomGif(mostCheckedInMood)

    let songsCondition = {
        createdAt: {
            [Op.between]: [lastMonday, lastSunday]
        },
        UserId: user.id
    }
    let songs = await db.spotifySongModel.findAll({
        where: songsCondition,
        limit: 5
    })


    var lastWeekVibe = null
    if (journals.length > 0 || checkins.length > 0) {
        lastWeekVibe = {
            checkins: [], journals: journals, startDate: lastMonday, endDate: lastSunday, mostCheckedInMood: mostCheckedInMood,
            lep: lep, hep: hep, leup: leup, heup: heup, dateString: dateSt1 + " - " + dateSt2, gif: gif, tracks: songs
        }

        let year = moment(lastSunday).format("YYYY");
        console.log(`FInding ${year} ${dateSt2} ${dateSt1}`)
        let snapshot = await db.weeklySnapshotModel.findOne({
            where: {
                sunday: dateSt2,
                monday: dateSt1,
                year: year,
                UserId: user.id,
            }
        })
        lastWeekVibe.snapshot = snapshot;
    }

let haveJournals = false
let myJournals = await db.userJournalModel.findAll({
    where: {
        UserId: user.id
    }
})
console.log("Have Journals ", myJournals)
if(myJournals){
    if(myJournals.length > 0){
        haveJournals = true;
    }
}


    const UserFullResource = {
        id: user.id,
        name: user.firstname,
        profile_image: user.profile_image,
        email: user.email,
        name: user.name,
        state: user.state,
        role: user.role,
        city: user.city,
        company: user.company,
        industry: user.industry,
        title: user.title,
        race: user.race,
        lgbtq: user.lgbtq,
        gender: user.gender,
        veteran: user.veteran,
        provider_id: user.provider_id,
        provider_name: user.provider_name,
        points: user.points,
        lastcheckin: checkin,
        lastWeekVibe: lastWeekVibe,
        quote_of_day: quote,
        have_journals: haveJournals,
    }


    return UserFullResource;
}

export default UserProfileFullResource;