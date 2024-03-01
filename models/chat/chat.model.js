let chatModel = (sequelize, Sequelize) => {
    const Chat = sequelize.define("Chat", {
      title: {
        type: Sequelize.STRING,
        default: ''
      },
      // description: {
      //   type: Sequelize.STRING(200)
      // },
      
      // lastMessage: {
      //   type: Sequelize.STRING(5000)
      // },
      snapshot: { // snapshot of journal
        type: Sequelize.STRING(5000)
      },
      cd: { // cd of journal
        type: Sequelize.STRING(50)
      },
      
    });
    // Chat.belongsTo(User);
    // Chat.belongsTo(Prompt)
    return Chat;
  };
  export default chatModel;