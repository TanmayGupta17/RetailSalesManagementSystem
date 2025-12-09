/**
 * Validate query parameters
 */
function validateQueryParams(params) {
    const errors = [];

    // Validate page
    if (params.page && (isNaN(params.page) || params.page < 1)) {
        errors.push('Page must be a positive number');
    }

    // Validate limit
    if (params.limit && (isNaN(params.limit) || params.limit < 1 || params.limit > 100)) {
        errors.push('Limit must be between 1 and 100');
    }

    // Validate age range
    if (params.ageMin && isNaN(params.ageMin)) {
        errors.push('ageMin must be a number');
    }
    if (params.ageMax && isNaN(params.ageMax)) {
        errors.push('ageMax must be a number');
    }
    if (params.ageMin && params.ageMax && parseInt(params.ageMin) > parseInt(params.ageMax)) {
        errors.push('ageMin cannot be greater than ageMax');
    }

    // Validate dates
    if (params.dateFrom && isNaN(Date.parse(params.dateFrom))) {
        errors.push('dateFrom must be a valid date');
    }
    if (params.dateTo && isNaN(Date.parse(params.dateTo))) {
        errors.push('dateTo must be a valid date');
    }

    // Validate sort
    const validSortFields = ['date', 'quantity', 'customerName'];
    if (params.sortBy && !validSortFields.includes(params.sortBy)) {
        errors.push(`sortBy must be one of: ${validSortFields.join(', ')}`);
    }

    const validSortOrders = ['asc', 'desc'];
    if (params.sortOrder && !validSortOrders.includes(params.sortOrder)) {
        errors.push(`sortOrder must be one of: ${validSortOrders.join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Format error response
 */
function formatErrorResponse(message, errors = []) {
    return {
        success: false,
        message,
        errors
    };
}

/**
 * Format success response
 */
function formatSuccessResponse(data, message = 'Success') {
    return {
        success: true,
        message,
        data
    };
}

module.exports = {
    validateQueryParams,
    formatErrorResponse,
    formatSuccessResponse
};
