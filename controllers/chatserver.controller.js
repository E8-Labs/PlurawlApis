import express from "express";
import { Server } from "socket.io";
// import { OpenAI } from "openai"; // Adjust import based on your OpenAI SDK version
import http from "http"; // Importing http module

import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// const openai = new OpenAI({
//   apiKey: process.env.AIKey,
// });

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (message) => {
    console.log("Message received ", message);
    // const responseStream = openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: message }],
    //   stream: true,
    // });

    // responseStream.on("data", (chunk) => {
    //   const chunkData = chunk.choices[0].delta.content; // Extract the content from the chunk
    //   socket.emit("receiveMessage", chunkData); // Emit the chunk back to the client
    // });

    // responseStream.on("end", () => {
    //   socket.emit("receiveMessage", ""); // Emit an empty string to signify end of message
    // });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8004, "0.0.0.0", () => {
  console.log("Server is running on port 8004");
});
