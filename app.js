const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
require("dotenv").config();

const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");


const app = express();

// ======================
// View Engine
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// ======================
// Middleware
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Session
// ======================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(flash());

// ======================
// Global Variables
// ======================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userId = req.session.userId || null;
  res.locals.userName = req.session.userName || null;
  next();
});

// ======================
// Website Routes
// ======================
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/expenses", expenseRoutes);
app.use("/budget", budgetRoutes);

// ======================
// ======================

// ======================
// Home
// ======================
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/dashboard");
  }
  res.redirect("/login");
});

// ======================
// 404
// ======================
app.use((req, res) => {
  res.status(404).send("404 | Page Not Found");
});

// ======================
// Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("🚀 Server running on http://localhost:" + PORT);
    });
  } catch (err) {
    console.error("❌ Failed to start server");
    console.error(err);
  }
}

startServer();