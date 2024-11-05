import axios from "axios";
import JWT from "jsonwebtoken";
import moment from "moment-timezone";
import db from "../models/index.js";
import { GetCostEstimate } from "./journal.controller.js";

async function CallOpenAi(messageData) {
  let APIKEY = process.env.AIKey;

  const headers = {};
  const data = {
    model: "gpt-4-1106-preview",
    messages: messageData,
    // max_tokens: 1000,
  };
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
    if (result.status === 200) {
      return { data: result.data, status: true };
    } else {
      return { data: "Some error", status: false };
    }
  } catch (error) {
    return { status: false, message: error.message, error: error };
  }
}

export const GenerateTwoWordTitle = async (req, res) => {
  let messageData = [];
  messageData.push({
    role: "system",
    content: `Generate 20 two word greetings to welcome user back to the app like Discover Yourself. This is an AI Journaling app so generate the greetings accordingly. 
              Make it a json object like this  {greeting: "Greeting text", timestamp: Time here in Month Day Year Format}. Only generate json object and no extra text.`, // summary will go here if the summary is created.
  });

  try {
    let gptData = await CallOpenAi(messageData);
    if (gptData && gptData.status) {
      let gptMessage = gptData.data.choices[0].message.content;
      gptMessage = gptMessage.replace(new RegExp("```json", "g"), "");
      gptMessage = gptMessage.replace(new RegExp("```", "g"), "");
      gptMessage = gptMessage.replace(new RegExp("\n", "g"), "");
      let estimate = GetCostEstimate(gptData.data);
      let createdCost = await db.costModel.create({
        type: "GeneratedGreetings",
        total_cost: estimate.total_cost,
        total_tokens: estimate.completion_tokens + estimate.prompt_tokens,
      });
      let json = JSON.parse(gptMessage);

      return res.send({
        status: true,
        data: json,
        message: "Greetings list",
        cost: createdCost,
      });
    } else {
      return res.send({ status: false, data: null, message: "Greetings list" });
    }
  } catch (error) {
    console.log("Exception gpt", error);
    return res.send({
      status: false,
      data: null,
      message: "Greetings list",
      error: error,
    });
  }
};

export async function GetQuoteForUser(req, res) {
  JWT.verify(req.token, process.env.SecretJwtKey, async (error, authData) => {
    if (authData) {
      let timeOfDay = req.query.timeOfDay; // time of day with date and time
      let user = authData.user;
      let today = moment().format("DD MM YYYY");
      let quote = await db.dailyQuoteModel.findOne({
        where: {
          date: today,
          UserId: user.id,
        },
      });

      // if (!quote) {
      console.log("Generating quote since no quote exists today");
      let messageData = [];
      // ////console.log("Sending this summary to api ", summary);
      let journal = await db.userJournalModel.findOne({
        where: {
          UserId: user.id,
        },
        order: [["createdAt", "DESC"]],
      });
      let journalText = "";
      if (journal) {
        journalText = journal.snapshot;
      }

      let goals = await db.userGoalModel.findAll({
        where: {
          UserId: user.id,
        },
      });
      let goalText = "";
      if (goals) {
        goals.map((goal) => {
          goalText += `${goal.name}\n`;
        });
      }
      messageData.push({
        role: "system",
        content: `Generate a daily prompt(Not a quote by someone) of max 200 characters for user ${user.name} considering the time of day ${timeOfDay}.
          Consider the user's last journal entry which is ${journalText}. If the journal entry is empty, disregard. 
          Also consider user's goals which is ${goalText}. If the goals are not provided, disregard. 
            Make it a json object like this {quote: Prompt of the day., timestamp: Time here in Month Day Year Format}. Only generate json object and no extra text.`, // summary will go here if the summary is created.
      });

      let APIKEY = process.env.AIKey;

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
            UserId: user.id,
          };
          let created = await db.dailyQuoteModel.create(data);
          return res.send({
            status: true,
            data: created,
            message: "Quote generated",
            cost: createdCost,
          });
        } else {
          ////console.log(chalk.red("Error in gpt response"))
          return res.send({
            status: false,
            data: null,
            message: "Some error occurred",
            // cost: createdCost,
          });
        }
      } catch (error) {
        return res.send({
          status: false,
          data: null,
          message: error.message,
          error: error,
        });
      }

      // }
      // else {
      //   return res.send({
      //     status: true,
      //     data: quote,
      //     message: "Quote already present",
      //     // cost: createdCost,
      //   });
      // }
    } else {
      return res.send({
        status: false,
        message: "Unauthenticated user",
        data: null,
      });
    }
  });
}
