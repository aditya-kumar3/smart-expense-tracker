// backend/routes/insightRoutes.js

const express = require("express");
const router = express.Router();
const { getInsights } = require("../controllers/insightController");

// AI-style insights for a user
router.post("/summary", getInsights);

module.exports = router;
