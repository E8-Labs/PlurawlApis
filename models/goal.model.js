const GoalModel = (sequelize, Sequelize) => {
    const Goal = sequelize.define("Goal", {
      name: {
        type: Sequelize.STRING
      },
    }
    );
  
    return Goal;
  };

  export default GoalModel;