const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  input: String,
  predictedMood: String,
  predictedEnergy: String,
  workCapacity: Number,
  correct: Boolean
}, { timestamps: true });

module.exports =
  mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema);