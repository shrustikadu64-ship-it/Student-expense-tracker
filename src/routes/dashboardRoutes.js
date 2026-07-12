const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.get('/', isLoggedIn, dashboardController.index);

module.exports = router;