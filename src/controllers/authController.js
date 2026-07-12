const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SALT_ROUNDS = 10;

// GET /register
function getRegister(req, res) {
  res.render('auth/register', { title: 'Register' });
}

// POST /register
async function postRegister(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/register');
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    req.session.userId = user._id;
    req.session.userName = user.name;

    req.flash('success', `Welcome, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
}

// GET /login
function getLogin(req, res) {
  res.render('auth/login', { title: 'Login' });
}

// POST /login
async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect('/login');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    req.session.userId = user._id;
    req.session.userName = user.name;

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
}

// GET /logout
function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
}

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };