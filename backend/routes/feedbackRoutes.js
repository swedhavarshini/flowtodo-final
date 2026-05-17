const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// ✅ SAVE FEEDBACK
router.post("/", async (req, res) => {
  try {
    const data = await Feedback.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// ✅ GET ACCURACY
router.get("/accuracy", async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const correct = await Feedback.countDocuments({ correct: true });

    const accuracy = total === 0 ? 0 : (correct / total) * 100;

    res.json({ total, correct, accuracy });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate accuracy" });
  }
});

module.exports = router;