const UserJournalModel = (sequelize, Sequelize) => {
    const UserJournal = sequelize.define("UserJournal", {
      title: {
        type: Sequelize.STRING,
        default: ''
      },
      detail: { // text or content of the journal
        type: Sequelize.STRING,
        default: ''
      },
      type: {
        type: Sequelize.STRING,
        values: ["manual", 'aichat', 'journal'], // mood can be set via these functions
        default: 'manual'
      },
      cod: { // cognitive disorder: one of 7 cognitive disorders
        type: Sequelize.STRING,
        default: ''
      },
      snapshot: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        default: ''
      },
      acronym: {
        type: Sequelize.STRING,
        default: ''
      },
      
    },
    );
  
    return UserJournal;
  };

  export default UserJournalModel;