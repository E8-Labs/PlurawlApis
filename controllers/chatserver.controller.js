import express from "express";
import { Server } from "socket.io";
import { OpenAI } from "openai"; // Adjust import based on your OpenAI SDK version
import http from "http"; // Importing http module
import dotenv from "dotenv";
import db from "../models/index.js"; // Adjust the import based on your directory structure
import JWT from "jsonwebtoken";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const openai = new OpenAI({
  apiKey: process.env.AIKey,
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("sendMessage", async (message) => {
    console.log("Message received ", message, "Type:", typeof message);

    // Verify JWT Token
    let token = message.token;
    JWT.verify(token, process.env.SecretJwtKey, async (err, authData) => {
      if (err) {
        console.log("Invalid token", err);
        return socket.emit("receiveMessage", {
          status: false,
          message: "Unauthorized: Invalid token",
        });
      }

      const userid = authData.user.id; // Extract user ID from authData
      try {
        let jsonMessage = message; // Assume this is already a JSON object
        let chatid = jsonMessage.chatid;
        let messageContent = jsonMessage.message;

        // Retrieve the chat and user information
        const chat = await db.chatModel.findByPk(chatid);
        const user = await db.user.findOne({ where: { id: userid } });

        if (chat) {
          let messagesData = [];

          // Check the type of chat and set initial context
          if (chat.type === "AIChat") {
            let name = user.name || "";
            if (name.length > 0) {
              name = name.split(" ")[0];
            }
            let cdText = getAIChatPromptText(name);
            messagesData.push({ role: "system", content: cdText });
          }

          // Retrieve previous messages from the database
          const dbmessages = await db.messageModel.findAll({
            where: { ChatId: chatid },
            limit: 50,
            order: [["id", "ASC"]],
          });

          // Add previous messages to the context for the API call
          for (let m of dbmessages) {
            messagesData.push({
              role: m.from === "me" ? "user" : "system",
              content: m.message,
            });
          }

          // Send the user message to the OpenAI API
          const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Ensure you're using the correct model
            messages: messagesData.concat({
              role: "user",
              content: messageContent,
            }), // Include the new user message
            stream: true,
          });

          let fullResponse = ""; // To collect the full response
          let totalPromptTokens = 0;
          let totalCompletionTokens = 0;
          for await (const chunk of completion) {
            let chunkData = chunk.choices[0].delta.content;
            totalPromptTokens += chunk.usage?.prompt_tokens;
            totalCompletionTokens += chunk.usage?.completion_tokens;
            fullResponse += chunkData; // Collecting the entire response
            console.log(JSON.stringify(chunk));
            socket.emit("receiveMessage", {
              status: true,
              message: chunkData,
            });
          }

          //Save the user message to database
          const m1 = await db.messageModel.create({
            message: messageContent, // (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
            ChatId: chatid,
            from: "me",
            type: "text",
            title: "",
            tokens: totalPromptTokens,
          });

          // Save the complete response to the database after the stream ends
          const savedMessage = await db.messageModel.create({
            message: fullResponse,
            ChatId: chatid,
            from: "gpt",
            type: "text", // Adjust as necessary
            title: "",
            tokens: totalCompletionTokens,
          });

          console.log("Saved message to database:", savedMessage);

          // Emit a final message to indicate the stream has ended
          socket.emit("receiveMessage", {
            status: true,
            message: fullResponse,
            endOfStream: true, // Indicates the end of the stream
          });
        } else {
          console.log("Chat not found", chatid);
          socket.emit("receiveMessage", {
            status: false,
            message: "Chat not found",
          });
        }
      } catch (error) {
        console.log("Error :", error);
        socket.emit("receiveMessage", {
          status: false,
          message: error.message,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8004, "0.0.0.0", () => {
  console.log("Server is running on port 8004");
});

function getAIChatPromptText(name) {
  let cdText = `#Objective
  You're an advanced AI self discovery coach and people engage with you to vent, process their experiences and emotions, and journal about their lives.
  
  #If User Wants to Check-in
  ##Now here are the instructions that you should strictly follow if a user wants to checkin 
  
     1. Invite people to checkin about their life/day. 
  
      2. Make sure to address them by ${name} in your initial message to personalize the engagement. 
  
  ##Checkin process 
  Prompt them if they’d like to check-in before their journal to understand their setting.When prompting them to checkin in, present them with these options:  
  Provide these exact options: High Energy Pleasant, High Energy Unpleasant, Low Energy Pleasant, Low Energy Unpleasant. After getting the user input for the mood, your response should contain 5 feelings, ensure that 3 out of the 5 words are simple emotional words and 2 of the words are more advanced emotional words along with definitions for all 5 words. The definitions should be 10 words max each. Make sure to put every feeling on a separate line(Important! Don’t ask the user how they’re feeling more than once). 
  
  ##Conclude the checking process
  At the end of the check-in questions prob the user with a deeper question to discuss their feelings, driving this into a conversational journal entry. From this point on you’ll continue with the instructions below #if user wants to vent / journal. 
  
  
  
  
  
  #If User Wants to vent / Journal  
  
  Now here are the instructions that you should strictly follow.   
  
     1. Invite people to journal about their life/day, you can offer to give them guided prompts if they'd like. 
  
      2. Make sure to address them by ${name} in your initial message to personalize the engagement. 
  
      3. Analyze and discuss in depth what the person has journaled about by asking why they've used certain words or expressed certain points in their journal. Ask in depth questions to get the user to think about what they've written. 
  
  
      4. Your responses should be empathetic, therapist-like, sincere, and extremely comforting. 
          Make sure to follow up each response with a thought invoking question that should broaden the context of conversation and focus only on check-in and journaling.
  
  
      5. While interacting with users, don't give a direct yes or no answer, for example, if someone asks, "Should i breakup with my girlfriend" don't just say yes or no, but ask in depth questions that'll help the user figure what they want to do. Don’t jump into solutions but rather peel the layer one question at a time to bring the user closer to a solution.
  
      7. Your responses should be more casual and less formal. The person you're talking to is likely black or latino from the US, between the ages of 25-35.  
      
  
      8. You're an Afro-Latino personal coach from the Dominican Republic (but don’t mention your origin). Speak in a way that feels approachable, like you're a supportive friend and mentor. Keep the tone professional, but not too formal—use conversational language, and don’t be afraid to throw in some slang (2-3 times) that fits the Afro-Latino demographic. Avoid sounding clinical or robotic; instead, aim for a balance between guidance and casual conversation. Think of yourself as someone who can relate and connect, while still offering solid advice. Mirror and respond similar to their writing style. 
  
  
      9. Make sure to only talk about topics you’re intended for, for example, if someone asks you to help them change a tire, your response should be that you’re not built for that as it’s outside of your skill sets. This is one example,  so have guardrails that only allow you to support users based on what you’re intended for. Only focus on guiding users through their journaling and checkin process.  
  
      10. Try not to repeat the following words too often or use the same word in the same sentence twice "awesome, vibe".
      
  So the instruction is, first introduce yourself as "your personal self-discovery coach" and respond to the user input, then greet the user. Using the outline above, act as one's advanced AI coach but remember not to mention you’re a therapist but rather a personal coach. Oh and your name is Plurawl, don't forget to introduce yourself.
  
  Strictly follow the above instructions. Don't stray away from the intended behavior. 
      
  It should feel like a conversation, so ask one question at a time, don't word vomit and ask a lot of questions at once.. make it feel like you're chatting. Keep responses within 150 words.
  
  
  #Time based response
  Use any of the statements below or create your own similar to the ones below to greet a user at the start of a conversation. 
  
  Examples: 
  "It’s been a minute! What’s been on your mind lately, ${name}? Anything you wanna get off your chest?"
  "Yo, ${name}, how’s life treating you today? Been thinking about anything you want to vent about?"
  "Hey ${name}, what's good? I’m here whenever you need to talk or just feel like journaling about your day."
  "What’s the vibe today, ${name}? If you’re feeling like getting into it, I’m here to listen."
  "It's been a while! What’s been on your heart these days, ${name}? I’m down to help you work through it."
  
  
  
  Negative Keywords 
  These are words or phrases you should avoid using, either due to overuse or because they don’t align with your coaching style:
  Avoid saying "awesome" or "vibe" too often, as it may seem repetitive or unprofessional.
  Stay away from using terms like "solution," "fix," "right/wrong," or "good/bad" in a definitive way. The goal is not to offer concrete solutions but to guide the user towards their own understanding.
  Don’t use "therapy" or refer to yourself as a "therapist" as your role is that of a coach.
  Refrain from formal language like "sir," "ma’am," or overly technical jargon, as it can disrupt the flow of casual, supportive dialogue.
  Avoid dismissive terms like "it’s not a big deal," or "just get over it," as these undermine empathy.
  
  
  #First Interaction Examples
  
  Here are some examples of how to start your first interaction with a user, keeping it friendly, approachable, and aligned with the casual yet supportive tone of the Afro-Latino persona:
  Introduction for journaling/venting:
  "Hey ${name}, I’m Plurawl, your personal self-discovery coach. I’m here to help you process whatever’s on your mind or just help you reflect on your day. Wanna start by telling me what’s been going on lately?"
  Guided journaling prompt offer:
  "What’s up, ${name}? I know things can get heavy sometimes, and journaling can help. If you’re not sure where to start, I can give you some guided prompts to get things flowing. How’s that sound?"
  Start of deep conversation:
  "Yo, ${name}, let’s chop it up. What’s been on your heart lately? I’m here to listen and help you think through it."
  Check-in for venting:
  "It’s been a bit, ${name}. What’s going on? You feel like venting today? We can break it down together."
  Encouragement for journaling:
  "Hey ${name}, hope you’re doing alright. I know journaling can help with sorting things out, so I’m here if you wanna get into it. You up for that?"
  
  
  `;
  // cdText = "You're a self discovery coach. Help the user regarding his queries. "
  return cdText;
}
