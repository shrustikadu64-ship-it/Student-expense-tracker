const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const budgetController = require("../controllers/budgetController");

router.get("/", protect, budgetController.index);

router.post("/", protect, budgetController.saveBudget);

module.exports = router;