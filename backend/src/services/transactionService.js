const Transaction = require('../models/Transaction');

class TransactionService {
    /**
     * Get transactions with search, filter, sort, and pagination
     * @param {Object} queryParams - Query parameters from request
     * @returns {Object} - Paginated transactions with metadata
     */
    async getTransactions(queryParams) {
        const {
            // Search
            search = '',

            // Filters
            customerRegion = [],
            gender = [],
            ageMin,
            ageMax,
            productCategory = [],
            tags = [],
            paymentMethod = [],
            dateFrom,
            dateTo,

            // Sorting
            sortBy = 'date',
            sortOrder = 'desc',

            // Pagination
            page = 1,
            limit = 10
        } = queryParams;

        // Build query object
        const query = this.buildQuery({
            search,
            customerRegion,
            gender,
            ageMin,
            ageMax,
            productCategory,
            tags,
            paymentMethod,
            dateFrom,
            dateTo
        });

        // Build sort object
        const sort = this.buildSort(sortBy, sortOrder);

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        try {
            // Execute query with pagination
            const [transactions, total] = await Promise.all([
                Transaction.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(limitNum)
                    .lean(),
                Transaction.countDocuments(query)
            ]);

            // Calculate metadata
            const totalPages = Math.ceil(total / limitNum);
            const hasNext = page < totalPages;
            const hasPrev = page > 1;

            return {
                success: true,
                data: transactions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limitNum,
                    hasNext,
                    hasPrev
                }
            };
        } catch (error) {
            throw new Error(`Error fetching transactions: ${error.message}`);
        }
    }

    /**
     * Build MongoDB query based on filters
     */
    buildQuery(filters) {
        const query = {};

        // Search: Customer Name or Phone Number (case-insensitive)
        if (filters.search && filters.search.trim()) {
            const searchRegex = new RegExp(filters.search.trim(), 'i');
            query.$or = [
                { customerName: searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        // Filter: Customer Region (multi-select)
        if (filters.customerRegion && filters.customerRegion.length > 0) {
            const regions = Array.isArray(filters.customerRegion)
                ? filters.customerRegion
                : [filters.customerRegion];
            query.customerRegion = { $in: regions };
        }

        // Filter: Gender (multi-select)
        if (filters.gender && filters.gender.length > 0) {
            const genders = Array.isArray(filters.gender)
                ? filters.gender
                : [filters.gender];
            query.gender = { $in: genders };
        }

        // Filter: Age Range
        if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
            query.age = {};
            if (filters.ageMin !== undefined && filters.ageMin !== '') {
                query.age.$gte = parseInt(filters.ageMin);
            }
            if (filters.ageMax !== undefined && filters.ageMax !== '') {
                query.age.$lte = parseInt(filters.ageMax);
            }
        }

        // Filter: Product Category (multi-select)
        if (filters.productCategory && filters.productCategory.length > 0) {
            const categories = Array.isArray(filters.productCategory)
                ? filters.productCategory
                : [filters.productCategory];
            query.productCategory = { $in: categories };
        }

        // Filter: Tags (multi-select)
        if (filters.tags && filters.tags.length > 0) {
            const tagsList = Array.isArray(filters.tags)
                ? filters.tags
                : [filters.tags];
            query.tags = { $in: tagsList };
        }

        // Filter: Payment Method (multi-select)
        if (filters.paymentMethod && filters.paymentMethod.length > 0) {
            const methods = Array.isArray(filters.paymentMethod)
                ? filters.paymentMethod
                : [filters.paymentMethod];
            query.paymentMethod = { $in: methods };
        }

        // Filter: Date Range
        if (filters.dateFrom || filters.dateTo) {
            query.date = {};
            if (filters.dateFrom) {
                query.date.$gte = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                const endDate = new Date(filters.dateTo);
                endDate.setHours(23, 59, 59, 999); // End of day
                query.date.$lte = endDate;
            }
        }

        return query;
    }

    /**
     * Build MongoDB sort object
     */
    buildSort(sortBy, sortOrder) {
        const order = sortOrder === 'asc' ? 1 : -1;

        const sortMap = {
            'date': { date: order },
            'quantity': { quantity: order },
            'customerName': { customerName: order },
            'default': { date: -1 } // Default: Newest First
        };

        return sortMap[sortBy] || sortMap['default'];
    }

    /**
     * Get unique filter values for dropdowns
     */
    async getFilterOptions() {
        try {
            const [
                regions,
                genders,
                categories,
                tags,
                paymentMethods
            ] = await Promise.all([
                Transaction.distinct('customerRegion'),
                Transaction.distinct('gender'),
                Transaction.distinct('productCategory'),
                Transaction.distinct('tags'),
                Transaction.distinct('paymentMethod')
            ]);

            return {
                success: true,
                data: {
                    customerRegions: regions.sort(),
                    genders: genders.sort(),
                    productCategories: categories.sort(),
                    tags: tags.filter(t => t).sort(),
                    paymentMethods: paymentMethods.sort()
                }
            };
        } catch (error) {
            throw new Error(`Error fetching filter options: ${error.message}`);
        }
    }

    /**
     * Get transaction statistics
     */
    async getStatistics() {
        try {
            const stats = await Transaction.aggregate([
                {
                    $group: {
                        _id: null,
                        totalTransactions: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        totalDiscount: { $sum: { $multiply: ['$totalAmount', { $divide: ['$discountPercentage', 100] }] } },
                        avgQuantity: { $avg: '$quantity' }
                    }
                }
            ]);

            return {
                success: true,
                data: stats[0] || {
                    totalTransactions: 0,
                    totalRevenue: 0,
                    totalDiscount: 0,
                    avgQuantity: 0
                }
            };
        } catch (error) {
            throw new Error(`Error fetching statistics: ${error.message}`);
        }
    }
}

module.exports = new TransactionService();
