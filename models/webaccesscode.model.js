const UserWebAccessCodeModel = (sequelize, Sequelize) => {
  const User = sequelize.define("UserWebAccessCode", {
    code: {
      type: Sequelize.STRING,
    },
  });

  return User;
};

export default UserWebAccessCodeModel;

// SELECT u.id, u.name, u.email
// FROM Users u
// inner JOIN UserWebAccessCodes uj ON u.id = uj.UserId
// WHERE u.createdAt BETWEEN '2024-12-03' AND '2024-12-31';
