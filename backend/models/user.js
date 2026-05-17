const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: String,

  tasks: [
    {
      text: String,
      priority: String,
      deadline: String,
      completed: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);