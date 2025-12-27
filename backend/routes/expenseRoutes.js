// backend/routes/expenseRoutes.js
const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");

//     METHOD  PATH            HANDLER
router.post("/add", expenseController.addExpense);

router.get("/list", expenseController.listExpenses);

router.get("/summary", expenseController.getMonthlySummary);

module.exports = router;
