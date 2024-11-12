import db from "../models/index.js";
import CheckInTypes from "../models/checkintype.js";
// import CheckinMoods from "../models/checkinmoods.js";
// import { getJournalsInAWeek, getWeeklyDates } from "../controllers/journal.controller.js";
import crypto from "crypto";
import moment from "moment-timezone";
import JournalResource from "./journal.resource.js";
// import LoanStatus from "../../models/loanstatus.js";
// import PlaidTokenTypes from "../../models/plaidtokentypes.js";
// import UserLoanFullResource from "../loan/loan.resource.js";
const Op = db.Sequelize.Op;

const ChatResource = async (user) => {
  if (!Array.isArray(user)) {
    //////console.log("Not array")
    return await getUserData(user);
  } else {
    //////console.log("Is array")
    const data = [];
    for (let i = 0; i < user.length; i++) {
      const p = await getUserData(user[i]);
      //////console.log("Adding to index " + i)
      data.push(p);
    }

    return data;
  }
};

async function getUserData(user) {
  let journal = await db.userJournalModel.findOne({
    where: {
      id: user.UserJournalId,
    },
  });

  let jRes = null;
  if (journal) {
    jRes = await JournalResource(journal);
  }
  const UserFullResource = {
    ...user,
    journal: jRes,
  };

  return UserFullResource;
}

export default ChatResource;
