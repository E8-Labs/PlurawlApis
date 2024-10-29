let chatModel = (sequelize, Sequelize) => {
  const Chat = sequelize.define("Chat", {
    title: {
      type: Sequelize.STRING,
      default: "",
    },
    type: {
      type: Sequelize.STRING(200),
    },

    // lastMessage: {
    //   type: Sequelize.STRING(5000)
    // },
    snapshot: {
      // snapshot of journal
      type: Sequelize.STRING(5000),
    },
    cd: {
      // cd of journal
      type: Sequelize.STRING(50),
    },
    total_cost: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    old_journal_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    old_chat_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
  // Chat.belongsTo(User);
  // Chat.belongsTo(Prompt)
  return Chat;
};
export default chatModel;
