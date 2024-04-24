let costModel = (sequelize, Sequelize) => {
    const Cost = sequelize.define("GptCost", {
      type: {
        type: Sequelize.STRING(200)
      },
      itemid:{
        type: Sequelize.INTEGER,
      },
      total_tokens: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_cost: {
        type: Sequelize.DOUBLE, 
        allowNull: false,
        defaultValue: 0
      }
      
    });
    // Chat.belongsTo(User);
    // Chat.belongsTo(Prompt)
    return Cost;
  };
  export default costModel;