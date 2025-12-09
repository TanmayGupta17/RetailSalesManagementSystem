# Backend - Retail Sales Management System

## Overview
RESTful API server for managing retail transaction data with advanced search, filtering, sorting, and pagination capabilities.

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- csv-parser for data import

## Project Structure
```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── utils/            # Helper functions
│   └── index.js          # Server entry
├── scripts/
│   └── importData.js     # CSV import script
├── package.json
└── .env
```

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file:
```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/retail_sales
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Import Dataset

Place `truestate_assignment_dataset.csv` in the root directory, then run:
```bash
npm run import
```

## API Endpoints

### GET /api/transactions
Get paginated transactions with filters

**Query Parameters:**
- `search` - Search customer name or phone
- `customerRegion[]` - Filter by regions (multi-select)
- `gender[]` - Filter by gender (multi-select)
- `ageMin`, `ageMax` - Age range filter
- `productCategory[]` - Filter by categories (multi-select)
- `tags[]` - Filter by product tags (multi-select)
- `paymentMethod[]` - Filter by payment methods (multi-select)
- `dateFrom`, `dateTo` - Date range filter
- `sortBy` - Sort field (date, quantity, customerName)
- `sortOrder` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "totalItems": 500,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/transactions/filters
Get available filter options

**Response:**
```json
{
  "success": true,
  "data": {
    "customerRegions": ["North", "South", ...],
    "genders": ["Male", "Female", ...],
    "productCategories": ["Electronics", ...],
    "tags": ["laptop", "phone", ...],
    "paymentMethods": ["Credit Card", ...]
  }
}
```

### GET /api/transactions/statistics
Get transaction statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 1000,
    "totalRevenue": 5000000,
    "totalDiscount": 250000,
    "avgQuantity": 2.5
  }
}
```

## Database Schema

### Transaction Model
```javascript
{
  transactionID: String,
  date: Date,
  customerID: String,
  customerName: String,
  phoneNumber: String,
  gender: String,
  age: Number,
  customerRegion: String,
  customerType: String,
  productID: String,
  productName: String,
  brand: String,
  productCategory: String,
  tags: [String],
  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  paymentMethod: String,
  orderStatus: String,
  deliveryType: String,
  storeID: String,
  storeLocation: String,
  salespersonID: String,
  employeeName: String
}
```

## Features
- ✅ Full-text search (case-insensitive)
- ✅ Multi-select filters
- ✅ Range-based filters
- ✅ Dynamic sorting
- ✅ Efficient pagination
- ✅ Indexed queries for performance
- ✅ CSV data import
- ✅ Error handling
- ✅ CORS configuration
