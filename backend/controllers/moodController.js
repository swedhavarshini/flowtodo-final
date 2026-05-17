const { analyzeMood } = require("../services/groqService");

exports.handleMood = async (req, res) => {
  try {
    const { text } = req.body;

    const result = await analyzeMood(text);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
};