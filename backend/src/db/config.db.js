const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("inside connection function", process.env.URI);
  try {
    const connectionInstance = await mongoose.connect(`${process.env.URI}`);
    console.log(
      `\n MongoDB connected successfully to host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
