const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ ADD TASK
router.post("/add", async (req, res) => {
  const { userId, text, priority, deadline } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  user.tasks = [
    ...user.tasks,
    { text, priority, deadline }
  ];

  await user.save();

  res.json(user.tasks);
});
router.get("/test", (req, res) => {
  console.log("🔥 TEST ROUTE HIT");
  res.send("Backend working");
});

// ✅ GET TASKS
router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.tasks);
});

// ✅ TOGGLE TASK COMPLETION
router.patch("/:userId/task/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const task = user.tasks.id(taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  await user.save();

  res.json(user.tasks);
});

router.delete("/:userId/task/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.tasks = user.tasks.filter((task) => task._id.toString() !== taskId);
  await user.save();

  res.json(user.tasks);
});

router.delete("/:userId/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.tasks = user.tasks.filter((task) => task._id.toString() !== taskId);
  await user.save();

  res.json(user.tasks);
});

router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    // find user having this task
    const user = await User.findOne({
      "tasks._id": taskId
    });

    if (!user) {
      return res.status(404).json({ error: "Task not found" });
    }

    // remove task
    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== taskId
    );

    await user.save();

    res.json(user.tasks); // ✅ return updated list

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;