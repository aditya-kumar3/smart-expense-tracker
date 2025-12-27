// backend/routes/goalRoutes.js

const express = require("express");
const router = express.Router();
const { upsertGoal, getGoalStatus } = require("../controllers/goalController");

router.post("/", upsertGoal);        // create/update goal
router.get("/", getGoalStatus);      // get goal + progress

module.exports = router;
