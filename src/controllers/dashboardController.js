const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const { currentMonth } = require("./budgetController");

async function index(req, res, next) {
  try {
    const month = currentMonth();

    const [year, mon] = month.split("-").map(Number);

    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);

    // Expenses of current month
    const monthExpenses = await Expense.find({
      user: req.session.userId,
      date: {
        $gte: start,
        $lt: end,
      },
    });

    const spent = monthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Budget
    const budget = await Budget.findOne({
      user: req.session.userId,
      month,
    });

    const limit = budget ? budget.limit : null;

    const remaining =
      limit !== null
        ? limit - spent
        : null;

    // Category Breakdown
    const categoryBreakdown = {};

    monthExpenses.forEach((expense) => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = 0;
      }

      categoryBreakdown[expense.category] += expense.amount;
    });

    // Recent Expenses
    const recentExpenses = await Expense.find({
      user: req.session.userId,
    })
      .sort({ date: -1 })
      .limit(5);

    res.render("dashboard/index", {
      title: "Dashboard",

      month,

      spent,
      limit,
      remaining,

      recentExpenses,
      categoryBreakdown,
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
};