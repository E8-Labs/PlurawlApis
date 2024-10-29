const UserJournalModel = (sequelize, Sequelize) => {
  const UserJournal = sequelize.define("UserJournal", {
    title: {
      type: Sequelize.TEXT("medium"),
      default: "",
    },
    detail: {
      // text or content of the journal
      type: Sequelize.TEXT("medium"),
      default: "",
    },
    type: {
      type: Sequelize.STRING,
      values: ["manual", "aichat", "journal", "draft"], // mood can be set via these functions
      default: "manual",
    },
    cd: {
      // cognitive disorder: one of 7 cognitive disorders
      type: Sequelize.STRING,
      default: "",
    },
    snapshot: {
      type: Sequelize.TEXT("medium"),
      default: "",
    },
    mood: {
      type: Sequelize.STRING,
      default: "",
    },
    feeling: {
      type: Sequelize.STRING,
      default: "",
    },
    description: {
      type: Sequelize.TEXT("medium"),
      default: "",
    },
    pronunciation: {
      type: Sequelize.STRING,
      default: "",
    },
    snapshotTextHighlights: {
      type: Sequelize.STRING(500),
      default: "",
    },
    textHighlights: {
      type: Sequelize.STRING(500),
      default: "",
    },
    prompt: {
      type: Sequelize.STRING(1000),
      default: "",
    },
    encrypted: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
  });

  return UserJournal;
};

export default UserJournalModel;
