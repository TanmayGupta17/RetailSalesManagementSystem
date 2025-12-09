const transactionService = require('../services/transactionService');

class TransactionController {
    /**
     * GET /api/transactions
     * Get paginated transactions with search, filter, and sort
     */
    async getTransactions(req, res) {
        try {
            const result = await transactionService.getTransactions(req.query);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getTransactions:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET /api/transactions/filters
     * Get available filter options
     */
    async getFilterOptions(req, res) {
        try {
            const result = await transactionService.getFilterOptions();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getFilterOptions:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET /api/transactions/statistics
     * Get transaction statistics
     */
    async getStatistics(req, res) {
        try {
            const result = await transactionService.getStatistics();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getStatistics:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }
}

module.exports = new TransactionController();
