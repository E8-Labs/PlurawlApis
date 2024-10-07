import db from "../models";

const getRandomColor = () => {
  // Generate random values for red, green, and blue components
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const Pink = Math.floor(Math.random() * 256);

  // Return the random color in hexadecimal format
  return `#${red.toString(16)}${green.toString(16)}${blue.toString(
    16
  )}${Pink.toString(16)}`;
};

const isUserRegisteredWithin14Days = async (userId) => {
  // Get the current date and calculate the date 14 days ago
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  try {
    // Query to find the user by userId
    const user = await db.user.findOne({
      where: {
        id: userId, // Assuming the user ID field is 'id'
        createdAt: {
          [Op.gte]: fourteenDaysAgo, // Check if createdAt is greater than or equal to 14 days ago
        },
      },
    });

    if (user) {
      console.log(`User with ID ${userId} registered within the last 14 days.`);
      return true; // User registered within the last 14 days
    } else {
      console.log(
        `User with ID ${userId} did not register within the last 14 days.`
      );
      return false; // User registered more than 14 days ago or does not exist
    }
  } catch (error) {
    console.error("Error finding user:", error);
    throw error; // Rethrow the error if you want to handle it outside this function
  }
};

export { getRandomColor, isUserRegisteredWithin14Days };
