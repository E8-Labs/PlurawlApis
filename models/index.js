import dbConfig from "../config/db.config.js";


import  Sequelize from "sequelize";
//console.log("Connecting DB")
//console.log(dbConfig.MYSQL_DB_PASSWORD)
const sequelize = new Sequelize(dbConfig.MYSQL_DB, dbConfig.MYSQL_DB_USER, dbConfig.MYSQL_DB_PASSWORD, {
  host: dbConfig.MYSQL_DB_HOST,
  port: dbConfig.MYSQL_DB_PORT,
  dialect: dbConfig.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



import UserModel from "./user.model.js";
import GoalModel from "./goal.model.js";
import UserGoalModel from "./usergoals.model.js";
import UserCheckinModel from "./checkin.model.js";
import UserJournalModel from "./userjournal.model.js";



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


db.userCheckinModel = UserCheckinModel(sequelize, Sequelize);
db.userCheckinModel.belongsTo(db.user);
db.user.hasMany(db.userCheckinModel, {onDelete: 'CASCADE', hooks: true});

db.userCheckinModel.belongsTo(db.userJournalModel);
db.userJournalModel.hasOne(db.userCheckinModel);


export default db;