import db from '../models/index.js'
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import axios from "axios";
import chalk from 'chalk';

// import { Pinecone } from "@pinecone-database/pinecone";




// const  ChatResource = require("../resources/chat/chatresource")
// const  MessageResource = require("../resources/chat/messageresource");
// const e = require("express");


const User = db.user;
const Chat = db.chatModel;
const Message = db.messageModel;


const GptModel = "gpt-4-turbo-preview";//"gpt-3.5-turbo-0125";//"gpt-4-turbo-preview";//



export const CreateChat = async (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
        if (authData) {
            //console.log("User in chat is ")
            //console.log(authData)

            let chattype = "journal"
            if (typeof (req.body.chattype) !== 'undefined') {
                chattype = req.body.chattype
            }
            let cd = null
            if (typeof (req.body.cd) !== 'undefined') {
                cd = req.body.cd
            }
            let snapshot = null
            if (typeof (req.body.snapshot) !== 'undefined') {
                snapshot = req.body.snapshot
            }
            try {
                const result = await db.sequelize.transaction(async (t) => {
                    const promptid = req.body.promptId;
                    const userid = authData.user.id;

                    const chatData = {
                        title: req.body.title,
                        UserId: userid,
                        snapshot: snapshot,
                        cd: cd,
                        type: chattype
                    }

                    let chatCreated = await Chat.create(chatData, { transaction: t })
                    if (chatCreated) {
                        if (cd) {
                            let cdText = `What do you think is causing you to use ${cd}?`
                            const m1 = await db.messageModel.create({
                                message: cdText,// (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                                ChatId: chatCreated.id,
                                from: "gpt",
                                type: "text",
                                title: "",
                            }, { transaction: t });
                            res.send({ message: "Chat created", data: chatCreated, status: true });

                        }
                        else if (typeof (req.body.chattype) !== 'undefined') {
                            // let type = req.body.type;
                            if (chattype === "AIChat") {
                                res.send({ message: "Chat created", data: chatCreated, status: true });
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



                })
                // res.send(result);
            }
            catch (error) {
                // await t.rollback();
                res.send({ message: "Error Transaction " + error, data: error, status: false });
            }
        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}


function getAIChatPromptText(name) {
    let cdText = `You're an advanced AI self discovery coach and people engage with you to checkin and journal about their life. 

    Here are some of the terms that we will be using in the instructions.
    Mood: This is the list of 4 moods(The user can select one of these). High energy pleasant, 
        Low energy pleasant, High energy unpleasant, Low energy unpleasant.
    Feeling: This is the feeling of the user regarding the mood that he has selected from on the of the four above.
        You will provide the user with 5 appropriate feelings for the mood he has selected. Like if he selected High energy pleasant,
        you will provide him Happy, Serene etc because these fall under high energy pleasant. 
        Now here are the instructions that you should strictly follow.   

    Here are your instructions:
    1. Invite people to journal about their life/day, you can offer to give them guided prompts if they'd like. 
        Make sure the user conducts some form of journaling and checkin. So steer the conversation to prompt the 
        user to do both check-in and journal.  

    2. Make sure to address them by ${name} in your initial message to personalize the engagement.

    3. Analyze and discuss in depth what the person has journaled about by asking why they've used certain words or expressed 
        certain points in their journal. Ask in depth questions to get the user to think about what they've written. 

     

    4. Your responses should be empathetic, therapist-like, sincere, and extremely comforting. 
        Make sure to follow up each response with a thought invoking 
        question that should not broaden the context of conversation and focusing only on check-in and journaling.

    5. Prompt them if they’d like to check-in before their journal to understand their setting. 
        When prompting them to checkin in, present them with these options:  
        Provide these exact options: High Energy Pleasant, High Energy Unpleasant, Low Energy Pleasant, 
        Low Energy Unpleasant.
        After getting the user input for the mood, your response should contain 5 feelings that should be unique advanced words alongwith definitions(10 words max) 
        that match that selection and ask them which emotion they are feeling. Make sure to put every feeling on a separate line.
        These are the questions to ask when someone checks in. Make sure that you prompt the user to checkin 
        or journal at the very beginning of your conversation.

    6. While interacting with users, don't give a direct yes or no answer, for example, if someone asks, 
        "Should i breakup with my girlfriend" don't just say yes or no, but ask in depth questions that'll help
         the user figure what they want to do. Don’t jump into solutions but rather peel the layer one question
          at a time to bring the user closer to a solution.


    7. Your responses should be more casual and less formal. The person you're talking to is likely black or latino
     from the US, between the ages of 25-35. 

    8. You're an Afro-Latino personal coach from the Dominican Republic(Don't mention your origin in the conversation),
     so speak as such in english keeping the tone somewhat professional, don’t be afraid to include slang 2-3 times
      in the converstation that would be used by this demographic. 

    9. Make sure to only talk about topics you’re intended for, for example, if someone asks you to help them change a tire, 
        your response should be that you’re not built for that as it’s outside of your skill sets. This is one example, 
        so have guardrails that only allow you to support users based on what you’re intended for. Only focus on guiding users through
        their journaling and checkin process.  
    
    So the instruction is, first introduce yourself and respond to the user input, then greet the user. Using the outline above, act as one's advanced AI coach but
     remember not to mention you’re a therapist but rather a personal coach , have them check in first if they agree to checkin, 
     then start their journal entry. Otherwise, just allow them to journal and engage and address what they’ve written about Oh and 
     your name is Plurawl, don't forget to introduce yourself. Strictly follow the above instructions. Don't stray away from the intended behavior.
     Don't try to be a therapist, instead just stick to the instructions and no extra questions.
    
    It should feel like a conversation, so ask one question at a time, don't word vomit and ask a lot of questions at once.. make it feel like you're chatting.
    Keep response within 150 words.
    
    `

    return cdText;
}


async function GenerateFirstMessageForAIChat(chat, user, message = null, callback) {
    let name = user.name;
    if (name.length > 0) {
        name = name.split(" ")[0]
    }

    let cdText = getAIChatPromptText(name);
    let messagesData = [{ role: "system", content: cdText }]
    if (message) {
        messagesData = [{ role: "system", content: cdText }, { role: 'user', content: message }]
    }
    // console.log("First promt from user AI Chat", messagesData)                    
    sendQueryToGpt(cdText, messagesData).then(async (gptResponse) => {
        if (gptResponse) {
            const result = await db.sequelize.transaction(async (t) => {
                t.afterCommit(() => {
                    //console.log("\n\nTransaction is commited \n\n")
                });

                const m1 = await db.messageModel.create({
                    message: message != null ? message : cdText,// (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                    ChatId: chat.id,
                    from: message != null ? "me" : "gpt",
                    type: message != null ? "text" : "promptinvisible",
                    title: "",
                }, { transaction: t });
                const m2 = await db.messageModel.create({
                    message: gptResponse,
                    ChatId: chat.id,
                    from: "gpt",
                    type: "text"//messages[1].type
                }, { transaction: t });



                // await t.commit();

                callback([m1, m2])
            })

        }
        else {
            callback(null)
        }

    })
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
                res.send({ status: true, message: "Chat updated", data: chat })

            }
            else {
                res.send({ status: false, message: "No such chat", data: null })
            }
        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}



async function sendQueryToGpt(message, messageData) {
    //console.log("Sending Message " + message)

    //console.log(messageData)
    // //console.log("Sending this summary to api ", summary);
    // messageData.push({
    //     role: "system",
    //     content: "You're a helpful assistant. So reply me keeping in context the whole data provided. Keep the response short and make it complete response. keep all of your responses within 300 words or less.", // summary will go here if the summary is created.
    // });

    messageData.push({
        role: "user",
        content: message // this data is being sent to chatgpt so only message should be sent
    });
    console.log(messageData)

    console.log("################################################################", messageData.length)
    const APIKEY = process.env.AIKey;
    //console.log(APIKEY)
    const headers = {}
    const data = {
        model: GptModel,
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

    // //console.log(result.data)
    // setMessages(messages.filter(item => item.type !== MessageType.Loading)) // remove the loading message
    if (result.status === 200) {
        let gptMessage = result.data.choices[0].message.content;
        return gptMessage;
    }
    else {
        return null;
    }
}

function splitMessageOld(message) {
    let wordsThreshold = 50
    const words = message.split(' ');
    if (words.length <= wordsThreshold) {
        return [message]; // Return the original message as an array with one element
    } else {
        const firstPart = words.slice(0, wordsThreshold).join(' '); // Take the first 50 words
        const remainingPart = words.slice(wordsThreshold).join(' '); // Take the remaining words
        if (remainingPart.split(' ').length < 10) {
            return [message]; // Return the original message as an array with one element
        } else {
            return [firstPart, remainingPart]; // Return two parts of the message as an array
        }
    }
}


function splitMessage(text) {
    // Regular expression to match sentence boundaries
    const sentenceEndings = /([.!?])\s+/g;
    let w = text.split(' ');
    console.log("Total words in message are ", w.length)
    const sentences = text.split(sentenceEndings).reduce((acc, elem, index, array) => {
        if (index % 2 === 0 && array[index + 1]) { // Pair the sentences with their punctuation
            acc.push(elem + array[index + 1].trim());
        } else if (index % 2 === 0) { // Handle the case of the last sentence potentially without punctuation
            acc.push(elem);
        }
        return acc;
    }, []);

    // Count words
    let wordCount = 0;
    let splitIndex = sentences.length;
    for (let i = 0; i < sentences.length; i++) {
        const count = sentences[i].split(/\s+/).length;
        if (wordCount + count > 100) {
            splitIndex = i;
            break;
        }
        wordCount += count;
    }

    // Ensure the second message is not shorter than 20 words
    let secondPartWordCount = sentences.slice(splitIndex).join(' ').split(/\s+/).length;
    while (secondPartWordCount < 20 && splitIndex > 1) {
        splitIndex--;
        secondPartWordCount = sentences.slice(splitIndex).join(' ').split(/\s+/).length;
    }

    // Construct messages
    const firstMessage = sentences.slice(0, splitIndex).join(' ');
    const secondMessage = sentences.slice(splitIndex).join(' ');

    return [firstMessage, secondMessage];
}


export const SendMessage = async (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (err, authData) => {
        //console.log("Sending message", req.body.chatid)
        if (authData) {
            const userid = authData.user.id;
            const chatid = req.body.chatid;
            const chat = await db.chatModel.findByPk(chatid);
            const user = await db.user.findByPk(userid)

            try {

                if (chat) {
                    //console.log("Chat exists")
                    const message = req.body.message;
                    let messagesData = []
                    if (chat.type === "AIChat") {
                        let name = user.name;
                        if (name.length > 0) {
                            name = name.split(" ")[0]
                        }

                        let cdText = getAIChatPromptText(name);
                        messagesData = [{ role: "system", content: cdText }]
                    }
                    const dbmessages = await db.messageModel.findAll({
                        where: {
                            ChatId: chatid
                        },
                        limit: 50,
                        order: [
                            ["id", "ASC"]
                        ]
                    });
                    if (dbmessages.length > 0) {
                        // messagesData = [{role: "system", content: "You're a helpfull assistant. Reply according to the context of the previous conversation to the user."}, {role: "user", content: messages[0].message}]
                        //console.log("Messages are in db")
                        console.log("################################################################")
                        for (let i = 0; i < dbmessages.length; i++) {
                            let m = dbmessages[i]
                            // //console.log(chalk.green(`Message ${m.from}-${m.id} | ${m.message}`))
                            messagesData.push({ role: m.from === "me" ? "user" : "system", content: m.message })
                        }

                        if (chat.snapshot !== null) {
                            messagesData.splice(0, 0, { role: "system", content: `Here is the summary of the user journal. Based on this you have asked the user why he has used the particular cognitive distortion in this journal he wrote. ${chat.snapshot}. The further conversation follows.` })
                        }
                        messagesData.splice(0, 0, { role: "system", content: `Keep your response within 100 words.` })


                        sendQueryToGpt(message, messagesData).then(async (gptResponse) => {
                            if (gptResponse) {
                                const result = await db.sequelize.transaction(async (t) => {
                                    t.afterCommit(() => {
                                        //console.log("\n\nTransaction is commited \n\n")
                                    });

                                    let messageArray = []
                                    const m1 = await db.messageModel.create({
                                        message: message,// (messages[0].type == MessageType.Prompt || messages[0].type == MessageType.StackPrompt ) ? messages[0].title : messages[0].message,
                                        ChatId: chatid,
                                        from: "me",
                                        type: "text",
                                        title: "",
                                    }, { transaction: t });

                                    messageArray.push(m1)
                                    let messages = splitMessage(gptResponse);
                                    if (messages.length === 1) {
                                        const m2 = await db.messageModel.create({
                                            message: messages[0],
                                            ChatId: chatid,
                                            from: "gpt",
                                            type: "text"//messages[1].type
                                        }, { transaction: t });
                                        messageArray.push(m2)
                                    }
                                    else {
                                        let mes1 = messages[0]
                                        let mes2 = messages[1]
                                        const m2 = await db.messageModel.create({
                                            message: mes1,
                                            ChatId: chatid,
                                            from: "gpt",
                                            type: "text"//messages[1].type
                                        }, { transaction: t });
                                        const m3 = await db.messageModel.create({
                                            message: mes2,
                                            ChatId: chatid,
                                            from: "gpt",
                                            type: "text"//messages[1].type
                                        }, { transaction: t });

                                        messageArray.push(m2)
                                        messageArray.push(m3)
                                    }




                                    // await t.commit();
                                    res.send({ status: true, message: "Messages sent", data: { messages: messageArray, chat: chat } });
                                })

                            }
                            else {
                                res.send({ status: false, message: "Error sending message to gpt", data: null });
                            }

                        })
                    }
                    else {
                        //console.log("No messages, new chat")
                        let us = await db.user.findByPk(authData.user.id)
                        GenerateFirstMessageForAIChat(chat, us, message, (messages) => {
                            if (messages) {
                                res.send({ status: true, message: "Messages sent", data: { messages: messages, chat: chat } });
                            }
                            else {
                                res.send({ message: "Error sending message", data: null, status: false });
                            }
                        })
                        // messagesData = [{role: "user", content: messages[0].message}]
                    }
                    // }






                }
                else {
                    // no such chat exists
                    res.send({ status: false, message: "No chat exists", data: null })
                }

                // })
            }
            catch (error) {
                res.send({ status: false, message: "Exception " + error, data: null })
            }


        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}


async function generateSummaryFromGPT(messageData) {
    const APIKEY = process.env.AIKey;
    //console.log(APIKEY)
    //console.log("Generating summary from ", messageData);
    const headers = {}

    const data = {
        model: GptModel,
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

    if (result.status === 200) {
        let gptMessage = result.data.choices[0].message.content;
        //console.log("Summary response is ", gptMessage)
        return gptMessage
    }
    else {
        //console.log("Summary response error ")
        return null
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
                            [db.Sequelize.Op.ne]: `promptinvisible`
                        }
                    },
                    offset: offset,
                    limit: 100,
                });
                if (messages) {
                    res.send({ status: true, message: "Messages ", data: await messages });
                }
                else {
                    res.send({ status: false, message: "error sending message", data: null })
                }

            }
            else {
                //console.log("Not such chat", chatid)
                // no such chat exists
                res.send({ status: false, message: "No such chat", data: null })
            }
        }
        else {
            res.send({ status: false, message: "Unauthenticated user", data: null })
        }
    })
}

export const GetChatsList = async (req, res) => {
    JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
        if (authData) {
            let offset = Number(req.query.offset) || 0;

            const chats = await db.chat.findAll({

                where: {
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


            res.send({ status: true, message: "Chat list", data: await ChatResource(chats) })

        }
        else {

        }
    })


}