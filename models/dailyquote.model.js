const DailyQuoteModel = (sequelize, Sequelize) => {
    const DailyQuote = sequelize.define("DailyQuote", {
      quote: {
        type: Sequelize.STRING(500),
        default: ''
      },
      date: {
        type: Sequelize.STRING,
        default: ''
      },
      
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['date']
            }
        ]
    }
    );
  
    return DailyQuote;
  };

  export default DailyQuoteModel;