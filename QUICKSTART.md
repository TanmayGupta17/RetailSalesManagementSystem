# Quick Start Guide
**Retail Sales Management System**

## Prerequisites
- Node.js v18+ installed
- MongoDB v6+ installed and running
- npm or yarn package manager
- CSV dataset file (`truestate_assignment_dataset.csv`)

## Step-by-Step Setup

### 1. Clone or Download Project
```bash
cd RetailSalesManagementSystem
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URL
# PORT=8000
# MONGO_URL=mongodb://localhost:27017/retail_sales
# FRONTEND_URL=http://localhost:3000

# Ensure MongoDB is running
# Windows: Check Services or run mongod
# Linux: sudo systemctl start mongod
# Mac: brew services start mongodb-community

# Import CSV data (place CSV file in root directory first)
npm run import

# Start backend server
npm start
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access Application

Open browser and navigate to: `http://localhost:3000`

## Verify Installation

1. **Backend Health Check:**
   - Visit: `http://localhost:8000/health`
   - Should see: `{"success":true,"message":"Server is running",...}`

2. **Frontend:**
   - Visit: `http://localhost:3000`
   - Should see the dashboard with transactions

3. **Test Features:**
   - Try searching for a customer name
   - Apply some filters (region, gender, etc.)
   - Change sorting options
   - Navigate between pages

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: Start MongoDB service
# Linux: sudo systemctl start mongod
# Mac: brew services start mongodb-community
```

### Port Already in Use
```bash
# Backend (port 8000):
# Edit backend/.env and change PORT=8001

# Frontend (port 3000):
# Next.js will automatically try port 3001 if 3000 is busy
```

### CSV Import Fails
```bash
# Ensure CSV file is at: RetailSalesManagementSystem/truestate_assignment_dataset.csv
# Check file path in: backend/scripts/importData.js
# Run import again: cd backend && npm run import
```

### Frontend Can't Connect to Backend
```bash
# Verify backend is running on port 8000
# Check frontend/.env.local has correct API URL
# Check browser console for CORS errors
```

## Development Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm run import     # Import CSV data
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Production Build

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## API Testing

### Using curl:
```bash
# Get transactions
curl "http://localhost:8000/api/transactions?page=1&limit=10"

# Search
curl "http://localhost:8000/api/transactions?search=John"

# Filter by region
curl "http://localhost:8000/api/transactions?customerRegion=North"

# Get filter options
curl "http://localhost:8000/api/transactions/filters"

# Get statistics
curl "http://localhost:8000/api/transactions/statistics"
```

### Using Postman:
Import these endpoints:
- GET `http://localhost:8000/api/transactions`
- GET `http://localhost:8000/api/transactions/filters`
- GET `http://localhost:8000/api/transactions/statistics`

## Default Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 8000 | http://localhost:8000 |
| Frontend | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## Environment Variables Reference

### Backend (.env)
```env
PORT=8000                                      # Server port
MONGO_URL=mongodb://localhost:27017/retail_sales  # Database URL
FRONTEND_URL=http://localhost:3000             # CORS origin
NODE_ENV=development                           # Environment
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api  # Backend API URL
```

## Next Steps

1. ✅ Import your dataset
2. ✅ Start both servers
3. ✅ Access the dashboard
4. ✅ Test search functionality
5. ✅ Apply various filters
6. ✅ Try different sorting options
7. ✅ Navigate through pages
8. 📝 Customize as needed

## Support

For issues:
1. Check this guide's troubleshooting section
2. Review README.md for detailed information
3. Check docs/architecture.md for system design
4. Verify all environment variables are set correctly
5. Check console/terminal for error messages

Happy coding! 🚀
