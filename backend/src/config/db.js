const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Successfully connected to MongoDB with Mongoose!");

    const db = mongoose.connection;
    db.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });
    db.once("open", () => {
      console.log("MongoDB connection established successfully.");
    });
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;