// backend/routes/aiRoutes.js
const express = require("express");
const router = express.Router();

const { getAiInsight } = require("../controllers/aiController");
const { chatWithAI } = require("../controllers/aiChatController");

// short AI-style text for summary card
router.post("/insights", getAiInsight);

// chat box ke liye
router.post("/chat", chatWithAI);

module.exports = router;
