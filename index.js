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
import { verifyJwtToken } from "./middleware/jwtmiddleware.js";

import dotenv from 'dotenv';
dotenv.config();

const upload = multer();
const uploadImg = upload.single("image");

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Apply CORS middleware
app.use(cors({
  origin: 'https://plurawlsubscriptions.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Uncomment this line if you need to send cookies or other credentials
}));

// Parse JSON bodies
app.use(express.json());

// Handle preflight requests
app.options('*', cors());

import db from "./models/index.js";
import journalRouter from "./routes/journal.router.js";
import chatRouter from "./routes/chat.router.js";
import adminRouter from "./routes/admin.router.js";

db.sequelize.authenticate().then(() => {
  console.log("Connected to the database!");
}).catch(err => {
  console.error("Cannot connect to the database!", err);
  // process.exit();
});

// Sync database
db.sequelize.sync({ alter: true });

app.use("/api/users", uploadImg, userRouter);
app.use("/api/journal", journalRouter);
app.use("/api/chat", verifyJwtToken, chatRouter);
app.use("/api/admin", verifyJwtToken, adminRouter);

const server = app.listen(process.env.PORT, () => {
  console.log("Server started listening on " + (process.env.PORT || 3000));
});
