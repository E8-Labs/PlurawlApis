const express = require("express");
const { Server } = require("socket.io");
const OpenAI = require("openai");

const app = express();
const server = require("http").createServer(app);
const io = new Server(server);
const openai = new OpenAI({
  apiKey: process.env.AIKey,
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (message) => {
    const responseStream = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    responseStream.on("data", (chunk) => {
      const chunkData = chunk.choices[0].delta.content; // Extract the content from the chunk
      socket.emit("receiveMessage", chunkData); // Emit the chunk back to the client
    });

    responseStream.on("end", () => {
      socket.emit("receiveMessage", ""); // Emit an empty string to signify end of message
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
