# Architecture Document
**Retail Sales Management System**

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Flow](#data-flow)
5. [Folder Structure](#folder-structure)
6. [Module Responsibilities](#module-responsibilities)

---

## System Overview

The Retail Sales Management System is a full-stack web application designed to manage and analyze retail transaction data. The architecture follows a clean separation of concerns with a RESTful API backend and a component-based frontend.

### Key Design Principles
- **Separation of Concerns:** Clear boundaries between presentation, business logic, and data layers
- **Modularity:** Reusable components and services
- **Scalability:** Indexed MongoDB queries and efficient pagination
- **Maintainability:** Clean code structure with consistent naming conventions

---

## Backend Architecture

### Technology Stack
- **Node.js** + **Express.js:** Server framework
- **MongoDB** + **Mongoose:** Database and ODM
- **csv-parser:** Data import utility

### Architecture Pattern
The backend follows a **layered architecture** pattern:

```
┌─────────────────────────────────────┐
│         Routes Layer                │  (HTTP endpoints)
├─────────────────────────────────────┤
│       Controllers Layer             │  (Request handling)
├─────────────────────────────────────┤
│        Services Layer               │  (Business logic)
├─────────────────────────────────────┤
│         Models Layer                │  (Data schemas)
├─────────────────────────────────────┤
│         MongoDB Database            │  (Data persistence)
└─────────────────────────────────────┘
```

### Layer Responsibilities

**1. Routes Layer** (`src/routes/`)
- Defines API endpoints
- Maps HTTP methods to controller functions
- Handles route-level middleware

**2. Controllers Layer** (`src/controllers/`)
- Receives HTTP requests
- Validates input
- Calls service layer methods
- Formats and sends HTTP responses
- Error handling

**3. Services Layer** (`src/services/`)
- Contains business logic
- Implements search, filter, sort, pagination algorithms
- Query builder for MongoDB
- Data transformation
- Database operations orchestration

**4. Models Layer** (`src/models/`)
- Defines MongoDB schemas
- Data validation rules
- Indexes for query optimization
- Schema methods and virtuals

**5. Utils Layer** (`src/utils/`)
- CSV import functionality
- Data validators
- Helper functions
- Reusable utilities

### Database Design

**Transaction Model** (Denormalized Design)
```javascript
{
  transactionID: String,
  date: Date,
  
  // Customer fields
  customerID, customerName, phoneNumber, gender,
  age, customerRegion, customerType,
  
  // Product fields
  productID, productName, brand, productCategory, tags[],
  
  // Sales fields
  quantity, pricePerUnit, discountPercentage,
  totalAmount, finalAmount,
  
  // Operational fields
  paymentMethod, orderStatus, deliveryType,
  storeID, storeLocation, salespersonID, employeeName
}
```

**Design Rationale:**
- Single collection for optimal query performance
- Eliminates JOINs for search, filter, sort, pagination
- Strategic indexes on filter and sort fields
- Text index for full-text search

### API Endpoints

```
GET /api/transactions
  Query params: search, filters, sort, pagination
  Returns: { success, data[], pagination }

GET /api/transactions/filters
  Returns: { success, data: { regions[], categories[], ... } }

GET /api/transactions/statistics
  Returns: { success, data: { totalTransactions, totalRevenue, ... } }
```

### Query Building Strategy

The service layer builds dynamic MongoDB queries based on request parameters:

```javascript
{
  // Text search
  $or: [{ customerName: /search/i }, { phoneNumber: /search/i }],
  
  // Multi-select filters
  customerRegion: { $in: ['North', 'South'] },
  gender: { $in: ['Male'] },
  
  // Range filters
  age: { $gte: 18, $lte: 65 },
  date: { $gte: startDate, $lte: endDate }
}
```

---

## Frontend Architecture

### Technology Stack
- **Next.js 15:** React framework with App Router
- **React 19:** UI library
- **CSS Modules:** Component-scoped styling

### Architecture Pattern
The frontend follows a **component-based architecture** with custom hooks for state management:

```
┌─────────────────────────────────────┐
│         Pages Layer                 │  (Routes/Views)
├─────────────────────────────────────┤
│       Components Layer              │  (UI components)
├─────────────────────────────────────┤
│         Hooks Layer                 │  (State management)
├─────────────────────────────────────┤
│        Services Layer               │  (API communication)
└─────────────────────────────────────┘
```

### Component Hierarchy

```
Dashboard (Page)
├── SearchBar
├── FilterPanel
├── Toolbar
│   ├── SortDropdown
│   └── ResultsInfo
├── TransactionTable
└── Pagination
```

### State Management

**Custom Hook: `useTransactions`**
- Centralized state for transactions, filters, sort, pagination
- Handles API calls
- Manages loading and error states
- Provides action methods (updateFilters, updateSort, etc.)
- Implements automatic refetch on state changes

```javascript
const {
  transactions,        // Current page data
  loading,            // Loading state
  error,              // Error state
  pagination,         // Metadata
  filters,            // Filter state
  sortBy, sortOrder,  // Sort state
  updateFilters,      // Filter actions
  updateSort,         // Sort actions
  resetFilters,       // Reset action
  nextPage, prevPage, // Pagination actions
  goToPage            // Direct navigation
} = useTransactions();
```

### Component Responsibilities

**SearchBar**
- Text input for search
- Clear button
- Triggers search on submit
- Debounced search updates

**FilterPanel**
- Multi-select checkboxes (region, gender, category, etc.)
- Range inputs (age, date)
- Collapsible panel
- Active filter badge count
- Clear all filters action

**SortDropdown**
- Sort field selection
- Sort order toggle
- Visual feedback for active sort

**TransactionTable**
- Displays paginated data in table format
- Loading state animation
- Empty state message
- Responsive scrolling
- Formatted data display

**Pagination**
- Page navigation controls
- Page number buttons with ellipsis
- Results count display
- Disabled state for boundaries

### Service Layer

**API Service** (`services/api.js`)
- HTTP client wrapper
- Query string builder
- Error handling
- Base URL configuration

```javascript
class TransactionAPI {
  async getTransactions(params)
  async getFilterOptions()
  async getStatistics()
  buildQueryString(params)
}
```

---

## Data Flow

### Search, Filter, Sort, Pagination Flow

```
User Action (Search/Filter/Sort)
    ↓
Component State Update
    ↓
useTransactions Hook
    ↓
API Service (buildQueryString)
    ↓
HTTP Request to Backend
    ↓
Express Route Handler
    ↓
Controller (validation)
    ↓
Service (buildQuery, buildSort)
    ↓
MongoDB Query Execution
    ↓
Response with Data + Pagination Metadata
    ↓
Frontend State Update
    ↓
Component Re-render
```

### Query Parameter Flow

```
Frontend State:
{
  search: "John",
  customerRegion: ["North", "South"],
  gender: ["Male"],
  ageMin: 25,
  ageMax: 45,
  sortBy: "date",
  sortOrder: "desc",
  page: 2
}
    ↓
API Request:
GET /api/transactions?search=John&customerRegion=North&customerRegion=South
    &gender=Male&ageMin=25&ageMax=45&sortBy=date&sortOrder=desc&page=2
    ↓
Backend Query:
{
  $or: [{ customerName: /John/i }, { phoneNumber: /John/i }],
  customerRegion: { $in: ["North", "South"] },
  gender: { $in: ["Male"] },
  age: { $gte: 25, $lte: 45 }
}
sort: { date: -1 }
skip: 10
limit: 10
```

---

## Folder Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── transactionController.js    # Request handlers
│   ├── services/
│   │   └── transactionService.js       # Business logic
│   ├── models/
│   │   └── Transaction.js              # Database schema
│   ├── routes/
│   │   └── transactionRoutes.js        # API endpoints
│   ├── utils/
│   │   ├── csvImporter.js              # Data import
│   │   └── validators.js               # Input validation
│   └── index.js                        # Server entry point
├── scripts/
│   └── importData.js                   # CSV import script
├── package.json
└── .env
```

### Frontend Structure
```
frontend/
├── app/
│   ├── page.js                         # Main dashboard
│   ├── page.module.css                 # Dashboard styles
│   ├── layout.js                       # Root layout
│   └── globals.css                     # Global styles
├── src/
│   ├── components/
│   │   ├── SearchBar.js                # Search component
│   │   ├── SearchBar.module.css
│   │   ├── FilterPanel.js              # Filter component
│   │   ├── FilterPanel.module.css
│   │   ├── TransactionTable.js         # Table component
│   │   ├── TransactionTable.module.css
│   │   ├── Pagination.js               # Pagination component
│   │   ├── Pagination.module.css
│   │   ├── SortDropdown.js             # Sort component
│   │   └── SortDropdown.module.css
│   ├── hooks/
│   │   └── useTransactions.js          # State management hook
│   ├── services/
│   │   └── api.js                      # API client
│   └── utils/
├── package.json
└── .env.local
```

---

## Module Responsibilities

### Backend Modules

**transactionController.js**
- HTTP request handling
- Response formatting
- Error catching and status codes

**transactionService.js**
- Search implementation (regex queries)
- Filter implementation (dynamic query building)
- Sort implementation (MongoDB sort objects)
- Pagination logic (skip/limit calculations)
- Filter options fetching (distinct values)

**Transaction.js (Model)**
- Schema definition
- Field validation
- Index definitions
- Data types enforcement

**csvImporter.js**
- CSV file reading
- Data parsing and transformation
- Batch insertion to MongoDB
- Error handling for malformed data

**validators.js**
- Query parameter validation
- Type checking
- Range validation
- Error message formatting

### Frontend Modules

**useTransactions.js (Hook)**
- Centralized state management
- API call orchestration
- Side effect handling (useEffect)
- Action creators for filters, sort, pagination
- Automatic refetch on dependency changes

**api.js (Service)**
- HTTP requests abstraction
- Query string building
- Error handling
- Base URL management

**Components**
- **SearchBar:** User input, debouncing, clear functionality
- **FilterPanel:** Multi-select UI, range inputs, state updates
- **SortDropdown:** Sort selection, visual feedback
- **TransactionTable:** Data display, loading/empty states
- **Pagination:** Navigation controls, page info display

---

## Performance Optimizations

### Backend
1. **Database Indexes:** All filter and sort fields are indexed
2. **Lean Queries:** Use `.lean()` to return plain objects
3. **Batch Operations:** CSV import uses batched `insertMany`
4. **Compound Indexes:** Optimized for common filter combinations

### Frontend
1. **CSS Modules:** Component-scoped styles prevent conflicts
2. **Conditional Rendering:** Loading and empty states
3. **Debouncing:** Search input optimized (can be added)
4. **Memoization:** useCallback for stable function references
5. **Code Splitting:** Next.js automatic code splitting

---

## Error Handling

### Backend
- Try-catch blocks in all async operations
- Consistent error response format
- MongoDB connection error handling
- Validation errors with detailed messages

### Frontend
- Error state in useTransactions hook
- User-friendly error messages
- Fallback UI for errors
- Network error handling

---

## Security Considerations

1. **Input Validation:** All query params validated
2. **CORS Configuration:** Restricted to frontend origin
3. **Environment Variables:** Sensitive data in .env
4. **NoSQL Injection Prevention:** Mongoose query builders
5. **Rate Limiting:** Can be added with express-rate-limit

---

## Scalability Considerations

1. **Database:** MongoDB supports horizontal scaling with sharding
2. **Caching:** Redis can be added for filter options and statistics
3. **CDN:** Static assets can be served via CDN
4. **Load Balancing:** Multiple backend instances with nginx
5. **Database Replication:** MongoDB replica sets for high availability

---

## Testing Strategy

### Backend Testing
- Unit tests for service layer (query building)
- Integration tests for API endpoints
- Database mock testing with jest and mongodb-memory-server

### Frontend Testing
- Component unit tests with React Testing Library
- Hook testing with renderHook
- Integration tests for data flow
- E2E tests with Playwright (can be added)

---

## Deployment Considerations

### Backend
- Environment: Node.js runtime (AWS EC2, Heroku, Railway)
- Database: MongoDB Atlas (cloud) or self-hosted
- Environment variables via platform settings

### Frontend
- Platform: Vercel (optimal for Next.js) or Netlify
- Environment variables in deployment settings
- API URL configuration per environment

---

## Future Enhancements

1. **Authentication:** User login with JWT
2. **Authorization:** Role-based access control
3. **Real-time Updates:** WebSocket for live data
4. **Export Functionality:** CSV/PDF export of filtered data
5. **Advanced Analytics:** Charts and graphs with Chart.js
6. **Bulk Operations:** Multi-select for batch actions
7. **Audit Logs:** Transaction history tracking
8. **Mobile App:** React Native version
