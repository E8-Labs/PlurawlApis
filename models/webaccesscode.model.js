const UserWebAccessCodeModel = (sequelize, Sequelize) => {
    const User = sequelize.define("UserWebAccessCode", {
      
      code:{
        type: Sequelize.STRING,
      },
      
      
    }, 
    );
  
    return User;
  };

  export default UserWebAccessCodeModel;