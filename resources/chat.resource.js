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
  console.log('"Creating chat res"');
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
  let journal = null;
  if (user.UserJournalId) {
    journal = await db.userJournalModel.findOne({
      where: {
        id: user.UserJournalId,
      },
    });
  }
  let jRes = null;
  if (journal) {
    jRes = await JournalResource(journal);
  }
  let oldJournal = null;
  if (user.old_journal_id) {
    oldJournal = await db.userJournalModel.findOne({
      where: {
        id: user.old_journal_id,
      },
    });
  }

  let oldJRes = null;
  if (oldJournal) {
    oldJRes = await JournalResource(oldJournal);
  }

  const UserFullResource = {
    ...user,
    journal: jRes,
    oldJournal: oldJRes,
  };

  return UserFullResource;
}

export default ChatResource;
