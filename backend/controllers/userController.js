const User = require("../models/User");

exports.saveRoutine = async (req, res) => {
  const { userId, routine } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { routine },
    { new: true }
  );

  res.json(user);
};