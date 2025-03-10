let NotificationModel = (sequelize, Sequelize) => {
  const Model = sequelize.define("Notification", {
    from: {
      type: Sequelize.INTEGER,
    },
    to: {
      type: Sequelize.INTEGER,
    },
    notification_type: {
      type: Sequelize.ENUM,
      values: [
        "NewUser",
        "NewJournal",
        "NewCheckIn",
        "Streak3",
        "Streak30",
        NotificationType.TypeWeek1VipAccess,
        NotificationType.TypeWeek1PositiveAffirmation,
        NotificationType.TypeWeek1FeatureDriven,
        NotificationType.TypeWeek1WorldEvent,
        NotificationType.TypeWeek1PositiveAffirmation2,
        NotificationType.TypeWeek1FeatureDriven2,
        NotificationType.TypeWeek2PositiveAffirmationWeek2,
        NotificationType.TypeWeek2WorldEventWeek2,
        NotificationType.TypeWeek2FeatureDriven,
        NotificationType.TypeWeek2InsightsDriven,
        NotificationType.TypeWeek2PositiveAffirmation3,
        NotificationType.TypeWeek2FeatureDriven2,
        NotificationType.TypeWeek2WorldEvent2,
      ],
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  // Chat.belongsTo(User);
  // Chat.belongsTo(Prompt)
  return Model;
};
export default NotificationModel;

export const NotificationType = {
  TypeNewUser: "NewUser",
  TypeNewJournal: "NewJournal",
  TypeNewCheckIn: "NewCheckIn",
  TypeStreak3: "Streak3",
  TypeStreak30: "Streak30",
  //Week 1 Notifications Here
  TypeWeek1VipAccess: "TypeWeek1VipAccess", //Monday or at the time of account creation
  TypeWeek1PositiveAffirmation: "TypeWeek1PositiveAffirmation", //24 hrs later: Tue
  TypeWeek1FeatureDriven: "TypeWeek1FeatureDriven", // 24 hrs later Wed
  TypeWeek1WorldEvent: "TypeWeek1WorldEvent", // 24 hrs later Thu
  TypeWeek1PositiveAffirmation2: "TypeWeek1PositiveAffirmation2", // 24 hrs later Fri
  TypeWeek1FeatureDriven2: "TypeWeek1FeatureDriven2", // 24 hrs later sat

  //Week 2 Notifications Start here
  TypeWeek2PositiveAffirmationWeek2: "TypeWeek2PositiveAffirmationWeek2",
  TypeWeek2WorldEvent1: "TypeWeek2WorldEvent1",
  TypeWeek2FeatureDriven: "TypeWeek2FeatureDriven",
  TypeWeek2InsightsDriven: "TypeWeek2InsightsDriven",
  TypeWeek2PositiveAffirmation3: "TypeWeek2PositiveAffirmation3",
  TypeWeek2FeatureDriven2: "TypeWeek2FeatureDriven2",
  TypeWeek2WorldEvent2: "TypeWeek2WorldEvent2",
};

export const NotificationTitlesAndBody = {
  TypeNewUser: {
    title: "New User",
    body: "A new user has registered",
  },
  // TypeNewJournal: "NewJournal",
  // TypeNewCheckIn: "NewCheckIn",
  TypeStreak3: {
    title: "Keep it going",
    body: "You are on 3 day streak. Keep going to get points.",
  },
  TypeStreak30: {
    title: "That's amazing!",
    body: "You are on a 30 day streak.",
  },
  //Week 1 Notifications Here
  TypeWeek1VipAccess: {
    title: "🎉 You’re In—VIP for Life!",
    body: "You now have free lifetime access to Plurawl.",
  }, //Monday or at the time of account creation
  TypeWeek1PositiveAffirmation: {
    title: "💖 Main Character Energy",
    body: "You are not a side story in your own life. Drop one thing you love about you.",
  }, //24 hrs later: Tue
  TypeWeek1FeatureDriven: {
    title: "🤖Too real for the group chat?",
    body: "Some thoughts are hard to say out loud. Talk it out, judgment-free, 24/7. Say what’s on your mind.",
  }, // 24 hrs later Wed
  TypeWeek1WorldEvent: {
    title: "Let’s talk Trump",
    body: "If you can’t say it in the group chat, say it here. Plurawl is your space to be real.",
  }, // 24 hrs later Thu
  TypeWeek1PositiveAffirmation2: {
    title: "🚀 You can level up.",
    body: "Another week, another win. Reflect on how far you’ve come. ",
  }, // 24 hrs later Fri
  TypeWeek1FeatureDriven2: {
    title: "🌱 Take it one step at a time.",
    body: "You don’t have to fix everything right now. Just name how you feel. That’s the first step. Tap to check-in.",
  }, // 24 hrs later sat

  //Week 2 Notifications Start here
  TypeWeek1FeatureDriven2: {
    title: "🌱 Take it one step at a time.",
    body: "You don’t have to fix everything right now. Just name how you feel. That’s the first step. Tap to check-in.",
  },
  TypeWeek2PositiveAffirmationWeek2: {
    title: "🧠 Get That Clarity",
    body: "Journaling = focus. Do a quick brain dump and get to it.",
  },
  TypeWeek2WorldEventWeek2: {
    title: "💭 The World is Wild",
    body: "The news cycle is doing the most. Take a minute to process it here.",
  },
  TypeWeek2FeatureDriven: {
    title: "💡 Your emotions are valid.",
    body: "Good day, bad day, in-between? Your emotions are valid. Log them & see your patterns. Start your check-in.",
  },
  TypeWeek2InsightsDriven: {
    title: "🚀 Boost your productivity.",
    body: "Journaling isn’t just for feelings—it boosts productivity by 20%. Get your mind right, then go be great.",
  },
  TypeWeek2PositiveAffirmation3: {
    title: "💪🏾 You’re Built For It",
    body: "Every challenge has made you stronger. What’s one win you’re proud of today?",
  },
  TypeWeek2FeatureDriven2: {
    title: "💭 Clear your mind.",
    body: "Journaling isn’t just for tough times. Celebrate your wins and gain the clarity you need to focus on what matters most.",
  },
  TypeWeek2WorldEvent2: {
    title: "📢 The news got you stressed?",
    body: "The world is doing the most right now. Tap to check in, name how you feel, and process everything—no judgment, just clarity.",
  },
};
