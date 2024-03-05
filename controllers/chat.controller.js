import db  from '../models/index.js'
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import axios from "axios";

// import { Pinecone } from "@pinecone-database/pinecone";




// const  ChatResource = require("../resources/chat/chatresource")
// const  MessageResource = require("../resources/chat/messageresource");
// const e = require("express");


const User = db.user;
const Chat = db.chatModel;
const Message = db.messageModel;




export const CreateChat = async (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData)=> {
        if (authData){
            console.log("User in chat is ")
            console.log(authData)

            let cd = null
            if(typeof(req.body.cd) !== 'undefined'){
                cd = req.body.cd
            }
            let snapshot = null
            if(typeof(req.body.snapshot) !== 'undefined'){
                snapshot = req.body.snapshot
            }
            try{
                const result = await db.sequelize.transaction(async (t) => {
                    const promptid = req.body.promptId;
                const userid = authData.user.id;
                
                    const chatData = {
                        title: req.body.title,
                        UserId: userid,
                        snapshot: snapshot,
                        cd: cd
                    }
                    
                    let chatCreated = await Chat.create(chatData, { transaction: t })
                    if(chatCreated){
                        if(cd){
                            let cdText = `What do you think is causing you to use ${cd}?`
                            const m1 = await db.messageModel.create({
                                message: cdText,// (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                                ChatId: chatCreated.id,
                                from: "gpt",
                                type: "text",
                                title: "",
                            }, { transaction: t });

                        }
                    }
                    res.send({message: "Chat created", data: chatCreated, status: true});
                    
                
                })
                // res.send(result);
            }
            catch(error){
                // await t.rollback();
                res.send({message: "Error Transaction " + error, data: error, status: false});
            }
        }
        else{
            res.send({status: false, message: "Unauthenticated user", data: null})
        }
    })
}


function GenerateFirstMessageForCD (chat, message){
    let messagesData = [{role: "system", content: "You're a helpfull assistant. Reply according to the context of the previous conversation to the user."}, {role: "user", content: message}]
                                    if(chat.snapshot !== null){
                                        messagesData.splice(0, 0, {role: "system", content: `Here is the summary of the user journal. Based on this you have asked the user why he has used the particular cognitive distortion in this journal he wrote. ${m.message}. Now user will respond. Reply accordingly by keeping inside the scope of the journal context.`})
                                    }
}

export const UpdateChat = async(req, res) =>{
    JWT.verify(req.token, process.env.SecretJwtKey, async(err, authData) => {
        if(authData){
            let index = req.body.stackedPromptIndexToShow;
            let chatid = req.body.chatid;
            let chat = await db.chat.findByPk(chatid);
            if(chat){
                chat.stackedPromptIndexToShow = index;
                const saved = await chat.save();
                res.send({status: true, message: "Chat updated", data: chat})

            }
            else{
                res.send({status: false, message: "No such chat", data: null})
            }
        }
        else{
            res.send({status: false, message: "Unauthenticated user", data: null})
        }
    })
}



async function sendQueryToGpt (message, messageData){
    console.log("Sending Message " + message)
    

    // console.log("Sending this summary to api ", summary);
    messageData.push({
        role: "system",
        content: "You're a helpful assistant. So reply me keeping in context the whole data provided. Keep the response short and make it complete response.", // summary will go here if the summary is created.
      });

      messageData.push({
        role: "user",
        content: message // this data is being sent to chatgpt so only message should be sent
      });
    const APIKEY = process.env.AIKey;
                console.log( APIKEY)
                const headers = {}
                const data = {
                    model: "gpt-4-1106-preview",
                    // temperature: 1.2,
                    messages: messageData,
                    // max_tokens: 1000,
                }
                // setMessages(old => [...old, {message: "Loading....", from: "gpt", id: 0, type: MessageType.Loading}])
                const result = await axios.post("https://api.openai.com/v1/chat/completions", data, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${APIKEY}`
                    }
                });
                
                // console.log(result.data)
                // setMessages(messages.filter(item => item.type !== MessageType.Loading)) // remove the loading message
                if(result.status === 200){
                    let gptMessage = result.data.choices[0].message.content;
                    return gptMessage;
                }
                else{
                    return null;
                }
}




export const SendMessage = async(req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
        console.log("Sending message", req.body.chatid)
        if(authData){
            const userid = authData.user.id;
            const chatid = req.body.chatid;
            const chat = await db.chatModel.findByPk(chatid);

            try{
                
                    if(chat){
                        console.log("Chat exists")
                        const message = req.body.message;
                            console.log("Messages saving ", message)

                            //check if there is a summary saved
                            // let messageWithSummary = await db.chat.findByPk(chatid);
                            // console.log("Chat found ", messageWithSummary)
                            // let summary = null;
                            // if(messageWithSummary.summary !== null){
                            //     summary = messageWithSummary.summary;
                            // }
                            let messagesData = []
                            // if(summary !== null){ // 
                            //     console.log("Summary already exists")
                            //     messagesData = [{role: "user", content: "generate summary of previous conversation"}, {role: "system", content: summary}, {role: "user", content: message}]
                            // }
                            // else{
                                const dbmessages = await db.messageModel.findAll({
                                    where: {
                                        ChatId: chatid
                                    },
                                    limit: 50,
                                    order: [
                                        ["id", "DESC"]
                                    ]
                                });
                                if(dbmessages.length > 0){
                                    // messagesData = [{role: "system", content: "You're a helpfull assistant. Reply according to the context of the previous conversation to the user."}, {role: "user", content: messages[0].message}]
                                    console.log("Messages are in db")
                                    for (let i = 0; i < dbmessages.length; i++) { 
                                        let m = dbmessages[i]
                                        messagesData.push({role: m.from === "me" ? "user" : "system", content: m.message})
                                    }
                                    if(chat.snapshot !== null){
                                        messagesData.splice(0, 0, {role: "system", content: `Here is the summary of the user journal. Based on this you have asked the user why he has used the particular cognitive distortion in this journal he wrote. ${chat.snapshot}. The further conversation follows.`})
                                    }
                                }
                                else{
                                    console.log("No messages, new chat")
                                    messagesData = [{role: "system", content: "You're a helpfull assistant. Reply according to the context of the previous conversation to the user."}, {role: "user", content: message}]
                                    if(chat.snapshot !== null){
                                        messagesData.splice(0, 0, {role: "system", content: `Here is the summary of the user journal. Based on this you have asked the user why he has used the particular cognitive distortion in this journal he wrote. ${chat.snapshot}. Now user will respond. Reply accordingly by keeping inside the scope of the journal context.`})
                                    }
                                    // messagesData = [{role: "user", content: messages[0].message}]
                                }
                            // }

                            

                                  sendQueryToGpt(message, messagesData).then(async (gptResponse) =>{
                                    if(gptResponse){
                                        const result = await db.sequelize.transaction(async (t) => {
                                            t.afterCommit(() => {
                                                console.log("\n\nTransaction is commited \n\n")
                                            });

                                            const m1 = await db.messageModel.create({
                                                message: message,// (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                                                ChatId: chatid,
                                                from: "me",
                                                type: "text",
                                                title: "",
                                            }, { transaction: t });
                                            const m2 = await db.messageModel.create({
                                                message: gptResponse,
                                                ChatId: chatid,
                                                from: "gpt",
                                                type: "text"//messages[1].type
                                            }, { transaction: t });
                                            

                                            
                                            // await t.commit();
                                            res.send({status: true, message: "Messages sent", data: {messages: [m1, m2], chat: chat}});
                                        })
                                        
                                    }
                                    else{
                                        res.send({status: false, message: "Error sending message to gpt", data: null});
                                    }
                                    
                                  })
                                  
                            // })
                            

                            
                        // }
                        // else{
                        //     await t.rollback();
                        //     res.send({status: false, message: "error sending message", data: null})
                        // }
        
                    }
                    else{
                        // no such chat exists
                        res.send({status: false, message: "No chat exists", data: null})
                    }

                // })
            }
            catch(error){
                res.send({status: false, message: "Exception " + error, data: null})
            }

            
        }
        else{
            res.send({status: false, message: "Unauthenticated user", data: null})
        }
    })
}


async function generateSummaryFromGPT(messageData){
    const APIKEY = process.env.AIKey;
    console.log( APIKEY)
    console.log("Generating summary from ", messageData);
    const headers = {}
    
    const data = {
        model: "gpt-4",
        // temperature: 1.2,
        messages: messageData,
        max_tokens: 500,
    }
    const result = await axios.post("https://api.openai.com/v1/chat/completions", data, {
      headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${APIKEY}`
      }
    });

    if(result.status === 200){
      let gptMessage = result.data.choices[0].message.content;
      console.log("Summary response is ", gptMessage)
      return gptMessage
    }
    else{
      console.log("Summary response error ")
      return null
    }
}


export const GetMessages = async(req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
        if(authData){
            const userid = authData.user.id;
            const chatid = req.query.chatid;
            const chat = await db.chatModel.findByPk(chatid);
            if(chat){
                const offset = Number(req.query.offset || 0);
                const messages = await Message.findAll({
                    where: {
                        ChatId: chatid
                    },
                    offset: offset,
                    limit: 100,
                });
                if(messages){
                    res.send({status: true, message: "Messages ", data: await messages});
                }
                else{
                    res.send({status: false, message: "error sending message", data: null})
                }

            }
            else{
                console.log("Not such chat", chatid)
                // no such chat exists
                res.send({status: false, message: "No such chat", data: null})
            }
        }
        else{
            res.send({status: false, message: "Unauthenticated user", data: null})
        }
    })
}

export const GetChatsList = async(req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async(error, authData) => {
        if(authData){
            let offset = Number(req.query.offset) || 0;

            const chats = await db.chat.findAll({
                
                where:{
                    UserId: authData.user.id,
                    PromptId: {
                        [db.Sequelize.Op.ne]: null
                    }
                },
                order: [
                    ["id", "DESC"]
                ],
                offset: offset,
                limit: 20
            })


            res.send({status: true, message: "Chat list", data: await ChatResource(chats)})

        }
        else{

        }
    })


}