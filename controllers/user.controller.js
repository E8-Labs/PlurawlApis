import db from "../models/index.js";
import S3 from "aws-sdk/clients/s3.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
// import { fetchOrCreateUserToken } from "./plaid.controller.js";
// const fs = require("fs");
// var Jimp = require("jimp");
// require("dotenv").config();
const User = db.user;
const Op = db.Sequelize.Op;


import UserRole from "../models/userrole.js";

import UserProfileFullResource from "../resources/userprofilefullresource.js";

export const RegisterUser = async (req, res) => {


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
            //console.log("Auth data ", authData)
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

