const mongoose = require("mongoose");

// TODO: Move this to .env file
const MONGODB_URI = "mongodb://localhost:27017/seartwaves";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 