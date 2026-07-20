require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");

const app = express();

// Connect Database
connectDB();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/expenses", expenseRoutes);
app.use("/budget", budgetRoutes);

// Default Route
app.get("/", (req, res) => {
  res.redirect("/login");
});

// 404 Page
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});