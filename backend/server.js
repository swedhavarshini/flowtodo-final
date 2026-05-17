require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = require("./config/db");
connectDB();

const moodRoutes = require('./routes/moodRoutes');
const taskRoutes = require('./routes/taskRoutes');







app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/mood", require("./routes/moodRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes")); 
app.use("/api/feedback", require("./routes/feedbackRoutes"));


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));




// Routes
app.use('/analyze-mood', moodRoutes);
app.use('/tasks/update-stats', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BalanceAI backend running on port ${PORT}`);
});
