const UserJournalModel = (sequelize, Sequelize) => {
    const UserJournal = sequelize.define("UserJournal", {
      title: {
        type: Sequelize.STRING,
        default: ''
      },
      detail: { // text or content of the journal
        type: Sequelize.STRING(9000),
        default: ''
      },
      type: {
        type: Sequelize.STRING,
        values: ["manual", 'aichat', 'journal', 'draft'], // mood can be set via these functions
        default: 'manual'
      },
      cd: { // cognitive disorder: one of 7 cognitive disorders
        type: Sequelize.STRING,
        default: ''
      },
      snapshot: {
        type: Sequelize.STRING(3000),
        default: ''
      },
      mood: {
        type: Sequelize.STRING,
        default: ''
      },
      feeling: {
        type: Sequelize.STRING,
        default: ''
      },
      description: {
        type: Sequelize.STRING(1500),
        default: ''
      },
      pronunciation: {
        type: Sequelize.STRING,
        default: ''
      },
      snapshotTextHighlights: {
        type: Sequelize.STRING(500),
        default: ''
      },
      textHighlights: {
        type: Sequelize.STRING(500),
        default: ''
      },
      encrypted: {
        type: Sequelize.BOOLEAN,
        default: false
      },
    },
    );
  
    return UserJournal;
  };

  export default UserJournalModel;