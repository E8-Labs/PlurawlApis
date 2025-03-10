// import { constants } from "../constants/constants.js";
import { generateCurrentEventEmail } from "../emails/CurrentEventWeek2Email.js";
import { generateFeatureDrivenEmail } from "../emails/FeatureDrivenEmail.js";
import { generateFeatureDrivenEmail2 } from "../emails/FeatureDrivenEmail2.js";
import { generatePositiveAffirmation3Week2Email } from "../emails/PositiveAffirmation3Week2Email.js";
import { generatePositiveAffirmationWeek1Email } from "../emails/PositiveAffirmationEmail.js";
import { generatePositiveAffirmationEmail2 } from "../emails/PositiveAffirmationEmail2.js";
import { generateVIPAccessEmail } from "../emails/VipAccessEmail.js";
import { generateWorldEventEmail } from "../emails/WorldEventEmailWeek1.js";
import db from "../models/index.js";
import {
  NotificationTitlesAndBody,
  NotificationType,
} from "../models/notification.model.js";
import { SendEmail } from "../services/MailService.js";
import { Expo } from "expo-server-sdk";
const PlurawlAppStoreLink =
  "https://apps.apple.com/pk/app/plurawl/id6478332735";

let AllNotTypes = [
  NotificationType.TypeWeek1VipAccess,
  NotificationType.TypeWeek1PositiveAffirmation,
  NotificationType.TypeWeek1FeatureDriven,
  NotificationType.TypeWeek1WorldEvent,
  NotificationType.TypeWeek1PositiveAffirmation2,
  NotificationType.TypeWeek1FeatureDriven2,
  NotificationType.TypeWeek2PositiveAffirmationWeek2,
  NotificationType.TypeWeek2WorldEventWeek2,
  NotificationType.TypeWeek2FeatureDriven,
  NotificationType.TypeWeek2InsightsDriven,
  NotificationType.TypeWeek2PositiveAffirmation3,
  NotificationType.TypeWeek2FeatureDriven2,
  NotificationType.TypeWeek2WorldEvent2,
];

export async function SendAutoEmails() {
  let admin = await db.user.findOne({
    where: {
      role: "admin",
    },
  });
  let users = await db.user.findAll({
    // limit: 1,
  });

  console.log("Found users to send email ", users.length);
  if (users && users.length > 0) {
    for (const u of users) {
      console.log("User Start", u.id);
      try {
        await SendVipEmailWeek1(u, admin);
        for (let i = 1; i < AllNotTypes.length; i++) {
          const type = AllNotTypes[i];
          const lastNotType = AllNotTypes[i - 1];
          await SendRemainingEmailNots(u, admin, type, lastNotType);
        }
        console.log("User End", u.id);
      } catch (error) {
        console.log("Notifi error ", error);
      }
    }
  }
}

//Helper Functions
async function CheckIfEmailSent(user, type) {
  let not = await db.notification.findOne({
    where: {
      notification_type: type, //NotificationType.TypeWeek1VipAccess,
      to: user.id,
    },
  });
  if (not) {
    console.log(`${type} EmailNotification already sent`);
    return not;
  }
  return null;
}
async function CreateNotification(user, from, type) {
  await db.notification.create({
    from: from.id,
    to: user.id,
    notification_type: type,
  });
}

function isMoreThan24Hours(date1, date2) {
  const diffInMs = Math.abs(new Date(date1) - new Date(date2)); // Get absolute difference in milliseconds
  const diffInHours = diffInMs / (1000 * 60 * 60); // Convert to hours
  console.log(`Diff btw ${date1} - ${date2} is ${diffInHours}`);
  return diffInHours > 24;
}

//SendEmails

async function SendVipEmailWeek1(user, from) {
  let type = NotificationType.TypeWeek1VipAccess;
  let sentNotAlready = await CheckIfEmailSent(user, type);
  if (sentNotAlready) {
    return;
  }
  let emailNot = generateVIPAccessEmail(user.name, PlurawlAppStoreLink);

  let sent = await SendEmail(user.email, emailNot.subject, emailNot.html);
  let pushNot = NotificationTitlesAndBody[type];
  await sendNotWithUser(
    user,
    pushNot.title,
    pushNot.body,
    { type: type, user: user },
    null
  );
  await CreateNotification(user, from, type);
}

function GetEmailTemplate(user, type) {
  let emailNot = null;
  if (type == NotificationType.SendVipEmailWeek1) {
    emailNot = generateVIPAccessEmail(user.name, PlurawlAppStoreLink);
  } else if (type == NotificationType.TypeWeek1PositiveAffirmation) {
    // emailNot = generatePositiveAffirmationWeek1Email(
    //   user.name,
    //   PlurawlAppStoreLink
    // );
  } else if (type == NotificationType.TypeWeek1FeatureDriven) {
    emailNot = generateFeatureDrivenEmail(user.name, PlurawlAppStoreLink);
  } else if (type == NotificationType.TypeWeek1WorldEvent) {
    // emailNot = generateWorldEventEmail(user.name, PlurawlAppStoreLink);
  } else if (type == NotificationType.TypeWeek1PositiveAffirmation2) {
    emailNot = generatePositiveAffirmationEmail2(
      user.name,
      PlurawlAppStoreLink
    );
  } else if (type == NotificationType.TypeWeek1FeatureDriven2) {
    emailNot = generateFeatureDrivenEmail2(user.name, PlurawlAppStoreLink);
  } else if (type == NotificationType.TypeWeek2WorldEventWeek2) {
    emailNot = generateCurrentEventEmail(user.name, PlurawlAppStoreLink);
  } else if (type == NotificationType.TypeWeek2PositiveAffirmation3) {
    emailNot = generatePositiveAffirmation3Week2Email(
      user.name,
      PlurawlAppStoreLink
    );
  }
  return emailNot;
}

// Create a new Expo SDK client

export const sendNot = async (to, title, body, data) => {
  let expo = new Expo();
  const message = {
    to: to, //"ExponentPushToken[_pZ2Y6LPv7S9gKi2lJwzif]",
    sound: "default",
    title: title, //'Test Notification',
    body: body, //'This is a test notification message',
    data: data, //{ message: 'This is a test notification message' },
  };

  try {
    // Send the notification
    let receipts = await expo.sendPushNotificationsAsync([message]);
    //console.log(receipts);
    return {
      status: true,
      message: "Notification sent successfully",
      data: receipts,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Failed to send notification",
      error: error.message,
    };
    // res.status(500).send({ status: false, message: 'Failed to send notification', error: error.message });
  }
};

export const sendNotWithUser = async (
  user,
  title,
  body,
  data,
  additionalData = null
) => {
  let expo = new Expo();
  //   let user = await db.user.findByPk(to);
  console.log("Sending not to admin token ", user.fcm_token);
  if (user && user.fcm_token) {
    const message = {
      to: user.fcm_token, //"ExponentPushToken[_pZ2Y6LPv7S9gKi2lJwzif]",
      sound: "default",
      title: title, //'Test Notification',
      body: body, //'This is a test notification message',
      data: { notification: data, additional: additionalData }, //{ message: 'This is a test notification message' },
      // additional: additionalData
    };
    // console.log("Data  is ", JSON.stringify(data))

    try {
      // Send the notification
      let receipts = await expo.sendPushNotificationsAsync([message]);
      //console.log(receipts);
      return {
        status: true,
        message: "Notification sent successfully",
        data: receipts,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: "Failed to send notification",
        error: error.message,
      };
      // res.status(500).send({ status: false, message: 'Failed to send notification', error: error.message });
    }
  } else {
    console.log("No user or token", user);
    return {
      status: false,
      message: "Failed to send notification",
      error: "No such user ",
    };
  }
};

async function SendRemainingEmailNots(
  user,
  from,
  type,
  prevEmailType = NotificationType.TypeWeek1VipAccess
) {
  //   let type = NotificationType.TypeWeek1PositiveAffirmation;
  let sentNotAlready = await CheckIfEmailSent(user, type);
  if (sentNotAlready) {
    return;
  }

  //Send only if  the previous vip email is sent
  let lastEmail = await CheckIfEmailSent(user, prevEmailType);
  if (!lastEmail) {
    console.log("prev not not sent ", prevEmailType);
    return;
  }

  let date = new Date();
  let sentDate = new Date(lastEmail.createdAt);
  let isMorethan24HoursBetweenEmails = isMoreThan24Hours(sentDate, date);
  if (!isMorethan24HoursBetweenEmails) {
    console.log("24 Hrs not passed");
    return;
  }
  let emailNot = GetEmailTemplate(user, type); //generateVIPAccessEmail(user.name, PlurawlAppStoreLink);
  let pushNot = NotificationTitlesAndBody[type];

  await sendNotWithUser(
    user,
    pushNot.title,
    pushNot.body,
    { type: type, user: user },
    null
  );
  if (emailNot) {
    let sent = await SendEmail(user.email, emailNot.subject, emailNot.html);
  }
  await CreateNotification(user, from, type);
}

// SendAutoEmails();
