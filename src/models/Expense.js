const mongoose = require('mongoose');

const CATEGORIES = [
  'Food',
  'Travel',
  'Books & Stationery',
  'Hostel/Rent',
  'Entertainment',
  'Health',
  'Subscriptions',
  'Other',
];

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES,
    default: 'Other',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

expenseSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Expense', expenseSchema);