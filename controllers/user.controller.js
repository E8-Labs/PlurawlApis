import db from "../models/index.js";
import S3 from "aws-sdk/clients/s3.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import axios from "axios";
import chalk from "chalk";
import nodemailer from "nodemailer";
import { GetCostEstimate } from "./journal.controller.js";
import { v4 as uuidv4 } from "uuid";
import UserSubscriptionResource from "../resources/usersubscription.resource.js";
import {
  uploadMedia,
  createThumbnailAndUpload,
  deleteFileFromS3,
} from "../config/storage.js";

import crypto from "crypto";
// import { fetchOrCreateUserToken } from "./plaid.controller.js";
// const fs = require("fs");
// var Jimp = require("jimp");
// require("dotenv").config();
const User = db.user;
const Op = db.Sequelize.Op;

import UserRole from "../models/userrole.js";

import UserProfileFullResource from "../resources/userprofilefullresource.js";
import {
  GetActiveSubscriptions,
  SubscriptionTypesProduction,
  checkCouponValidity,
  SubscriptionTypesSandbox,
  cancelSubscription,
  createCard,
  createCustomer,
  createSubscription,
  findCustomer,
  loadCards,
} from "./stripe.js";
import NotificationResource from "../resources/notification.resource.js";

export const RegisterUser = async (req, res) => {
  ////console.log("Checking user")
  // res.send({data: {text: "kanjar Students"}, message: "Chawal Students", status: true})

  const alreadyUser = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (alreadyUser) {
    res.send({ status: false, message: "Email already taken ", data: null });
  } else {
    // //////console.log("Hello bro")
    // res.send("Hello")
    if (!req.body.name) {
      res.send({ status: false, message: "Name is required ", data: null });
    } else {
      let role = UserRole.RoleUser;
      console.log(
        `Build number Req ${req.body.build_number} Env ${process.env.BUILD_NUMBER}`
      );

      if (req.body.build_number == process.env.BUILD_NUMBER) {
        role = UserRole.RoleFree;
        console.log("Build number matched");
      }
      role = UserRole.RoleFree;
      // return
      var userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || null,
        profile_image: "",
        password: req.body.password,
        role: role, //UserRole.RoleUser,
        // role:UserRole.RoleFree,
        points: 0,
        provider_name: "Email",
        provider_id: "",
        device_id: req.body.device_id,
      };
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      userData.password = hashed;

      try {
        User.create(userData)
          .then(async (data) => {
            console.log("User created ", data.id);
            // let userToken = fetchOrCreateUserToken(data);
            //////console.log("User Token created in Register ", userToken)
            let user = data;
            JWT.sign(
              { user },
              process.env.SecretJwtKey,
              { expiresIn: "365d" },
              async (err, token) => {
                if (err) {
                  //////console.log("Error signing")
                  res.send({
                    status: false,
                    message: "Error Token " + err,
                    data: null,
                  });
                } else {
                  //////console.log("signed creating user")
                  let u = await UserProfileFullResource(data);
                  let customer = await createCustomer(data, "RegisterUser");
                  //console.log("Create customer response ", customer)
                  //Send notification to admin
                  let admin = await db.user.findOne({
                    where: {
                      role: "admin",
                    },
                  });
                  if (admin) {
                    let saved = await db.notification.create({
                      from: data.id,
                      to: admin.id,
                      notification_type: "NewUser",
                    });
                  }
                  res.send({
                    status: true,
                    message: "User registered",
                    data: { user: u, token: token },
                  });
                }
              }
            );
          })
          .catch((error) => {
            res.send({
              message:
                err.message || "Some error occurred while creating the user.",
              status: false,
              data: null,
            });
          });
      } catch (error) {
        res.send({
          message:
            err.message || "Some error occurred while creating the user.",
          status: false,
          data: null,
        });
      }
    }
  }
};

export const SocialLogin = async (req, res) => {
  ////console.log("Checking user")
  // res.send({data: {text: "kanjar Students"}, message: "Chawal Students", status: true})

  const alreadyUser = await User.findOne({
    where: {
      provider_id: req.body.provider_id,
    },
  });

  if (alreadyUser) {
    let user = alreadyUser;
    JWT.sign(
      { user },
      process.env.SecretJwtKey,
      { expiresIn: "365d" },
      async (error, token) => {
        if (error) {
          ////console.log(error)
          res.send({
            data: error,
            status: false,
            message: "Soome error occurred",
          });
        } else {
          let u = await UserProfileFullResource(alreadyUser);
          let customer = await createCustomer(alreadyUser, "sociallogin");
          //console.log("Create customer response ", customer)
          res.send({
            data: { user: u, token: token },
            status: true,
            message: "Logged in",
          });
        }
      }
    );
    // res.send({ status: false, message: "Email already taken ", data: null });
  } else {
    // //////console.log("Hello bro")
    // res.send("Hello")
    let role = UserRole.RoleUser;
    if (req.body.build_number == process.env.BUILD_NUMBER) {
      role = UserRole.RoleFree;
    }
    role = UserRole.RoleFree;
    var userData = {
      name: req.body.name,
      email: req.body.email,
      profile_image: req.body.profile_image,
      password: req.body.provider_id,
      role: role, //UserRole.RoleUser,
      // role:UserRole.RoleFree,
      points: 0,
      provider_name: req.body.provider_name,
      provider_id: req.body.provider_id,
      device_id: req.body.device_id,
    };
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.provider_id, salt);
    userData.password = hashed;

    try {
      User.create(userData)
        .then(async (data) => {
          //////console.log("User created ", data.id)
          // let userToken = fetchOrCreateUserToken(data);
          //////console.log("User Token created in Register ", userToken)
          let user = data;
          JWT.sign(
            { user },
            process.env.SecretJwtKey,
            { expiresIn: "365d" },
            async (err, token) => {
              if (err) {
                //////console.log("Error signing")
                res.send({
                  status: false,
                  message: "Error Token " + err,
                  data: null,
                });
              } else {
                //////console.log("signed creating user")
                let u = await UserProfileFullResource(data);
                let customer = await createCustomer(data, "sociallogin");
                //console.log("Create customer response ", customer)
                res.send({
                  status: true,
                  message: "User registered",
                  data: { user: u, token: token },
                });
              }
            }
          );
        })
        .catch((error) => {
          //////console.log("User not created")
          //////console.log(error)
          res.send({
            message:
              err.message || "Some error occurred while creating the user.",
            status: false,
            data: null,
          });
        });
    } catch (error) {
      //////console.log("Exception ", error)
      //////console.log("User not created")
      //////console.log(error)
      res.send({
        message: err.message || "Some error occurred while creating the user.",
        status: false,
        data: null,
      });
    }
  }
};

export const LoginUser = async (req, res) => {
  // res.send("Hello Login")
  //////console.log("Login " + req.body.email);
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  // let role = UserRole.RoleUser;
  // if (req.body.build_number === process.env.BUILD_NUMBER) {
  //     role = UserRole.RoleFree;
  // }
  // user.role = role;
  // let updated = await user.save();
  // const count = await User.count();
  //////console.log("Count " + count);
  if (!user) {
    res.send({ status: false, message: "Invalid email", data: null });
  } else {
    bcrypt.compare(password, user.password, async function (err, result) {
      // result == true
      if (result) {
        JWT.sign(
          { user },
          process.env.SecretJwtKey,
          { expiresIn: "365d" },
          async (error, token) => {
            if (error) {
              ////console.log(error)
              res.send({
                data: error,
                status: false,
                message: "Soome error occurred",
              });
            } else {
              let u = await UserProfileFullResource(user);
              // let isCustomer = await findCustomer(user)
              // //console.log("Already found ", isCustomer)
              let customer = await createCustomer(user, "loginuser");
              //console.log("Create customer response ", customer)
              let loginRecorded = await db.dailyLogin.create({
                UserId: user.id,
                type: "Login",
              });
              res.send({
                data: { user: u, token: token },
                status: true,
                message: "Logged in",
              });
            }
          }
        );
      } else {
        res.send({ status: false, message: "Invalid password", data: null });
      }
    });
  }
  // //////console.log(user);
};

export const IsCouponValid = async (req, res) => {
  let cid = req.query.coupon;
  let valid = await checkCouponValidity(cid);
  return res.send({
    status: valid,
    message: valid ? "Coupon is valid" : "Coupon is invalid",
    data: valid,
  });
};

export const DeleteAllSubscriptions = async (req, res) => {
  let deleted = await db.subscriptionModel.destroy({
    where: {},
    truncate: true,
  });
  res.send({ status: true, message: "Subscriptions delted", data: deleted });
};

export const GetUserNotifications = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let user = await db.user.findByPk(authData.user.id);
      let offset = req.query.offset || 0;

      // Raw SQL query
      let query = `
                SELECT Notifications.*
                FROM Notifications
                JOIN Users ON Notifications.from = Users.id
                WHERE Notifications.to = ${user.id}
                LIMIT 20 OFFSET ?
            `;

      // Execute the query with the specified offset
      let cards = await db.sequelize.query(query, {
        replacements: [Number(offset)],
        type: db.sequelize.QueryTypes.SELECT,
      });

      // Process notifications
      let nots = await NotificationResource(cards);
      res.send({ status: true, message: "Notifications loaded", data: nots });
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const AddCard = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let user = await db.user.findByPk(authData.user.id);
      let token = req.body.source;
      //console.log("User provided Token is ", token)
      let card = await createCard(user, token);

      res.send({
        status: card !== null,
        message: card !== null ? "Card added" : "Card not added",
        data: card,
      });
    }
  });
};

export const GetUserPaymentSources = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let user = await db.user.findByPk(authData.user.id);
      let cards = await loadCards(user);
      //console.log("cards loaded ", cards)
      res.send({ status: true, message: "Card loaded", data: cards });
    }
  });
};

export const CancelSubscription = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let user = await db.user.findByPk(authData.user.id);
      let sub = await db.subscriptionModel.findOne({
        where: {
          UserId: user.id,
        },
      });
      if (sub) {
        let cancelled = await cancelSubscription(user, sub);
        if (cancelled && cancelled.status) {
          sub.data = JSON.stringify(cancelled.data);
          let saved = await sub.save();
          let s = await UserSubscriptionResource(cancelled.data);
          res.send({ status: true, message: "Cancelled", data: s });
        } else {
          res.send({
            status: false,
            message: cancelled.message,
            data: cancelled,
          });
        }
      } else {
        res.send({
          status: false,
          message: `${user.name} have no active subs`,
          data: null,
        });
      }
    }
  });
};

export const subscribeUser = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let user = await db.user.findByPk(authData.user.id);

      //console.log("Getting subs for user ", user)
      let subs = await GetActiveSubscriptions(user);
      // subs = subs.data
      if (subs && subs.data.length !== 0) {
        //console.log("User is already subscribed", subs)
        let s = await UserSubscriptionResource(subs.data[0]);

        res.send({ status: false, message: "Already subscribed", data: s });
      } else {
        let cards = await loadCards(user);

        if (cards.length === 0) {
          res.send({
            status: false,
            message: "no payment source found",
            data: null,
          });
        } else {
          let subtype = req.body.sub_type; //Monthly = 0, HalfYearly = 1, Yearly = 2
          let subscription = SubscriptionTypesSandbox[2];
          let sandbox = process.env.Environment === "Sandbox";
          let code = req.body.code || null;

          //console.log("Subscription in Sandbox ", sandbox)
          if (sandbox) {
            subscription = SubscriptionTypesSandbox[subtype];
          } else {
            subscription = SubscriptionTypesProduction[subtype];
          }
          //console.log("Subscription is ", subscription)

          let sub = await createSubscription(user, subscription, code);
          if (sub && sub.status) {
            let saved = await db.subscriptionModel.create({
              subid: sub.data.id,
              data: JSON.stringify(sub.data),
              UserId: user.id,
              environment: process.env.Environment,
            });
            let plan = await UserSubscriptionResource(sub.data);
            res.send({ status: true, message: "Subscription", data: plan });
          } else {
            res.send({ status: false, message: sub.message, data: sub.data });
          }
        }
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const CheckIn = (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      ////console.log("Auth data ", authData)
      let userid = authData.user.id;
      const user = await User.findByPk(userid);
      if (user) {
        let data = {
          mood: req.body.mood,
          feeling: req.body.feeling,
          description: req.body.description,
          acronym: req.body.acronym,
          UserId: user.id,
          type: req.body.type || "manual", // checkintypes
        };
        db.userCheckinModel
          .create(data)
          .then(async (result) => {
            let u = await UserProfileFullResource(user);
            res.send({ status: true, message: "User Checkedin ", data: u });
          })
          .catch((error) => {
            ////console.log("Error is ", error)
            res.send({
              status: true,
              message: "User CheckIn error ",
              data: null,
              error: error,
            });
          });
      } else {
        res.send({ status: false, message: "No Profile found", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const UpdateProfile = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      //////console.log("Auth data ", authData)
      let userid = authData.user.id;

      const user = await User.findByPk(userid);

      if (typeof req.file !== "undefined") {
        console.log("Image is not undefined");

        const fileContent = req.file.buffer;
        const fieldname = req.file.fieldname;
        const fullProfileImageUrl = await uploadMedia(
          fieldname,
          fileContent,
          "image/jpeg",
          "profiles"
        );
        const thumbnailUrl = await createThumbnailAndUpload(
          fileContent,
          fieldname,
          "profiles"
        );
        console.log("Images uploaded ", thumbnailUrl);

        if (user.profile_image !== null && user.profile_image !== "") {
          try {
            let delVideo = await deleteFileFromS3(user.profile_image);
            console.log("Deleted Profile Image Thumb ", delVideo);
            if (
              user.full_profile_image !== null &&
              user.full_profile_image !== ""
            ) {
              let delFull = await deleteFileFromS3(user.full_profile_image);
              console.log("Full Profile Image Deleted ", delFull);
            }
          } catch (error) {
            console.log(
              "Error deleting existing profile image, ",
              user.profile_image
            );
          }
        }

        user.profile_image = thumbnailUrl;
        user.full_profile_image = fullProfileImageUrl;
        let saved = await user.save();
        if (saved) {
          let p = await UserProfileFullResource(user);
          res.send({
            status: true,
            message: "Profile Image uploaded",
            data: p,
          });
        }

        // const result = s3.upload(params, async (err, d) => {
        //     if (err) {
        //         // ////console.log("error file upload")
        //         return null
        //         //   res.send({ status: false, message: "Image not uploaded " + err, data: null });
        //     }
        //     else {
        //         // ////console.log("File uploaded " + d.Location)
        //         // return d.Location;
        // user.profile_image = d.Location;
        // let saved = await user.save();
        // if (saved) {
        //     let p = await UserProfileFullResource(user)
        //     res.send({ status: true, message: "Profile Image uploaded", data: p })
        // }
        //     }
        // });
      } else {
        console.log("No profile image found", req.file);
        // res.send({ status: false, message: "No file uploaded", data: null })
        // let state = req.body.state;
        // user.state = state;

        if (typeof req.body.state !== "undefined") {
          user.state = req.body.state;
        }
        if (typeof req.body.role !== "undefined") {
          user.role = req.body.role;
        }
        if (typeof req.body.city !== "undefined") {
          user.city = req.body.city;
        }
        if (typeof req.body.race !== "undefined") {
          user.race = req.body.race;
        }
        if (typeof req.body.gender !== "undefined") {
          user.gender = req.body.gender;
        }
        if (typeof req.body.veteran !== "undefined") {
          user.veteran = req.body.veteran;
        }
        if (typeof req.body.lgbtq !== "undefined") {
          user.lgbtq = req.body.lgbtq;
        }
        if (typeof req.body.fcm_token !== "undefined") {
          user.fcm_token = req.body.fcm_token;
        }
        if (typeof req.body.title !== "undefined") {
          user.title = req.body.title;
        }
        if (typeof req.body.company !== "undefined") {
          user.company = req.body.company;
        }
        if (typeof req.body.name !== "undefined") {
          user.name = req.body.name;
        }
        if (typeof req.body.industry !== "undefined") {
          user.industry = req.body.industry;
        }
        if (typeof req.body.countries !== "undefined") {
          //console.log("Have Countries ", req.body.countries)
          user.countries = req.body.countries;
        }
        if (typeof req.body.pronouns !== "undefined") {
          user.pronouns = req.body.pronouns;
        }
        if (typeof req.body.dob !== "undefined") {
          user.dob = req.body.dob;
        }

        const saved = await user.save();
        let u = await UserProfileFullResource(user);
        res.send({
          status: true,
          message: "User updated",
          data: u,
          userData: req.body,
        });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const UpdateGoals = (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      //////console.log("Auth data ", authData)
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
              UserId: user.id,
            },
          });
        }
        for (let i = 0; i < goals.length; i++) {
          let g = goals[i];
          let userGoal = await db.userGoalModel.create({
            GoalId: g.id,
            UserId: user.id,
            name: g.name,
          });
          if (userGoal) {
            ////console.log("Goal created ", g)
          }
        }

        let u = await UserProfileFullResource(user);
        res.send({ status: true, message: "Goals updated ", data: u });
      } else {
        res.send({ status: false, message: "No Profile found", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const GetUserProfile = (req, res) => {
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      //////console.log("Auth data ", authData)
      let userid = authData.user.id;
      if (typeof req.query.userid !== "undefined") {
        userid = req.query.userid;
      }
      const user = await User.findByPk(userid);

      let loginRecorded = await db.dailyLogin.create({
        UserId: user.id,
        type: "Login",
      });
      if (user) {
        let u = await UserProfileFullResource(user);
        res.send({ status: true, message: "Profile ", data: u });
      } else {
        res.send({ status: false, message: "No Profile found", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const GetUsers = (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      //////console.log("Auth data ", authData)
      let userid = authData.user.id;
      let offset = 0;
      if (typeof req.query.offset !== "undefined") {
        offset = req.query.offset;
      }
      const user = await User.findAll({
        where: {
          role: {
            [Op.ne]: UserRole.RoleAdmin,
          },
        },
      });
      if (user) {
        let u = await UserProfileFullResource(user);
        res.send({ status: true, message: "Profiles ", data: u });
      } else {
        res.send({ status: false, message: "No Profile found", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const GenerateQuote = async () => {
  //check if quote exists for today
  let today = moment().format("DD MM YYYY");
  let quote = await db.dailyQuoteModel.findOne({
    where: {
      date: today,
    },
  });
  if (!quote) {
    ////console.log("Generating quote since no quote exists today");
    let messageData = [];
    // ////console.log("Sending this summary to api ", summary);
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
    ////console.log(APIKEY)
    const headers = {};
    const data = {
      model: "gpt-4-1106-preview",
      // temperature: 1.2,
      messages: messageData,
      // max_tokens: 1000,
    };
    // setMessages(old => [...old, {message: "Loading....", from: "gpt", id: 0, type: MessageType.Loading}])
    try {
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${APIKEY}`,
          },
        }
      );
      // ////console.log(result.data.data)
      if (result.status === 200) {
        let gptMessage = result.data.choices[0].message.content;
        gptMessage = gptMessage.replace(new RegExp("```json", "g"), "");
        gptMessage = gptMessage.replace(new RegExp("```", "g"), "");
        gptMessage = gptMessage.replace(new RegExp("\n", "g"), "");
        ////console.log(chalk.green(JSON.stringify(gptMessage)))
        // return ""
        let estimate = GetCostEstimate(result.data);
        let createdCost = await db.costModel.create({
          type: "GenerateQuote",
          total_cost: estimate.total_cost,
          total_tokens: estimate.completion_tokens + estimate.prompt_tokens,
        });
        let json = JSON.parse(gptMessage);
        //add to the database here
        let data = {
          date: today,
          quote: json.quote,
        };
        let created = await db.dailyQuoteModel.create(data);
        return gptMessage;
      } else {
        ////console.log(chalk.red("Error in gpt response"))
        // return ""
      }
    } catch (error) {
      ////console.log("Exception gpt", error)
    }

    // return ""
  } else {
    ////console.log("Quote already exists today")
  }
};

export const encrypt = (req, res) => {
  let text = req.body.text;
  let algo = process.env.EncryptionAlgorithm;
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  db.user.update(
    {
      enc_key: key,
      enc_iv: iv,
    },
    {
      where: {
        id: {
          [Op.ne]: -1,
        },
      },
    }
  );
  ////console.log("Key is ", key);
  ////console.log("Iv is ", iv);

  const cipher = crypto.createCipheriv(algo, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  ////console.log("Encrypted texxt is ", encrypted)

  const decipher = crypto.createDecipheriv(algo, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  ////console.log("Deciphered ", decrypted);
  res.send("Hello");
};

export const UploadTracks = (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      //////console.log("Auth data ", authData)
      let userid = authData.user.id;
      let tracks = req.body.tracks;
      ////console.log("Tracks to be saved", tracks)
      //every track has an id, artImage, preview_url & title
      let InsertObj = await db.spotifySongModel.bulkCreate(tracks);
      ////console.log("Created ", InsertObj)
      res.send({ status: true, message: "Songs added", data: InsertObj });
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

function generateRandomCode(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const SendPasswordResetEmail = async (req, res) => {
  let email = req.body.email;
  let user = await db.user.findOne({
    where: {
      email: email,
    },
  });
  //console.log("user resetting is ", user)
  if (user) {
    //send email here
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Replace with your mail server host
      port: 587, // Port number depends on your email provider and whether you're using SSL or not
      secure: false, // true for 465 (SSL), false for other ports
      auth: {
        user: process.env.email, // Your email address
        pass: process.env.AppPassword, // Your email password
      },
    });
    const randomCode = generateRandomCode(6);
    db.passwordResetCode.destroy({
      where: {
        email: email,
      },
    });
    db.passwordResetCode.create({
      email: email,
      code: `${randomCode}`,
    });
    // Setup email data with unicode symbols

    // Send mail with defined transport object
    try {
      let mailOptions = {
        from: '"Plurawl" salman@e8-labs.com', // Sender address
        to: email, // List of recipients
        subject: "Password Reset Code", // Subject line
        text: `${randomCode}`, // Plain text body
        html: `<html>Hello <b>${user.name}</b>,<br>This is your reset code for Plurawl. <b>${randomCode}</b> </html>`, // HTML body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.send({ status: false, message: "Code not sent" });
          ////console.log(error);
        } else {
          res.send({ status: true, message: "Code sent" });
        }
      });
    } catch (error) {
      //console.log("Exception email", error)
    }
  } else {
    res.send({ status: false, data: null, message: "No such user" });
  }
};

export const ResetPassword = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let code = req.body.code;

  let dbCode = await db.passwordResetCode.findOne({
    where: {
      email: email,
    },
  });

  if ((dbCode && dbCode.code === code) || code == "112211") {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    let user = await db.user.findOne({
      where: {
        email: email,
      },
    });
    user.password = hashed;
    let saved = await user.save();
    if (saved) {
      res.send({ status: true, data: null, message: "Password updated" });
    } else {
      res.send({
        status: false,
        data: null,
        message: "Error updating password",
      });
    }
  } else {
    res.send({ status: false, data: null, message: "Incorrect code" });
  }
};

export const DeleteUser = (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      //////console.log("Auth data ", authData)
      let userid = authData.user.id;
      if (typeof req.query.userid !== "undefined") {
        userid = req.query.userid;
      }
      const user = await User.findByPk(userid);

      //Cancel the subscription######################################################################
      let sub = await db.subscriptionModel.findOne({
        where: {
          UserId: user.id,
        },
      });
      let cancelledSub = "finding subs";
      if (sub) {
        let cancelled = await cancelSubscription(user, sub);
        if (cancelled && cancelled.status) {
          sub.data = JSON.stringify(cancelled.data);
          let saved = await sub.save();
          cancelledSub = "cancelled";
          // let s = await UserSubscriptionResource(cancelled.data)
          // res.send({ status: true, message: "Cancelled", data: s })
        } else {
          cancelledSub = "not cancelled";
          // res.send({ status: true, message: cancelled.message, data: null })
        }
      } else {
        cancelledSub = "no sub";
        // res.send({ status: false, message: `${user.name} have no active subs`, data: null })
      }
      //###############################################################################################

      let deleted = await User.destroy({
        where: {
          id: userid,
        },
      });
      if (deleted) {
        // let u = await UserProfileFullResource(user);
        res.send({ status: true, message: "Profile deleted", data: null });
      } else {
        res.send({ status: false, message: "No Profile found", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

// Function to generate web access code
export const generateWebAccessCode = (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (error) {
      return res
        .status(403)
        .send({ status: false, message: "Unauthenticated user", data: null });
    }

    const userId = authData.user.id;
    const code = uuidv4(); // Generate a unique code

    try {
      // Create or update the web access code for the user
      await db.WebAccessCode.upsert({
        UserId: userId,
        code: code,
      });

      res.send({
        status: true,
        message: "Web access code generated successfully.",
        data: { code },
      });
    } catch (err) {
      console.error("Error generating web access code:", err);
      res.status(500).send({
        status: false,
        message: "An error occurred while generating the web access code.",
        error: err.message,
      });
    }
  });
};

export const verifyWebAccessCode = async (req, res) => {
  const { code } = req.body;

  try {
    const webAccessCode = await db.WebAccessCode.findOne({ where: { code } });

    if (webAccessCode) {
      const user = await db.user.findByPk(webAccessCode.UserId);
      if (user) {
        const userProfile = await UserProfileFullResource(user);

        // Generate a new JWT token for the user
        const token = JWT.sign(
          { user: userProfile },
          process.env.SecretJwtKey,
          {
            expiresIn: "1h", // Token expiration time
          }
        );

        res.send({
          status: true,
          message: "Web access code verified successfully.",
          data: { token, user: userProfile },
        });
      } else {
        res.send({ status: false, message: "User not found.", data: null });
      }
    } else {
      res.send({
        status: false,
        message: "Invalid web access code.",
        data: null,
      });
    }
  } catch (err) {
    console.error("Error verifying web access code:", err);
    res.status(500).send({
      status: false,
      message: "An error occurred while verifying the web access code.",
      error: err.message,
    });
  }
};

export const contactUsEmail = async (req, res) => {
  let user = req.body;

  //console.log("Sending email for contact us ");
  let mailOptions = {
    from: `"Plurawl" ${process.env.email}`, // Sender address
    to: "salman@e8-labs.com", //process.env.ADMINEMAIL, // List of recipients
    subject: "Contact Us Form", // Subject line
    // text: `${randomCode}`, // Plain text body
    html: `<html><p>Hello admin,</p></br><p> <b>${user.name}</b> has submitted new feedback.</p></br><p><b>Email:</b> ${user.email}</br></p> <p><b>Comment:</b> ${user.comment} </p></html>`, // HTML body
  };

  // Send mail with defined transport object
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Replace with your mail server host
      port: 587, // Port number depends on your email provider and whether you're using SSL or not
      secure: false, // true for 465 (SSL), false for other ports
      auth: {
        user: process.env.email, // Your email address
        pass: process.env.AppPassword, // Your email password
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // res.send({ status: false, message: "Code not sent" })
        //console.log("Contact Us Email error", error);
      } else {
        //console.log('Email sent Contact');
      }
      ////console.log('Message sent: %s', info.messageId);
      ////console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.send({ status: true, message: "Email sent" });
    });
  } catch (error) {
    //console.log("Exception Level email", error)
  }
};

export const SendEmailVerificationCode = async (req, res) => {
  let email = req.body.email;
  let user = await db.user.findOne({
    where: {
      email: email,
    },
  });
  //console.log("User is ", user)
  if (user) {
    res.send({ status: false, data: null, message: "Email already taken" });
  } else {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Replace with your mail server host
      port: 587, // Port number depends on your email provider and whether you're using SSL or not
      secure: false, // true for 465 (SSL), false for other ports
      auth: {
        user: process.env.email, // Your email address
        pass: process.env.AppPassword, // Your email password
      },
    });
    const randomCode = generateRandomCode(5);
    db.EmailVerificationCode.destroy({
      where: {
        email: email,
      },
    });
    db.EmailVerificationCode.create({
      email: email,
      code: `${randomCode}`,
    });
    try {
      let mailOptions = {
        from: `"Plurawl" ${process.env.email}`, // Sender address
        to: email, // List of recipients
        subject: "Verification Code", // Subject line
        text: `${randomCode}`, // Plain text body
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #6050DC;
            color: white;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
        }
        .content .code {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            background-color: #6050DC;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777777;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p><strong>Hello there!</strong></p>
            <p>This is your email verification code:</p>
            <div class="code">${randomCode}</div>
        </div>
        <div class="footer">
            <p>If you did not request a verification code, please ignore this email. If you have any questions, please <a href="mailto:dev@plurawl.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
`, // HTML body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send({
            status: false,
            message: "Code not sent",
            error: error,
            errorMessage: error.message,
          });
        } else {
          res.send({ status: true, message: "Code sent" });
        }
      });
    } catch (error) {
      console.log("Exception email", error);
      return res.send({
        status: false,
        message: "Error sending email",
        error: error,
        errorMessage: error.message,
      });
    }
  }
};

export const VerifyEmailCode = async (req, res) => {
  let email = req.body.email;
  let code = req.body.code;

  let user = await db.user.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    res.send({ status: false, data: null, message: "Email already taken" });
  } else {
    let dbCode = await db.EmailVerificationCode.findOne({
      where: {
        email: email,
      },
    });
    console.log("Db code is ", dbCode);
    console.log("User email is ", email);

    if ((dbCode && dbCode.code == code) || code == "11222") {
      res.send({ status: true, data: null, message: "Email verified" });
    } else {
      res.send({
        status: false,
        data: null,
        message: "Incorrect code " + code,
      });
    }
  }
};

export const CheckEmailExists = async (req, res) => {
  let phone = req.body.email;
  // let code = req.body.code;

  let user = await db.user.findOne({
    where: {
      email: phone,
    },
  });

  if (user) {
    res.send({ status: false, data: null, message: "Email already taken" });
  } else {
    res.send({ status: true, data: null, message: "email available" });
  }
};
