const WeeklySnapshotModel = (sequelize, Sequelize) => {
    const Model = sequelize.define("WeeklySnapshot", {
      monday: {
        type: Sequelize.STRING,
        default: ''
      },
      sunday: {
        type: Sequelize.STRING,
        default: ''
      },
      year: {
        type: Sequelize.STRING,
        default: ''
      },
      mood: {
        type: Sequelize.STRING,
        default: ''
      },
      date: {
        type: Sequelize.STRING,
        default: ''
      },
      snapshot: {
        type: Sequelize.STRING(10000),
        default: ''
      },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['UserId', 'sunday', 'monday', 'year']
            }
        ]
    }
    );
  
    return Model;
  };

  export default WeeklySnapshotModel;