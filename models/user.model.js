const UserModel = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      name: {
        type: Sequelize.STRING
      },
      
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      
      profile_image: {
        type: Sequelize.STRING,
        default: ''
      },
      company: {
        type: Sequelize.STRING,
        default: ''
      },
      title: {
        type: Sequelize.STRING,
        default: ''
      },
      industry: {
        type: Sequelize.STRING,
        default: ''
      },
      city: {
        type: Sequelize.STRING,
        default: ''
      },
      state: {
        type: Sequelize.STRING,
        default: ''
      },
      gender:{
        type:Sequelize.STRING,
        values: ['Male', 'Female', 'None'],
        default: 'Male'
      },
      race:{
        type:Sequelize.STRING,
        default: ''// ethnicity
      },
      lgbtq:{
        type:Sequelize.STRING,
        default: ''// yes, no, prefer not to say
      },
      veteran:{
        type:Sequelize.STRING,
        default: ''// yes, no, prefer not to say
      },
      fcm_token:{
        type:Sequelize.STRING,
        default: ''
      },
      provider_id: {
        type: Sequelize.STRING,
        default: ''
      },
      provider_name: {
        type: Sequelize.STRING,
        default: 'Email', //Facebook, Apple, Google
      },
      role: {
        type: Sequelize.ENUM,
        values: ['user', 'admin'],
        default: 'user'
      },
      points: {
        type: Sequelize.INTEGER,
        default: 0
      }
      
    }, 
    // {
    //   associate: function(models) {
    //     User.hasMany(models.PlaidTokens, { onDelete: 'cascade' });
    //   }
    // }
    );
  
    return User;
  };

  export default UserModel;