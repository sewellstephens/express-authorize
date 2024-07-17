const mongoose = require("mongoose");

const tokenExpire = require("./tokenExpire");

const executeTokenExpire = async () => {
  console.log("Setup database connection");
  mongoose
    .connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
      console.log("SUCCESS - Database connected.");

      // Running jobs
      await tokenExpire();
      
    })
    .catch((err) => {
      console.log(`ERROR - While connected to database: ${err.message}`);
    });
};

exports.executeTokenExpire = executeTokenExpire;