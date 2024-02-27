let chatModel = (sequelize, Sequelize) => {
    const Chat = sequelize.define("Chat", {
      title: {
        type: Sequelize.STRING,
        default: ''
      },
      description: {
        type: Sequelize.STRING(1000)
      },
      
      lastMessage: {
        type: Sequelize.STRING(5000)
      },
      summary: {
        type: Sequelize.STRING(5000)
      },
      
      
    });
    // Chat.belongsTo(User);
    // Chat.belongsTo(Prompt)
    return Chat;
  };
  export default chatModel;