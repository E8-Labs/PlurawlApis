import db from "../models/index.js";
import CheckInTypes from "../models/checkintype.js";
import CheckinMoods from "../models/checkinmoods.js";

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

    // let houses = await db.HouseModel.findOne({where: {
    //     UserId: user.id,
    // }});


    // let currentAciveLoan = await db.LoanModel.findOne({where: {
    //     loan_status:{
    //         [Op.or]: [LoanStatus.StatusApproved, LoanStatus.StatusPending]
    //     }
    // }})
    // let loanRes = null
    // if(currentAciveLoan){
    //     loanRes = await UserLoanFullResource(currentAciveLoan)
    // }

    //last week vibe
    // Get the current date
    const originalDate = new Date();
    const currentDate = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());

// Calculate the start and end date of the last week
const lastSunday = new Date(currentDate);
lastSunday.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
const lastMonday = new Date(lastSunday);
lastMonday.setDate(lastSunday.getDate() - 6);

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
    for(let i = 0; i < checkins.length; i++){
        let cin = checkins[i];
        if(cin.mood === CheckinMoods.MoodHep){
            hep = hep + 1
        }
        if(cin.mood === CheckinMoods.MoodLep){
            lep = lep + 1
        }
        if(cin.mood === CheckinMoods.MoodLeup){
            leup = leup + 1
        }
        if(cin.mood === CheckinMoods.MoodHeup){
            heup = heup + 1
        }
    }

    var mostCheckedInMood = CheckinMoods.MoodHep;
    if(lep > hep && lep < leup && lep >> heup){
        mostCheckedInMood = CheckinMoods.MoodLep;
    }
    else if(leup > hep && leup < lep && leup >> heup){
        mostCheckedInMood = CheckinMoods.MoodLeup;
    }
    else if(heup > hep && heup < lep && heup >> leup){
        mostCheckedInMood = CheckinMoods.MoodHeup;
    }


    var lastWeekVibe = {checkins: [], startDate: lastMonday, endDate: lastSunday, mostCheckedInMood: mostCheckedInMood, 
        lep: lep, hep: hep, leup: leup, heup: heup, dateString: dateSt1 + " - " + dateSt2}

    const UserFullResource = {
        id: user.id,
        name: user.firstname,
        profile_image: user.profile_image,
        email: user.email,
        state: user.state,
        role: user.role,
        city: user.city,
        company: user.company,
        title: user.title,
        race: user.race,
        lgbtq: user.lgbtq,
        gender: user.gender,
        veteran: user.veteran,
        provider_id: user.provider_id,
        provider_name: user.provider_name,
        points: user.points,
        lastcheckin: checkin,
        lastWeekVibe: lastWeekVibe
    }


    return UserFullResource;
}

export default UserProfileFullResource;