const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Transaction ID
    transactionID: {
        type: String,
        unique: true,
        sparse: true,  // Allows multiple null values
        index: true
    },

    // Date
    date: {
        type: Date,
        index: true
    },

    // Customer Fields
    customerID: {
        type: String,
        index: true
    },
    customerName: {
        type: String,
        trim: true,
        index: true
    },
    phoneNumber: {
        type: String,
        index: true
    },
    gender: {
        type: String,
        index: true
    },
    age: {
        type: Number,
        min: 0,
        index: true
    },
    customerRegion: {
        type: String,
        index: true
    },
    customerType: {
        type: String,
        enum: ['New', 'Returning', 'Loyal'],
        index: true
    },

    // Product Fields
    productID: {
        type: String,
        index: true
    },
    productName: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    productCategory: {
        type: String,
        index: true
    },
    tags: {
        type: [String],
        default: [],
        index: true
    },

    // Sales Fields
    quantity: {
        type: Number,
        min: 0,
        index: true
    },
    pricePerUnit: {
        type: Number,
        min: 0
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    totalAmount: {
        type: Number,
        min: 0
    },
    finalAmount: {
        type: Number,
        min: 0
    },

    // Operational Fields
    paymentMethod: {
        type: String,
        index: true
    },
    orderStatus: {
        type: String,
        index: true
    },
    deliveryType: {
        type: String
    },
    storeID: {
        type: String,
        index: true
    },
    storeLocation: {
        type: String
    },
    salespersonID: {
        type: String,
        index: true
    },
    employeeName: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    collection: 'transactions'
});

// Text index for search functionality
TransactionSchema.index({
    customerName: 'text',
    phoneNumber: 'text'
});

// Compound indexes for common query patterns
TransactionSchema.index({ date: -1, customerName: 1 });
TransactionSchema.index({ customerRegion: 1, productCategory: 1 });
TransactionSchema.index({ date: -1, quantity: -1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
