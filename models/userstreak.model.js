const UserStreakModel = (sequelize, Sequelize) => {
    const User = sequelize.define("UserStreak", {
      
      streak:{
        type: Sequelize.ENUM,
        values: ['no-streak', 'streak-3-day', 'streak-30-day'],
        default: 'user'
      }
      
    }, 
    );
  
    return User;
  };

  export default UserStreakModel;