exports.updateTaskStats = (req, res) => {
  const { tasks } = req.body;

  console.log("📩 Received task stats request:", tasks);

  let completed = 0;
  let pending = 0;
  let overdue = 0; // For now, assume overdue = pending (can be extended)

  tasks.forEach(task => {
    if (task.completed) {
      completed++;
    } else {
      pending++;
      overdue++; // simplistic assumption
    }
  });

  res.json({
    completed,
    pending,
    overdue
  });
};
