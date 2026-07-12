const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Current Month (YYYY-MM)
function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Budget Page
async function index(req, res, next) {
  try {
    const month = req.query.month || currentMonth();

    const budget = await Budget.findOne({
      user: req.session.userId,
      month,
    });

    const [year, mon] = month.split("-").map(Number);

    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);

    const expenses = await Expense.find({
      user: req.session.userId,
      date: {
        $gte: start,
        $lt: end,
      },
    });

    const spent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const limit = budget ? budget.limit : null;

    const remaining =
      limit !== null
        ? limit - spent
        : null;

    res.render("budget/index", {
      title: "Monthly Budget",

      month,

      limit,
      spent,
      remaining,
    });

  } catch (err) {
    next(err);
  }
}

// Save Budget
async function set(req, res, next) {
  try {
    const { month, limit } = req.body;

    if (!month || !limit) {
      req.flash("error", "Month and Budget are required.");
      return res.redirect("/budget");
    }

    await Budget.findOneAndUpdate(
      {
        user: req.session.userId,
        month,
      },
      {
        limit: Number(limit),
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      }
    );

    req.flash("success", "Budget saved successfully.");

    res.redirect(`/budget?month=${month}`);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
  set,
  currentMonth,
};