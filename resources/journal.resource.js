import db from "../models/index.js";
import CheckInTypes from "../models/checkintype.js";
// import CheckinMoods from "../models/checkinmoods.js";
// import { getJournalsInAWeek, getWeeklyDates } from "../controllers/journal.controller.js";
import crypto from 'crypto'
import moment from "moment-timezone";
// import LoanStatus from "../../models/loanstatus.js";
// import PlaidTokenTypes from "../../models/plaidtokentypes.js";
// import UserLoanFullResource from "../loan/loan.resource.js";
const Op = db.Sequelize.Op;

const JournalResource = async (user) => {
    if (!Array.isArray(user)) {
        ////console.log("Not array")
        return await getUserData(user);
    }
    else {
        ////console.log("Is array")
        const data = []
        for (let i = 0; i < user.length; i++) {
            const p = await getUserData(user[i])
            ////console.log("Adding to index " + i)
            data.push(p);
        }

        return data;
    }
}

async function getUserData(user) {


    // let checkin = await db.userCheckinModel.findOne({
    //     where: {
    //         UserId: user.id,
    //         type: CheckInTypes.TypeJournal,
    //         JournalId: user.id
    //     },
    //     order: [
    //         ['createdAt', 'DESC'],
    //     ],
    // });

    let th = user.textHighlights !== null ? user.textHighlights.split(" ### ") : []
    let snapth = user.snapshotTextHighlights !== null ? user.snapshotTextHighlights.split(" ### ") : []

    let algo = process.env.EncryptionAlgorithm;


    let ownerUser = await db.user.findOne({
        where: {
            id: user.UserId
        }
    })
    let key = ownerUser.enc_key;
    let iv = ownerUser.enc_iv;
    let decrypted = user.detail;
    console.log("decipher", user.id)
    if(key && iv && user.encrypted){
        const decipher = crypto.createDecipheriv(algo, key, iv);
        decrypted = decipher.update(user.detail, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    }
    

// //console.log(`Hightlights ${user.id}`)
// //console.log(th)
    const UserFullResource = {
        id: user.id,
        title: user.title,
        detail: decrypted,
        type: user.type,
        cd: user.cd,
        snapshot: user.snapshot,
        mood: user.mood,
        feeling: user.feeling,
        description: user.description,
        pronunciation: user.pronunciation,
        UserId: user.UserId,
        //    checkin: checkin,
        textHighlights: th,
        snapshotTextHighlights: snapth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }


    return UserFullResource;
}

export default JournalResource;