const Expense = require('../models/Expense');

// GET /expenses
async function index(req, res, next) {
  try {
    const { category, month } = req.query;
    const filter = { user: req.session.userId };

    if (category) {
      filter.category = category;
    }

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.render('expenses/index', {
      title: 'My Expenses',
      expenses,
      total,
      categories: Expense.CATEGORIES,
      selectedCategory: category || '',
      selectedMonth: month || '',
    });
  } catch (err) {
    next(err);
  }
}

// GET /expenses/new
function newForm(req, res) {
  res.render('expenses/new', {
    title: 'Add Expense',
    categories: Expense.CATEGORIES,
  });
}

// POST /expenses
async function create(req, res, next) {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category || !date) {
      req.flash('error', 'Title, amount, category and date are required.');
      return res.redirect('/expenses/new');
    }

    await Expense.create({
      title: title.trim(),
      amount: Number(amount),
      category,
      date: new Date(date),
      notes: (notes || '').trim(),
      user: req.session.userId,
    });

    req.flash('success', 'Expense added successfully.');
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
}

// GET /expenses/:id/edit
async function editForm(req, res, next) {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!expense) {
      req.flash('error', 'Expense not found.');
      return res.redirect('/expenses');
    }

    res.render('expenses/edit', {
      title: 'Edit Expense',
      expense,
      categories: Expense.CATEGORIES,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /expenses/:id
async function update(req, res, next) {
  try {
    const { title, amount, category, date, notes } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!expense) {
      req.flash('error', 'Expense not found.');
      return res.redirect('/expenses');
    }

    expense.title    = title.trim();
    expense.amount   = Number(amount);
    expense.category = category;
    expense.date     = new Date(date);
    expense.notes    = (notes || '').trim();

    await expense.save();

    req.flash('success', 'Expense updated successfully.');
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
}

// DELETE /expenses/:id
async function remove(req, res, next) {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!expense) {
      req.flash('error', 'Expense not found.');
    } else {
      req.flash('success', 'Expense deleted.');
    }

    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
}

module.exports = { index, newForm, create, editForm, update, remove };