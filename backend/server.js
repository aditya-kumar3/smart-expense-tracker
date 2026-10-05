// backend/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// connect to database
connectDB();

// simple test route
app.get("/", (req, res) => {
  res.send("API is running successfully");
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


// EXISTING ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/prediction", require("./routes/predictionRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));



const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
  });
}

module.exports = app;
