import dbConfig from "../config/db.config.js";


import  Sequelize from "sequelize";
console.log("Connecting DB")
console.log(dbConfig.MYSQL_DB_PASSWORD)
const sequelize = new Sequelize(dbConfig.MYSQL_DB, dbConfig.MYSQL_DB_USER, dbConfig.MYSQL_DB_PASSWORD, {
  host: dbConfig.MYSQL_DB_HOST,
  port: dbConfig.MYSQL_DB_PORT,
  dialect: dbConfig.dialect,
});


try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
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

export default db;