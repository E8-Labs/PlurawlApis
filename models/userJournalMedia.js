const UserJournalMedia = (sequelize, Sequelize) => {
  const UserJournalMedia = sequelize.define("UserJournalMedia", {
    url: {
      type: Sequelize.STRING,
      default: "",
    },
    // journalId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,

    // }
  });

  return UserJournalMedia;
};

export default UserJournalMedia;
