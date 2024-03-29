import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import userRouter from "./routes/user.router.js";
import nodeCron from "node-cron";
import chalk from "chalk";
import moment from "moment-timezone";

import { GenerateQuote } from "./controllers/user.controller.js";

import { getWeeklyDates, getJournalsInAWeek, GetSnapshotFromJournals } from "./controllers/journal.controller.js";

// import plaidRouter from "./routes/plaid.router.js";
// import loanRouter from "./routes/loan.router.js";
// import houseRouter from "./routes/hosue.router.js";


import { verifyJwtToken } from "./middleware/jwtmiddleware.js";

import dotenv from 'dotenv'
dotenv.config();


const upload = multer();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"), // cb -> callback
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

const uploadImg = upload.single("image");//multer({storage: storage}).single('image');



const app = express();
app.use(cors());
app.use(express.json());



import db from "./models/index.js";
import journalRouter from "./routes/journal.router.js";
import chatRouter from "./routes/chat.router.js";

db.sequelize.authenticate().then(() => {
  console.log("Connected to the database!");
})
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    // process.exit();
  });

// sync
db.sequelize.sync({ alter: true })//{alter: true}



app.use("/api/users", uploadImg, userRouter);
app.use("/api/journal", journalRouter)
app.use("/api/chat", verifyJwtToken, chatRouter);//verifyJwtToken
// app.use('/api/loans', verifyJwtToken, loanRouter);
// app.use("/api/houses", verifyJwtToken, houseRouter);





const server = app.listen(process.env.Port, () => {
  //console.log("Started listening on " + process.env.Port);
})
