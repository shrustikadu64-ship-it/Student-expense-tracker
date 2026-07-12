const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.use(isLoggedIn);

router.get('/', expenseController.index);
router.get('/new', expenseController.newForm);
router.post('/', expenseController.create);
router.get('/:id/edit', expenseController.editForm);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.remove);

module.exports = router;