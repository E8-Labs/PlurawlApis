const UserGoalModel = (sequelize, Sequelize) => {
    const UserGoal = sequelize.define("UserGoal", {
      name: {
        type: Sequelize.STRING,
        default: ''
      }
    },
    );
  
    return UserGoal;
  };

  export default UserGoalModel;