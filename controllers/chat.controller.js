import db from "../models/index.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import axios from "axios";
import chalk from "chalk";
import {
  addToVectorDbChat,
  findVectorDataChat,
} from "../services/pineconedb.js";

// import { Pinecone } from "@pinecone-database/pinecone";

// const  ChatResource = require("../resources/chat/chatresource")
// const  MessageResource = require("../resources/chat/messageresource");
// const e = require("express");

const User = db.user;
const Chat = db.chatModel;
const Message = db.messageModel;

const GptModel = "gpt-4-turbo-preview"; //"gpt-3.5-turbo-0125";//"gpt-4-turbo-preview";//

export const CreateChat = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
    if (authData) {
      ////console.log("User in chat is ")
      ////console.log(authData)

      let chattype = "journal";
      if (typeof req.body.chattype !== "undefined") {
        chattype = req.body.chattype;
      }
      let cd = null;
      if (typeof req.body.cd !== "undefined") {
        cd = req.body.cd;
      }
      let snapshot = null;
      if (typeof req.body.snapshot !== "undefined") {
        snapshot = req.body.snapshot;
      }
      try {
        const result = await db.sequelize.transaction(async (t) => {
          const promptid = req.body.promptId;
          const userid = authData.user.id;
          // let journalId = req.body.journalId;

          const chatData = {
            title: req.body.title,
            UserId: userid,
            snapshot: snapshot,
            cd: cd,
            type: chattype,
          };

          let chatCreated = await Chat.create(chatData, { transaction: t });
          if (chatCreated) {
            if (cd) {
              let cdText = `What do you think is causing you to use ${cd}?`;
              const m1 = await db.messageModel.create(
                {
                  message: cdText, // (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                  ChatId: chatCreated.id,
                  from: "gpt",
                  type: "text",
                  title: "",
                },
                { transaction: t }
              );
              res.send({
                message: "Chat created",
                data: chatCreated,
                status: true,
              });
            } else if (typeof req.body.chattype !== "undefined") {
              // let type = req.body.type;
              if (chattype === "AIChat") {
                res.send({
                  message: "Chat created",
                  data: chatCreated,
                  status: true,
                });
                //started from the main screen dashboard
                //this will lead to  entry of journal through chat

                //We will let user send the first message then this prompt will be sent in AI Chat
                //   GenerateFirstMessageForAIChat(chatCreated, authData.user, (messages)=>{
                //     if(messages){
                //         res.send({ message: "Chat created", data: chatCreated, status: true });
                //       }
                //       else{
                //         res.send({ message: "Chat created", data: chatCreated, status: true });
                //       }
                //   })
              }
            }
          }
        });
        // res.send(result);
      } catch (error) {
        // await t.rollback();
        console.log("Excption", error);
        res.send({
          message: "Error Transaction " + error,
          data: error,
          status: false,
        });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

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





#If User Wants to vent or Start Journaling  

Now here are the instructions that you should strictly follow.   

   1. Invite people to journal about their life/day, you can offer to give them guided prompts if they'd like. 

    2. Select one of these options at random: 
      1) "Hey ${name}, I’m here to help you process whatever’s on your mind or just help you reflect on your day. Wanna start by telling me what’s been going on lately?"
         Guided journaling prompt offer:
      2) "What’s up, ${name}? I know things can get heavy sometimes, and journaling can help. If you’re not sure where to start, I can give you some guided prompts to get things flowing. How’s that sound?"
         Start of deep conversation:
      3) "YOOO, ${name}, let’s jump into it. What’s been on your heart lately? I’m here to listen and help you think through it."
         Encouragement for journaling:
      4) "Hey ${name}, hope you’re doing alright. I know journaling can help with sorting things out, so I’m here if you wanna get into it. You down for that?" 

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

async function GenerateFirstMessageForAIChat(
  chat,
  user,
  message = null,
  callback
) {
  let name = user.name || "";
  if (name.length > 0) {
    name = name.split(" ")[0];
  }

  let cdText = getAIChatPromptText(name);
  let messagesData = [{ role: "system", content: cdText }];
  // if (message) {
  //     messagesData = [{ role: "system", content: cdText }, { role: 'user', content: message }]
  // }
  //console.log("First promt from user AI Chat", messagesData)
  sendQueryToGpt(message, messagesData).then(async (gptResponse) => {
    if (gptResponse) {
      //console.log("Gpt Response Cost ", gptResponse.total_cost)
      chat.total_cost += gptResponse.total_cost;
      let savedChat = await chat.save();
      const result = await db.sequelize.transaction(async (t) => {
        t.afterCommit(() => {
          ////console.log("\n\nTransaction is commited \n\n")
        });

        const m1 = await db.messageModel.create(
          {
            message:
              message != null
                ? message.replace(/^"|"$/g, "")
                : cdText.replace(/^"|"$/g, ""), // (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
            ChatId: chat.id,
            from: message != null ? "me" : "gpt",
            type: message != null ? "text" : "promptinvisible",
            title: "",
            tokens: gptResponse.prompt_tokens,
          },
          { transaction: t }
        );
        const m2 = await db.messageModel.create(
          {
            message: gptResponse.gptMessage.replace(/^"|"$/g, ""),
            ChatId: chat.id,
            from: "gpt",
            type: "text", //messages[1].type
            tokens: gptResponse.completion_tokens,
          },
          { transaction: t }
        );

        callback([m1, m2]);
      });
    } else {
      callback(null);
    }
  });
}

export const UpdateChat = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
    if (authData) {
      let index = req.body.stackedPromptIndexToShow;
      let chatid = req.body.chatid;
      let chat = await db.chat.findByPk(chatid);
      if (chat) {
        chat.stackedPromptIndexToShow = index;
        const saved = await chat.save();
        res.send({ status: true, message: "Chat updated", data: chat });
      } else {
        res.send({ status: false, message: "No such chat", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

async function sendQueryToGpt(message, messageData) {
  ////console.log("Sending Message " + message)

  ////console.log(messageData)
  // ////console.log("Sending this summary to api ", summary);
  // messageData.push({
  //     role: "system",
  //     content: "You're a helpful assistant. So reply me keeping in context the whole data provided. Keep the response short and make it complete response. keep all of your responses within 300 words or less.", // summary will go here if the summary is created.
  // });

  messageData.push({
    role: "user",
    content: message, // this data is being sent to chatgpt so only message should be sent
  });
  console.log(
    "################################################################",
    messageData.length
  );
  console.log(messageData);

  console.log(
    "################################################################",
    messageData.length
  );
  const APIKEY = process.env.AIKey;
  ////console.log(APIKEY)
  const headers = {};
  const data = {
    model: GptModel,
    // temperature: 1.2,
    messages: messageData,
    // max_tokens: 1000,
  };
  // setMessages(old => [...old, {message: "Loading....", from: "gpt", id: 0, type: MessageType.Loading}])
  const result = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    data,
    {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${APIKEY}`,
      },
      timeout: 240000, // Timeout in milliseconds (4 minutes)
    }
  );

  //console.log("==============================")
  //console.log(result)
  //console.log("==============================")
  // setMessages(messages.filter(item => item.type !== MessageType.Loading)) // remove the loading message
  if (result.status === 200) {
    //console.log(result.data)
    let gptMessage = result.data.choices[0].message.content;
    //console.log(chalk.red(gptMessage))
    let tokens = result.data.usage.total_tokens;
    let prompt_tokens = result.data.usage.prompt_tokens;
    let completion_tokens = result.data.usage.completion_tokens;

    let inputCostPerToken = 10 / 1000000;
    let outoutCostPerToken = 30 / 1000000;

    let inputCost = inputCostPerToken * prompt_tokens;
    let outputCost = outoutCostPerToken * completion_tokens;

    let totalCost = inputCost + outputCost;
    //console.log("Total cost this request", totalCost);
    return {
      gptMessage: gptMessage,
      tokens: tokens,
      completion_tokens: completion_tokens,
      prompt_tokens: prompt_tokens,
      total_cost: totalCost,
    };
  } else {
    return null;
  }
}

function splitMessageOld(message) {
  let wordsThreshold = 50;
  const words = message.split(" ");
  if (words.length <= wordsThreshold) {
    return [message]; // Return the original message as an array with one element
  } else {
    const firstPart = words.slice(0, wordsThreshold).join(" "); // Take the first 50 words
    const remainingPart = words.slice(wordsThreshold).join(" "); // Take the remaining words
    if (remainingPart.split(" ").length < 10) {
      return [message]; // Return the original message as an array with one element
    } else {
      return [firstPart, remainingPart]; // Return two parts of the message as an array
    }
  }
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function splitMessage(text) {
  if (countWords(text) <= 60) {
    return [text];
  }

  // Split text into sentences using a regex that captures sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]\s*/g) || [];
  let firstPart = "";
  let secondPart = "";
  let totalWords = countWords(text);
  let wordsInFirstPart = 0;
  let targetWordCount = Math.floor(totalWords / 2);

  // Accumulate sentences into the first part until approximately half the total words
  for (let sentence of sentences) {
    if (wordsInFirstPart < targetWordCount) {
      firstPart += sentence;
      wordsInFirstPart = countWords(firstPart);
    } else {
      secondPart += sentence;
    }
  }

  // Adjust if necessary to ensure that neither part is too short
  if (countWords(firstPart) < targetWordCount - 10) {
    // a threshold to avoid small second parts
    let lastSentence = sentences.find((sentence) =>
      firstPart.includes(sentence)
    );
    secondPart = lastSentence + secondPart;
    firstPart = firstPart.replace(lastSentence, "");
  }

  if (secondPart.length < 10) {
    return [firstPart + secondPart];
  }
  return [firstPart, secondPart]; //{ canSplit: true, firstPart: firstPart, secondPart: secondPart };
}

function splitMessage2(text) {
  // Regular expression to detect sentence boundaries more inclusively
  const sentenceRegex = /(?<=[.!?])\s+|\n/;
  // Split text into sentences
  const sentences = text
    .split(sentenceRegex)
    .filter((s) => s.trim().length > 0);

  if (sentences.length === 0) return [text]; // Return the original text if no sentences detected

  let firstPart = [];
  let totalWords = 0;
  let index = 0;

  // Aggregate sentences into the first part until exceeding 100 words
  while (index < sentences.length && totalWords <= 100) {
    const sentence = sentences[index];
    const wordCount = sentence.split(/\s+/).length;

    if (totalWords + wordCount > 100) break; // Break if adding this sentence exceeds 100 words

    firstPart.push(sentence);
    totalWords += wordCount;
    index++;
  }

  // Ensure the second part is not less than 20 words
  let secondPart = sentences.slice(index);
  let secondPartWordCount = secondPart.join(" ").split(/\s+/).length;

  while (secondPartWordCount < 20 && firstPart.length > 0) {
    const lastSentence = firstPart.pop();
    secondPart.unshift(lastSentence);
    secondPartWordCount += lastSentence.split(/\s+/).length;
    totalWords -= lastSentence.split(/\s+/).length;
  }

  if (firstPart.length === 0 || secondPart.length === 0) {
    // If we can't meet the criteria, return the original text as one block
    return [text];
  }

  // Join the parts back into strings
  const firstMessage = firstPart.join(" ");
  const secondMessage = secondPart.join(" ");

  return [firstMessage, secondMessage];
}

const normalizeWhitespace = (text) => text.replace(/\s+/g, " ").trim();
export const SendMessage = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
    //console.log("Sending message", req.body.chatid)
    if (authData) {
      const userid = authData.user.id;
      const chatid = req.body.chatid;
      const chat = await db.chatModel.findByPk(chatid);
      const user = await db.user.findByPk(userid);

      try {
        if (chat) {
          const message = req.body.message;

          //console.log("Chat exists")

          let messagesData = [];
          //console.log("Conditiong 1")
          if (chat.type === "AIChat") {
            //console.log("AI Chat")
            let name = user.name || "";
            if (name.length > 0) {
              name = name.split(" ")[0];
            }

            let cdText = getAIChatPromptText(name);
            //console.log("Cd Text is ", cdText);
            messagesData = [{ role: "system", content: cdText }];
          }
          //console.log("Conditiong 2")
          const dbmessages = await db.messageModel.findAll({
            where: {
              ChatId: chatid,
            },
            limit: 50,
            order: [["id", "ASC"]],
          });
          //console.log("Conditiong 3")
          if (dbmessages.length > 0) {
            let context = await findVectorDataChat(message, chat, user);
            let added = await addToVectorDbChat(message, chat, user);
            if (context && context.length > 0) {
              for (let i = 0; i < context.length; i++) {
                let text = context[i];
                let normalizedText = normalizeWhitespace(text);
                let dbMessage = await db.messageModel.findOne({
                  where: {
                    message: {
                      [db.Sequelize.Op.like]: `%${normalizedText}%`,
                    },
                  },
                });
                console.log(`Finding for text ${text}`);
                if (dbMessage) {
                  console.log("Is in database");
                  messagesData.push({
                    role: dbMessage.from === "me" ? "user" : "system",
                    content: dbMessage.message,
                  });
                } else {
                  console.log("Is not in database");
                  messagesData.push({ role: "system", content: text });
                }
              }
            }

            console.log("Data from Vector DB ", messagesData);
            // return res.send({data: messagesData})
            // messagesData = [{role: "system", content: "You're a helpfull assistant. Reply according to the context of the previous conversation to the user."}, {role: "user", content: messages[0].message}]
            //console.log("Messages are in db", dbmessages.length)
            //console.log("################################################################")
            for (let i = 0; i < dbmessages.length; i++) {
              let m = dbmessages[i];
              // ////console.log(chalk.green(`Message ${m.from}-${m.id} | ${m.message}`))
              messagesData.push({
                role: m.from === "me" ? "user" : "system",
                content: m.message,
              });
            }

            if (chat.snapshot !== null) {
              messagesData.splice(0, 0, {
                role: "system",
                content: `Here is the summary of the user journal. Based on this you have asked the user why he has used the particular cognitive distortion in this journal he wrote. ${chat.snapshot}. The further conversation follows.`,
              });
            }
            messagesData.splice(0, 0, {
              role: "system",
              content: `Keep your response within 150 words.`,
            });

            // if(context && context.length > 0){
            //     console.log('Previous context is ', context )
            //     messagesData.push({ role: "user", content: `Answer the user question and provide the response based on the user's prevous conversations: ${context}` })
            //     // messagesData.splice(0, 0, { role: "system", content: `Use context in your response: ${context}` })
            // }

            sendQueryToGpt(message, messagesData).then(async (gptResponse) => {
              if (gptResponse) {
                //console.log("Gpt Response Cost ", gptResponse.total_cost)
                chat.total_cost += gptResponse.total_cost;
                let savedChat = await chat.save();

                const result = await db.sequelize.transaction(async (t) => {
                  t.afterCommit(() => {
                    ////console.log("\n\nTransaction is commited \n\n")
                  });

                  let messageArray = [];
                  // const cleanedMessages = messages.map((msg) => {
                  //   return {
                  //     ...msg.toJSON(), // Convert Sequelize model instance to plain object
                  //     message: msg.message.replace(/^"|"$/g, ""), // Remove quotes from start and end
                  //   };
                  // });
                  const m1 = await db.messageModel.create(
                    {
                      message: message.replace(/^"|"$/g, ""), // (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                      ChatId: chatid,
                      from: "me",
                      type: "text",
                      title: "",
                      tokens: gptResponse.prompt_tokens,
                    },
                    { transaction: t }
                  );

                  messageArray.push(m1);
                  let added = await addToVectorDbChat(
                    gptResponse.gptMessage,
                    chat,
                    user
                  );
                  let messages = splitMessage(gptResponse.gptMessage);
                  if (messages.length === 1) {
                    const m2 = await db.messageModel.create(
                      {
                        message: messages[0].replace(/^"|"$/g, ""),
                        ChatId: chatid,
                        from: "gpt",
                        type: "text", //messages[1].type
                        tokens: gptResponse.completion_tokens,
                      },
                      { transaction: t }
                    );
                    messageArray.push(m2);
                  } else {
                    let mes1 = messages[0];
                    let mes2 = messages[1];
                    const m2 = await db.messageModel.create(
                      {
                        message: mes1.replace(/^"|"$/g, ""),
                        ChatId: chatid,
                        from: "gpt",
                        type: "text", //messages[1].type
                        tokens: 0,
                      },
                      { transaction: t }
                    );
                    const m3 = await db.messageModel.create(
                      {
                        message: mes2.replace(/^"|"$/g, ""),
                        ChatId: chatid,
                        from: "gpt",
                        type: "text", //messages[1].type
                        tokens: gptResponse.completion_tokens,
                      },
                      { transaction: t }
                    );

                    messageArray.push(m2);
                    messageArray.push(m3);
                  }

                  // await t.commit();
                  res.send({
                    status: true,
                    message: "Messages sent",
                    data: { messages: messageArray, chat: chat },
                  });
                });
              } else {
                res.send({
                  status: false,
                  message: "Error sending message to gpt",
                  data: null,
                });
              }
            });
          } else {
            let added = await addToVectorDbChat(message, chat, user);
            //console.log("No messages, new chat")
            let us = await db.user.findByPk(authData.user.id);
            GenerateFirstMessageForAIChat(
              chat,
              us,
              message,
              async (messages) => {
                if (messages) {
                  // let added = await addToVectorDbChat(gptResponse.gptMessage, chat, user)
                  res.send({
                    status: true,
                    message: "Messages sent",
                    data: { messages: messages, chat: chat },
                  });
                } else {
                  res.send({
                    message: "Error sending message",
                    data: null,
                    status: false,
                  });
                }
              }
            );
            // messagesData = [{role: "user", content: messages[0].message}]
          }
          // }
        } else {
          // no such chat exists
          res.send({ status: false, message: "No chat exists", data: null });
        }

        // })
      } catch (error) {
        console.log(error);
        res.send({ status: false, message: "Exception " + error, data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

async function generateSummaryFromGPT(messageData) {
  const APIKEY = process.env.AIKey;
  ////console.log(APIKEY)
  ////console.log("Generating summary from ", messageData);
  const headers = {};

  const data = {
    model: GptModel,
    // temperature: 1.2,
    messages: messageData,
    max_tokens: 500,
  };
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

  if (result.status === 200) {
    let gptMessage = result.data.choices[0].message.content;
    ////console.log("Summary response is ", gptMessage)
    return gptMessage;
  } else {
    ////console.log("Summary response error ")
    return null;
  }
}

export const GetMessages = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
    if (authData) {
      const userid = authData.user.id;
      const chatid = req.query.chatid;
      const chat = await db.chatModel.findByPk(chatid);
      if (chat) {
        const offset = Number(req.query.offset || 0);
        const messages = await Message.findAll({
          where: {
            ChatId: chatid,
            type: {
              [db.Sequelize.Op.ne]: `promptinvisible`,
            },
          },
          offset: offset,
          limit: 100,
        });

        if (messages) {
          // Remove double quotes from start and end of each message's `message` text
          const cleanedMessages = messages.map((msg) => {
            return {
              ...msg.toJSON(), // Convert Sequelize model instance to plain object
              message: msg.message.replace(/^"|"$/g, ""), // Remove quotes from start and end
            };
          });

          res.send({
            status: true,
            message: "Messages ",
            data: cleanedMessages,
          });
        } else {
          res.send({
            status: false,
            message: "error sending message",
            data: null,
          });
        }
      } else {
        // No such chat exists
        res.send({ status: false, message: "No such chat", data: null });
      }
    } else {
      res.send({ status: false, message: "Unauthenticated user", data: null });
    }
  });
};

export const GetChatsList = async (req, res) => {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let offset = Number(req.query.offset) || 0;

      const chats = await db.chat.findAll({
        where: {
          UserId: authData.user.id,
          PromptId: {
            [db.Sequelize.Op.ne]: null,
          },
        },
        order: [["id", "DESC"]],
        offset: offset,
        limit: 20,
      });

      res.send({
        status: true,
        message: "Chat list",
        data: await ChatResource(chats),
      });
    } else {
    }
  });
};
