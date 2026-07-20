const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");

// Show all expenses
router.get("/", protect, expenseController.index);

// Add Expense
router.get("/new", protect, expenseController.getNewExpense);
router.post("/", protect, expenseController.createExpense);

// Edit Expense
router.get("/:id/edit", protect, expenseController.getEditExpense);
router.put("/:id", protect, expenseController.updateExpense);

// Delete Expense
router.delete("/:id", protect, expenseController.deleteExpense);

module.exports = router;