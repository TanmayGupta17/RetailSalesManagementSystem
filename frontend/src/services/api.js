const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

class TransactionAPI {
    /**
     * Get transactions with filters, search, sort, and pagination
     */
    async getTransactions(params = {}) {
        try {
            const queryString = this.buildQueryString(params);
            const response = await fetch(`${API_BASE_URL}/transactions?${queryString}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    /**
     * Get available filter options
     */
    async getFilterOptions() {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/filters`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching filter options:', error);
            throw error;
        }
    }

    /**
     * Get transaction statistics
     */
    async getStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/statistics`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    }

    /**
     * Build query string from parameters
     */
    buildQueryString(params) {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach(key => {
            const value = params[key];

            if (value === null || value === undefined || value === '') {
                return;
            }

            if (Array.isArray(value)) {
                value.forEach(v => {
                    if (v) queryParams.append(key, v);
                });
            } else {
                queryParams.append(key, value);
            }
        });

        return queryParams.toString();
    }
}

export default new TransactionAPI();
