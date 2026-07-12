const mongoose = require("mongoose");

const uri = "mongodb+srv://studentuser:Student123@cluster0.bemz1my.mongodb.net/studentExpenseTracker?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:");
    console.error(err);
    process.exit(1);
  });