import db from "../models/index.js";
// import LoanStatus from "../../models/loanstatus.js";
// import PlaidTokenTypes from "../../models/plaidtokentypes.js";
// import UserLoanFullResource from "../loan/loan.resource.js";
const Op = db.Sequelize.Op;

const UserProfileFullResource = async (user, currentUser = null) =>{
    if(!Array.isArray(user)){
        //console.log("Not array")
        return await getUserData(user, currentUser);
    }
    else{
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

async function  getUserData(user, currentUser = null) {
    
    
    // let token = await db.PlaidTokens.findOne({where: {
    //     UserId: user.id,
    //     plaid_token_type: PlaidTokenTypes.TokenAuth
    // }});

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

    }


    return UserFullResource;
}

export default UserProfileFullResource;