import dbConfig from "../config/db.config.js";
import passwordresetcodeModel from "./passwordresetcode.model.js";

import  Sequelize from "sequelize";
////console.log("Connecting DB")
////console.log(dbConfig.MYSQL_DB_PASSWORD)
const sequelize = new Sequelize(dbConfig.MYSQL_DB, dbConfig.MYSQL_DB_USER, dbConfig.MYSQL_DB_PASSWORD, {
  host: dbConfig.MYSQL_DB_HOST,
  port: dbConfig.MYSQL_DB_PORT,
  dialect: dbConfig.dialect,
  logging: false
});


try {
  await sequelize.authenticate();
  ////console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



import UserModel from "./user.model.js";
import GoalModel from "./goal.model.js";
import UserGoalModel from "./usergoals.model.js";
import UserCheckinModel from "./checkin.model.js";
import UserJournalModel from "./userjournal.model.js";
import WeeklySnapshotModel from "./weeklysnapshot.model.js";
import DailyQuoteModel from "./dailyquote.model.js";

import chatModel from "./chat/chat.model.js";
import messageModel from "./chat/message.model.js";
import SpotifySongModel from "./spotifysong.model.js";
import CheckinMoodModel from "./checkinfeelings.model.js";
import costModel from "./cost.model.js";
import UseStreakModel from "./userstreak.model.js";
import SubscriptionModel from "./subscription.model.js";
import DailyLoginModel from "./dailylogin.model.js";
import NotificationModel from "./notification.model.js";
import UserWebAccessCodeModel from "./webaccesscode.model.js";

import EmailVerificationCode from "./emailverificationcode.model.js";



db.user = UserModel(sequelize, Sequelize);
db.goal = GoalModel(sequelize, Sequelize);
db.userGoalModel = UserGoalModel(sequelize, Sequelize);

db.userGoalModel.belongsTo(db.user);
db.user.hasMany(db.userGoalModel, {onDelete: 'CASCADE', hooks: true})
db.userGoalModel.belongsTo(db.goal);
db.goal.hasMany(db.userGoalModel, {onDelete: 'CASCADE', hooks: true})

db.userJournalModel = UserJournalModel(sequelize, Sequelize);
db.userJournalModel.belongsTo(db.user);
db.user.hasMany(db.userJournalModel, {onDelete: 'CASCADE', hooks: true});

db.weeklySnapshotModel = WeeklySnapshotModel(sequelize, Sequelize);
db.weeklySnapshotModel.belongsTo(db.user);

db.dailyQuoteModel = DailyQuoteModel(sequelize, Sequelize);
// db.us


db.userCheckinModel = UserCheckinModel(sequelize, Sequelize);
db.userCheckinModel.belongsTo(db.user);
db.user.hasMany(db.userCheckinModel, {onDelete: 'CASCADE', hooks: true});

db.userCheckinModel.belongsTo(db.userJournalModel);
db.userJournalModel.hasOne(db.userCheckinModel);


//chat
db.chatModel = chatModel(sequelize, Sequelize);
db.chatModel.belongsTo(db.user);
db.chatModel.belongsTo(db.userJournalModel);

db.messageModel = messageModel(sequelize, Sequelize);
db.messageModel.belongsTo(db.chatModel);


db.spotifySongModel = SpotifySongModel(sequelize, Sequelize);
db.spotifySongModel.belongsTo(db.user);
db.user.hasMany(db.spotifySongModel);

db.passwordResetCode = passwordresetcodeModel(sequelize, Sequelize);

db.checkinMoodModel = CheckinMoodModel(sequelize, Sequelize);

db.costModel = costModel(sequelize, Sequelize);


db.userStreakModel = UseStreakModel(sequelize, Sequelize);
db.userStreakModel.belongsTo(db.user);
db.user.hasMany(db.userStreakModel);


db.subscriptionModel = SubscriptionModel(sequelize, Sequelize);
db.subscriptionModel.belongsTo(db.user);
db.user.hasMany(db.subscriptionModel);

db.dailyLogin = DailyLoginModel(sequelize, Sequelize);
db.dailyLogin.belongsTo(db.user);
db.user.hasMany(db.dailyLogin);

db.notification = NotificationModel(sequelize, Sequelize);

db.WebAccessCode = UserWebAccessCodeModel(sequelize, Sequelize);
db.user.hasMany(db.WebAccessCode);
db.WebAccessCode.belongsTo(db.user);


db.EmailVerificationCode = EmailVerificationCode(sequelize, Sequelize);




export default db;