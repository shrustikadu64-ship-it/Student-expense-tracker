const express = require("express");
const router = express.Router();

const {
  getRegister,
  register,
  getLogin,
  login,
  logout,
} = require("../controllers/authController");

// Register
router.get("/register", getRegister);
router.post("/register", register);

// Login
router.get("/login", getLogin);
router.post("/login", login);

// Logout
router.get("/logout", logout);

module.exports = router;