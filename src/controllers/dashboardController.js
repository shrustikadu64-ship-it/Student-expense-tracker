const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

const index = async (req, res) => {
  try {

    const userId = req.session.userId;

    const expenses = await Expense.find({ user: userId });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const currentMonth = new Date().toISOString().slice(0, 7);

    const budget = await Budget.findOne({
      user: userId,
      month: currentMonth,
    });

    const budgetAmount = budget ? budget.limit : 0;

    const remaining = budgetAmount - totalExpenses;

    res.render("dashboard/index", {
      title: "Dashboard",
      month: currentMonth,
      spent: totalExpenses,
      limit: budgetAmount,
      remaining,
      recentExpenses: expenses.slice(-5).reverse(),
      categoryBreakdown: {}
    });

  } catch (err) {

    console.log(err);

    res.redirect("/login");

  }
};

module.exports = {
  index,
};