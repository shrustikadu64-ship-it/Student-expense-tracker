const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.use(isLoggedIn);

router.get('/', budgetController.index);
router.post('/', budgetController.set);

module.exports = router;