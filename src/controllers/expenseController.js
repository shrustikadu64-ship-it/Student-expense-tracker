const Expense = require("../models/Expense");

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

// Show All Expenses
const index = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.session.userId,
    }).sort({ date: -1 });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.render("expenses/index", {
      title: "Expenses",
      expenses,
      total,
      categories,
      selectedCategory: "",
      selectedMonth: "",
    });

  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
};

// Show Add Expense Page
const getNewExpense = (req, res) => {
  res.render("expenses/new", {
    title: "Add Expense",
    categories,
  });
};

// Save Expense
const createExpense = async (req, res) => {
  try {

    const { title, amount, category, date, notes } = req.body;

    await Expense.create({
      user: req.session.userId,
      title,
      amount,
      category,
      date,
      notes,
    });

    req.flash("success", "Expense Added Successfully");

    res.redirect("/expenses");

  } catch (err) {
    console.log(err);
    res.redirect("/expenses/new");
  }
};

// Show Edit Page
const getEditExpense = async (req, res) => {

  const expense = await Expense.findById(req.params.id);

  res.render("expenses/edit", {
    title: "Edit Expense",
    expense,
    categories,
  });
};

// Update Expense
const updateExpense = async (req, res) => {

  const { title, amount, category, date, notes } = req.body;

  await Expense.findByIdAndUpdate(req.params.id, {
    title,
    amount,
    category,
    date,
    notes,
  });

  req.flash("success", "Expense Updated");

  res.redirect("/expenses");
};

// Delete Expense
const deleteExpense = async (req, res) => {

  await Expense.findByIdAndDelete(req.params.id);

  req.flash("success", "Expense Deleted");

  res.redirect("/expenses");
};

module.exports = {
  index,
  getNewExpense,
  createExpense,
  getEditExpense,
  updateExpense,
  deleteExpense,
};