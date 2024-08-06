const mongoose = require("mongoose");
const uri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_TEST_URI
    : process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
