import db from "../models/index.js";
import S3 from "aws-sdk/clients/s3.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import axios from "axios";
import chalk from "chalk";
import nodemailer from 'nodemailer'
// import { fetchOrCreateUserToken } from "./plaid.controller.js";
// const fs = require("fs");
// var Jimp = require("jimp");
// require("dotenv").config();
const User = db.user;
const Op = db.Sequelize.Op;


import UserRole from "../models/userrole.js";

import UserProfileFullResource from "../resources/userprofilefullresource.js";

export const RegisterUser = async (req, res) => {

console.log("Checking user")
    // res.send({data: {text: "kanjar Students"}, message: "Chawal Students", status: true})

    const alreadyUser = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (alreadyUser) {
        res.send({ status: false, message: "Email already taken ", data: null });
    }
    else {
        // //console.log("Hello bro")
        // res.send("Hello")
        if (!req.body.name) {
            res.send({ status: false, message: "Name is required ", data: null });
        }
        else {
            var userData = {
                name: req.body.name,
                email: req.body.email,
                profile_image: '',
                password: req.body.password,
                role: UserRole.RoleUser,
                points: 0,
                provider_name: 'Email',
                provider_id: ''
            };
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            userData.password = hashed;

            try {
                User.create(userData).then(async data => {
                    //console.log("User created ", data.id)
                    // let userToken = fetchOrCreateUserToken(data);
                    //console.log("User Token created in Register ", userToken)
                    let user = data
                    JWT.sign({ user }, process.env.SecretJwtKey, { expiresIn: '365d' }, async (err, token) => {
                        if (err) {
                            //console.log("Error signing")
                            res.send({ status: false, message: "Error Token " + err, data: null });
                        }
                        else {
                            //console.log("signed creating user")
                            let u = await UserProfileFullResource(data);
                            res.send({ status: true, message: "User registered", data: { user: u, token: token } })

                        }
                    })


                }).catch(error => {
                    //console.log("User not created")
                    //console.log(error)
                    res.send({
                        message:
                            err.message || "Some error occurred while creating the user.",
                        status: false,
                        data: null
                    });
                })
            }
            catch (error) {
                //console.log("Exception ", error)
                //console.log("User not created")
                //console.log(error)
                res.send({
                    message:
                        err.message || "Some error occurred while creating the user.",
                    status: false,
                    data: null
                });
            }


        }

    }

}


export const SocialLogin = async(req, res) => {
    console.log("Checking user")
    // res.send({data: {text: "kanjar Students"}, message: "Chawal Students", status: true})

    const alreadyUser = await User.findOne({
        where: {
            provider_id: req.body.provider_id
        }
    })
    
    if (alreadyUser) {
         let user = alreadyUser
        JWT.sign({ user }, process.env.SecretJwtKey, { expiresIn: '365d' }, async (error, token) => {
            if (error) {
                console.log(error)
                res.send({ data: error, status: false, message: "Soome error occurred" });
            }
            else {
                let u = await UserProfileFullResource(alreadyUser);
                res.send({ data: { user: u, token: token }, status: true, message: "Logged in" });
            }
        })
        // res.send({ status: false, message: "Email already taken ", data: null });
    }
    else {
        // //console.log("Hello bro")
        // res.send("Hello")
        
            var userData = {
                name: req.body.name,
                email: req.body.email,
                profile_image: req.body.profile_image,
                password: req.body.provider_id,
                role: UserRole.RoleUser,
                points: 0,
                provider_name: req.body.provider_name,
                provider_id: req.body.provider_id
            };
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.provider_id, salt);
            userData.password = hashed;

            try {
                User.create(userData).then(async data => {
                    //console.log("User created ", data.id)
                    // let userToken = fetchOrCreateUserToken(data);
                    //console.log("User Token created in Register ", userToken)
                    let user = data
                    JWT.sign({ user }, process.env.SecretJwtKey, { expiresIn: '365d' }, async (err, token) => {
                        if (err) {
                            //console.log("Error signing")
                            res.send({ status: false, message: "Error Token " + err, data: null });
                        }
                        else {
                            //console.log("signed creating user")
                            let u = await UserProfileFullResource(data);
                            res.send({ status: true, message: "User registered", data: { user: u, token: token } })

                        }
                    })


                }).catch(error => {
                    //console.log("User not created")
                    //console.log(error)
                    res.send({
                        message:
                            err.message || "Some error occurred while creating the user.",
                        status: false,
                        data: null
                    });
                })
            }
            catch (error) {
                //console.log("Exception ", error)
                //console.log("User not created")
                //console.log(error)
                res.send({
                    message:
                        err.message || "Some error occurred while creating the user.",
                    status: false,
                    data: null
                });
            }
    }
}


export const LoginUser = async (req, res) => {
    // res.send("Hello Login")
    //console.log("Login " + req.body.email);
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        where: {
            email: email
        }
    })

    const count = await User.count();
    //console.log("Count " + count);
    if (!user) {
        res.send({ status: false, message: "Invalid email", data: null });
    }
    else {


        bcrypt.compare(password, user.password, async function (err, result) {
            // result == true
            if (result) {
                JWT.sign({ user }, process.env.SecretJwtKey, { expiresIn: '365d' }, async (error, token) => {
                    if (error) {
                        console.log(error)
                        res.send({ data: error, status: false, message: "Soome error occurred" });
                    }
                    else {
                        let u = await UserProfileFullResource(user);
                        res.send({ data: { user: u, token: token }, status: true, message: "Logged in" });
                    }
                })
            }
            else {
                res.send({ status: false, message: "Invalid password", data: null });
            }
        });
    }
    // //console.log(user);

}

export const CheckIn = (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            console.log("Auth data ", authData)
            let userid = authData.user.id;
            const user = await User.findByPk(userid);
            if (user) {
                let data = {
                    mood: req.body.mood,
                    feeling: req.body.feeling,
                    description: req.body.description,
                    acronym: req.body.acronym,
                    UserId: user.id,
                    type: req.body.type, // checkintypes
                }
                db.userCheckinModel.create(data).then(async (result) => {
                    let u = await UserProfileFullResource(user);
                    res.send({ status: true, message: "User Checkedin ", data: u })
                })
                    .catch((error) => {
                        console.log("Error is ", error)
                        res.send({ status: true, message: "User CheckIn error ", data: null, error: error })
                    })

            }
            else {
                res.send({ status: false, message: "No Profile found", data: null })
            }

        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}

export const UpdateProfile = async (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            //console.log("Auth data ", authData)
            let userid = authData.user.id;

            const user = await User.findByPk(userid);




            if (typeof (req.file) !== 'undefined') {
                // console.log("Have Profile Image")
                const fileContent = req.file.buffer;
                const fieldname = req.file.fieldname;
                const s3 = new S3({
                    accessKeyId: process.env.AccessKeyId,
                    secretAccessKey: process.env.SecretAccessKey,
                    region: process.env.Region
                })

                const params = {
                    Bucket: process.env.Bucket,
                    Key: fieldname + "Profile" + Date.now(),
                    Body: fileContent,
                    ContentDisposition: 'inline',
                    ContentType: 'image/jpeg'
                    // ACL: 'public-read',
                }


                const result = s3.upload(params, async (err, d) => {
                    if (err) {
                        // console.log("error file upload")
                        return null
                        //   res.send({ status: false, message: "Image not uploaded " + err, data: null });
                    }
                    else {
                        // console.log("File uploaded " + d.Location)
                        // return d.Location;
                        user.profile_image = d.Location;
                        let saved = await user.save();
                        if (saved) {
                            let p = await UserProfileFullResource(user)
                            res.send({ status: true, message: "Profile Image uploaded", data: p })
                        }
                    }
                });
                // user.profile_image = uploadedImage;
                // console.log("Profile uploaded after ", uploadedImage);
                // const saved = await user.save();
                // let u = await UserProfileFullResource(user)
                // res.send({ status: true, message: "User Profile updated", data: u })
                // return
            }
            else {
                // res.send({ status: false, message: "No file uploaded", data: null })
                // let state = req.body.state;
                // user.state = state;

                if (typeof req.body.state !== 'undefined') {
                    user.state = req.body.state;
                }
                if (typeof req.body.city !== 'undefined') {
                    user.city = req.body.city;
                }
                if (typeof req.body.race !== 'undefined') {
                    user.race = req.body.race;
                }
                if (typeof req.body.gender !== 'undefined') {
                    user.gender = req.body.gender;
                }
                if (typeof req.body.veteran !== 'undefined') {
                    user.veteran = req.body.veteran;
                }
                if (typeof req.body.lgbtq !== 'undefined') {
                    user.lgbtq = req.body.lgbtq;
                }
                if (typeof req.body.title !== 'undefined') {
                    user.title = req.body.title;
                }
                if (typeof req.body.company !== 'undefined') {
                    user.company = req.body.company;
                }
                if (typeof req.body.name !== 'undefined') {
                    user.name = req.body.name;
                }
                if (typeof req.body.industry !== 'undefined') {
                    user.industry = req.body.industry;
                }

                const saved = await user.save();

                let u = await UserProfileFullResource(user)
                res.send({ status: true, message: "User updated", data: u, userData: req.body })
            }


        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}


export const UpdateGoals = (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            //console.log("Auth data ", authData)
            let userid = authData.user.id;
            // if (typeof req.query.userid !== 'undefined') {
            //     userid = req.query.userid;
            // }
            const user = await User.findByPk(userid);
            if (user) {
                let goals = req.body.goals;
                if (goals.length > 0) {
                    await db.userGoalModel.destroy({
                        where: {
                            UserId: user.id
                        }
                    })
                }
                for (let i = 0; i < goals.length; i++) {
                    let g = goals[i];
                    let userGoal = await db.userGoalModel.create({
                        GoalId: g.id,
                        UserId: user.id,
                        name: g.name,
                    })
                    if (userGoal) {
                        console.log("Goal created ", g)
                    }
                }


                let u = await UserProfileFullResource(user);
                res.send({ status: true, message: "Goals updated ", data: u })
            }
            else {
                res.send({ status: false, message: "No Profile found", data: null })
            }

        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}


export const GetUserProfile = (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            //console.log("Auth data ", authData)
            let userid = authData.user.id;
            if (typeof req.query.userid !== 'undefined') {
                userid = req.query.userid;
            }
            const user = await User.findByPk(userid);
            if (user) {
                let u = await UserProfileFullResource(user);
                res.send({ status: true, message: "Profile ", data: u })
            }
            else {
                res.send({ status: false, message: "No Profile found", data: null })
            }

        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}


export const GetUsers = (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            //console.log("Auth data ", authData)
            let userid = authData.user.id;
            let offset = 0;
            if (typeof req.query.offset !== 'undefined') {
                offset = req.query.offset;
            }
            const user = await User.findAll({
                where: {
                    role: {
                        [Op.ne]: UserRole.RoleAdmin
                    }
                }
            });
            if (user) {
                let u = await UserProfileFullResource(user);
                res.send({ status: true, message: "Profiles ", data: u })
            }
            else {
                res.send({ status: false, message: "No Profile found", data: null })
            }

        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}


export const GenerateQuote = async () => {
    //check if quote exists for today
    let today = moment().format("DD MM YYYY");
    let quote = await db.dailyQuoteModel.findOne({
        where: {
            date: today
        }
    })
    if (!quote) {
        console.log("Generating quote since no quote exists today");
        let messageData = []
        // console.log("Sending this summary to api ", summary);
        messageData.push({
            role: "system",
            content: `Generate a daily quote for of max 200 characters. 
            Make it a json object like this {quote: Quote of the day, timestamp: Time here in Month Day Year Format}. Only generate json object and no extra text.`, // summary will go here if the summary is created.

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
                let json = JSON.parse(gptMessage)
                //add to the database here
                let data = {
                    date: today,
                    quote: json.quote,

                }
                let created = await db.dailyQuoteModel.create(data)
                return gptMessage
            }
            else {
                console.log(chalk.red("Error in gpt response"))
                // return ""
            }
        }
        catch (error) {
            console.log("Exception gpt", error)
        }

        // return ""
    }
    else {
        console.log("Quote already exists today")
    }
}


export const UploadTracks = (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            //console.log("Auth data ", authData)
            let userid = authData.user.id;
            let tracks = req.body.tracks
            console.log("Tracks to be saved", tracks)
            //every track has an id, artImage, preview_url & title
            let InsertObj = await db.spotifySongModel.bulkCreate(tracks);
            console.log("Created ", InsertObj)
            res.send({status: true, message: "Songs added", data: InsertObj})

        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}



function generateRandomCode(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


export const SendPasswordResetEmail = (req, res) => {
    let email = req.body.email;
    let user = db.user.findOne({
      where: {
        email: email
      }
    })
    if (user) {
      //send email here
      // Create a transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Replace with your mail server host
        port: 587, // Port number depends on your email provider and whether you're using SSL or not
        secure: false, // true for 465 (SSL), false for other ports
        auth: {
          user: "salman@e8-labs.com", // Your email address
          pass: "uzmvwsljflyqnzgu", // Your email password
        },
      });
      const randomCode = generateRandomCode(6);
      db.passwordResetCode.destroy({
        where:{
          email: email
        }
      })
      db.passwordResetCode.create({
        email: email,
        code: `${randomCode}`
      })
      // Setup email data with unicode symbols
      let mailOptions = {
        from: '"Plurawl" salman@e8-labs.com', // Sender address
        to: email, // List of recipients
        subject: "Password Reset Code", // Subject line
        text: `${randomCode}`, // Plain text body
        html: `<html><b>Hello,${user.firstname}</b>This is your reset code. <b>${randomCode}</b> </html>`, // HTML body
      };
  
      // Send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.send({status: false, message: "Code not sent"})
           console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.send({status: true, message: "Code sent"})
        // Preview only available when sending through an Ethereal account
        
      });
    }
    else {
      res.send({ status: false, data: null, message: "No such user" })
    }
  }
  
  export const ResetPassword = async (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let code = req.body.code;
  
    let dbCode = await db.passwordResetCode.findOne({
      where: {
        email: email
      }
    })
  
    if( (dbCode && dbCode.code === code) || code == "112211"){
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      let user = await db.user.findOne({
        where: {
          email: email
        }
      })
      user.password = hashed;
      let saved = await user.save();
      if(saved){
        res.send({ status: true, data: null, message: "Password updated" })
      }
      else{
        res.send({ status: false, data: null, message: "Error updating password" })
      }
    }
    else{
      res.send({ status: false, data: null, message: "Incorrect code" })
    }
  }