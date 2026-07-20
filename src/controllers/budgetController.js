const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Current Month
const currentMonth = () => {
  return new Date().toISOString().slice(0, 7);
};

// Show Budget Page
const index = async (req, res) => {
  try {

    const month = currentMonth();

    const budget = await Budget.findOne({
      user: req.session.userId,
      month,
    });

    const expenses = await Expense.find({
      user: req.session.userId,
    });

    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const limit = budget ? budget.limit : 0;

    const remaining = limit - spent;

    res.render("budget/index", {
      title: "Budget",
      month,
      limit,
      spent,
      remaining,
    });

  } catch (err) {

    console.log(err);

    res.redirect("/dashboard");

  }
};

// Save Budget
const saveBudget = async (req, res) => {

  const { month, limit } = req.body;

  const existingBudget = await Budget.findOne({
    user: req.session.userId,
    month,
  });

  if (existingBudget) {

    existingBudget.limit = limit;

    await existingBudget.save();

  } else {

    await Budget.create({
      user: req.session.userId,
      month,
      limit,
    });

  }

  req.flash("success", "Budget Saved Successfully");

  res.redirect("/budget");
};

module.exports = {
  index,
  saveBudget,
  currentMonth,
};