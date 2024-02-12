const UserCheckinModel = (sequelize, Sequelize) => {
    const UserCheckin = sequelize.define("UserCheckin", {
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
      acronym: {
        type: Sequelize.STRING,
        default: ''
      },
      type: {
        type: Sequelize.STRING,
        values: ["manual", 'aichat', 'journal'], // mood can be set via these functions
        default: 'manual'
      },
    },
    );
  
    return UserCheckin;
  };

  export default UserCheckinModel;