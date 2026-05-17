const express = require("express");
const router = express.Router();
// ✅ NEW
const { analyzeMood } = require("../services/groqService");
// ✅ POST /api/mood
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming request:", req.body);

   const { text, tasks, currentTime, currentDay, currentDate } = req.body;

    // ✅ Validate input
    if (!text || text.trim() === "") {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    // ✅ Call Grok service with current date/time context
    const result = await analyzeMood(text, tasks, currentTime, currentDay, currentDate);

    console.log("✅ AI RESULT:", result);

    // ✅ Send response
    return res.status(200).json(result);

  } catch (err) {
    console.error("❌ ROUTE ERROR FULL:");
    console.error(err);

    return res.status(500).json({
      error: "AI processing failed",
      details: err.message || "Unknown error"
    });
  }
});

module.exports = router;