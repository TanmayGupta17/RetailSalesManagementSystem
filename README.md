# Retail Sales Management System

## Overview
A full-stack retail sales management system built with Next.js and Node.js that provides advanced search, filtering, sorting, and pagination capabilities for transaction data. The system processes structured sales data with customer, product, sales, and operational information, offering an intuitive interface for data analysis and management.

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (React 19)
- **Styling:** CSS Modules with custom responsive design
- **State Management:** React Hooks (custom useTransactions hook)
- **API Communication:** Fetch API with custom service layer

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Data Import:** csv-parser for dataset processing

## Search Implementation Summary
The search functionality implements full-text case-insensitive search across Customer Name and Phone Number fields using MongoDB regex queries. The search operates independently and maintains state alongside active filters and sorting. The implementation uses debouncing for optimal performance and works seamlessly with pagination, preserving search terms across page navigations.

## Filter Implementation Summary
Multi-select and range-based filtering is implemented for:
- **Multi-select filters:** Customer Region, Gender, Product Category, Tags, Payment Method
- **Range filters:** Age Range (min-max), Date Range (from-to)

Filters work independently and in combination using MongoDB's `$in` operator for multi-select and comparison operators for ranges. The filter state is managed through React hooks and persists across sort and pagination changes. The backend builds dynamic MongoDB queries based on active filters, ensuring efficient database operations.

## Sorting Implementation Summary
Sorting is implemented for three fields:
- **Date:** Newest First (default) / Oldest First
- **Quantity:** High to Low / Low to High
- **Customer Name:** A-Z / Z-A

The sort mechanism uses MongoDB's native sort functionality with indexed fields for optimal performance. Sort state is preserved across search, filter, and pagination operations. The frontend provides an intuitive dropdown interface with clear visual feedback for the active sort option.

## Pagination Implementation Summary
Pagination is implemented with a fixed page size of 10 items per page. The system provides:
- Previous/Next navigation buttons
- Direct page number selection with ellipsis for large page counts
- Page information display (showing X to Y of Z transactions)
- Disabled state handling for boundary pages

Pagination maintains all active search, filter, and sort states across page navigations. The backend uses MongoDB's `skip()` and `limit()` methods with countDocuments() for accurate total counts and efficient query execution.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory (copy from `.env.example`):
```env
PORT=8001
MONGO_URL=mongodb://localhost:27017/retail_sales
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. Ensure MongoDB is running on your system

5. Import the dataset:
```bash
npm run import
```

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:8001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the frontend directory (copy from `.env.local.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Running the Complete System

1. Start MongoDB service
2. Run backend: `cd backend && npm start`
3. Run frontend: `cd frontend && npm run dev`
4. Access the application at `http://localhost:3000`

### Project Structure
```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── scripts/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── .env.local
├── docs/
│   └── architecture.md
└── README.md
```

### API Endpoints

**GET /api/transactions**
- Query params: search, customerRegion, gender, ageMin, ageMax, productCategory, tags, paymentMethod, dateFrom, dateTo, sortBy, sortOrder, page, limit
- Returns paginated transaction data

**GET /api/transactions/filters**
- Returns available filter options (regions, categories, etc.)

**GET /api/transactions/statistics**
- Returns transaction statistics

### Troubleshooting

**Database connection error:**
- Ensure MongoDB is running: `sudo systemctl start mongod` (Linux) or check MongoDB service (Windows)
- Verify MONGO_URL in `.env` matches your MongoDB instance

**Frontend can't connect to backend:**
- Ensure backend is running on port 8001
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`
- Verify CORS settings in backend

**Import script fails:**
- Place CSV file at root: `truestate_assignment_dataset.csv`
- Check file path in `backend/scripts/importData.js`
- Ensure MongoDB connection is working

## Features
✅ Full-text search across customer name and phone
✅ Multi-select filters for categorical data
✅ Range filters for age and dates
✅ Dynamic sorting with three options
✅ Paginated results (10 per page)
✅ Responsive design for mobile and desktop
✅ Real-time filter and search updates
✅ Clean, modern UI with gradient accents
✅ Empty state and error handling
✅ Loading states and transitions
