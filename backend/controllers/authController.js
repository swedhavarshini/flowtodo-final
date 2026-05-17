const User = require("../models/User");
const bcrypt = require("bcrypt");

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashed
  });

  res.json(user);
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Wrong password" });

  res.json(user);
};