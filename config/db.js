const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI") || "mongodb+srv://dbAdmin:ZerebewZobrew1@cluster0.14yo5.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
