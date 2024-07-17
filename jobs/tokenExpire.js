const User = require("../models/user");

const ONE_HOUR = 3600000;

const tokenExpire = async () => {
  try {
    const users = await User.find({});
    console.log(users);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const currentDate = new Date();
      const userDate = new Date(user.updatedAt);
      const diff = currentDate - userDate;
      if (diff > ONE_HOUR) {
        user.activationToken = null;
        user.tokenExpired = true;
        await user.save();
        console.log(`User ${user.email} is inactive for more than 1 hour. Token expired.`);
      }
    }
  } catch (err) {
    console.log(`${err.message}`);
  }
};

module.exports = tokenExpire;