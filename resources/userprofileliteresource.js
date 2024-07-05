import db from "../models/index.js";
import CheckInTypes from "../models/checkintype.js";
import {CheckinMoods, GenerateRandomGif} from "../models/checkinmoods.js";
import { getJournalsInAWeek, getWeeklyDates } from "../controllers/journal.controller.js";

import moment from "moment-timezone";
import { getRandomColor } from "../config/utility.js";
// import LoanStatus from "../../models/loanstatus.js";
// import PlaidTokenTypes from "../../models/plaidtokentypes.js";
// import UserLoanFullResource from "../loan/loan.resource.js";
const Op = db.Sequelize.Op;

const UserProfileLiteResource = async (user, currentUser = null) => {
    if (!Array.isArray(user)) {
        //////console.log("Not array")
        return await getUserData(user, currentUser);
    }
    else {
        //////console.log("Is array")
        const data = []
        for (let i = 0; i < user.length; i++) {
            const p = await getUserData(user[i], currentUser)
            //////console.log("Adding to index " + i)
            data.push(p);
        }

        return data;
    }
}

async function getUserData(user, currentUser = null) {

    let goals = await db.userGoalModel.findAll({
        where: {
            UserId: user.id
        }
    })


let level = 0
if(user.points < 200 && user.points >= 100){
    level = 1
}
else if(user.points < 400 && user.points >= 200){
    level = 2
}
else if(user.points >= 400){
    level = 3
}

const dailyLoginData = await db.dailyLogin.findOne({
    where: {
      UserId: user.id
    },
    
    order: [['createdAt', 'DESC']],
    raw: true,
    limit: 1
  });
  let lastLogin = null
  if(dailyLoginData){
    lastLogin = dailyLoginData.createdAt;
  }
    const UserFullResource = {
        id: user.id,
        profile_image: user.profile_image,
        email: user.email,
        name: user.name,
        state: user.state,
        role: user.role,
        city: user.city,
        color: getRandomColor(),
        lastLogin: lastLogin,
        points: user.points,
        level: level,
        goals: goals,
        // plan: plan,
    }


    return UserFullResource;
}

export default UserProfileLiteResource;