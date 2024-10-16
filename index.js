import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import userRouter from "./routes/user.router.js";
import nodeCron from "node-cron";
import chalk from "chalk";
import moment from "moment-timezone";

import { GenerateQuote } from "./controllers/user.controller.js";
import {
  getWeeklyDates,
  getJournalsInAWeek,
  GetSnapshotFromJournals,
} from "./controllers/journal.controller.js";
import {
  verifyJwtToken,
  verifyJwtTokenOptional,
} from "./middleware/jwtmiddleware.js";

import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";

const upload = multer({
  // storage: multer.memoryStorage(), // or specify diskStorage if saving files to disk
  limits: {
    fileSize: 20 * 1024 * 1024, // 10 MB (or set to a value suitable for your use case)
    fieldSize: 20 * 1024 * 1024, // 10 MB for the field value (if needed)
  },
});
const uploadImg = upload.single("image");

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

app.use(
  cors({
    origin: "https://plurawlsubscriptions.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Manually handle preflight requests
app.options("*", (req, res) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://plurawlsubscriptions.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

import db from "./models/index.js";
import journalRouter from "./routes/journal.router.js";
import chatRouter from "./routes/chat.router.js";
import adminRouter from "./routes/admin.router.js";

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Cannot connect to the database!", err);
    // process.exit();
  });

// Sync database
db.sequelize.sync({ alter: true });

app.use("/api/users", uploadImg, userRouter);
app.use("/api/journal", journalRouter);
app.use("/api/chat", verifyJwtToken, chatRouter);
app.use("/api/admin", verifyJwtToken, adminRouter);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// const server = app.listen(process.env.Port, () => {
//   console.log("Server started listening on " + process.env.Port);
// });
const server = app.listen(process.env.Port, "0.0.0.0", () => {
  console.log("Server started listening on port 8003");
});

//Socket Connection

const io = new Server(server, {
  // cors: {
  //   origin: 'https://plurawlsubscriptions.vercel.app', // Replace with your client's URL
  //   methods: ['GET', 'POST'],
  //   credentials: true
  // }
});

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle incoming messages from clients
  socket.on("message", (data) => {
    console.log("Message received:", data);
    // You can broadcast the message or handle it as per your requirements
    io.emit("message", data); // Echo back the message to all clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
