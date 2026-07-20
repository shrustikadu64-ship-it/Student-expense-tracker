const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Show Register Page
const getRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "Email already exists.");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");

  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
};

// Show Login Page
const getLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
  });
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid Email or Password.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error", "Invalid Email or Password.");
      return res.redirect("/login");
    }

    req.session.userId = user._id;
    req.session.userName = user.name;

    req.flash("success", "Welcome Back!");

    res.redirect("/dashboard");

  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

module.exports = {
  getRegister,
  register,
  getLogin,
  login,
  logout,
};