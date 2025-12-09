const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions - Get paginated transactions with filters
router.get('/', transactionController.getTransactions);

// GET /api/transactions/filters - Get available filter options
router.get('/filters', transactionController.getFilterOptions);

// GET /api/transactions/statistics - Get statistics
router.get('/statistics', transactionController.getStatistics);

module.exports = router;
