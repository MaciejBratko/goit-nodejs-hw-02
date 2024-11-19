const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database connection successful");
    return mongoose.connection;
  } catch (err) {
    console.error("Error connecting to the database");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
