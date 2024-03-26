const CheckinMoodModel = (sequelize, Sequelize) => {
    const CheckinMoodModel = sequelize.define("CheckinMoodModel", {
      mood: {
        type: Sequelize.STRING,
        default: ''
      },
      feeling: {
        type: Sequelize.STRING,
        default: ''
      },
      description: {
        type: Sequelize.STRING,
        default: ''
      },
      pronunciation: {
        type: Sequelize.STRING,
        default: ''
      },
      
    },
    );
  
    return CheckinMoodModel;
  };

  export default CheckinMoodModel;