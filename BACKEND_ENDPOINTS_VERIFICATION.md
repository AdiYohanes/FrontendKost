# 🔍 Backend Endpoints Verification - Complete Checklist

**Last Updated:** 10 Januari 2026  
**Purpose:** Verifikasi semua endpoint backend yang dibutuhkan frontend

---

## 📊 Overview

Dokumen ini berisi **SEMUA** endpoint yang digunakan oleh frontend. Gunakan untuk memastikan backend sudah lengkap.

---

## 1️⃣ Authentication & Authorization

### Auth Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| POST | `/api/auth/login` | ⚠️ Verify | Login page | CRITICAL |
| POST | `/api/auth/refresh` | ⚠️ Verify | Auto token refresh | CRITICAL |
| POST | `/api/auth/logout` | ⚠️ Verify | Logout | HIGH |

**Files:** `lib/api/services/auth.ts`

**Test Commands:**
```bash
# Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json
{
  "username": "admin",
  "password": "password"
}

# Refresh Token
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json
{
  "refreshToken": "your-refresh-token"
}

# Logout
POST http://localhost:3000/api/auth/logout
Authorization: Bearer <token>
Content-Type: application/json
{
  "refreshToken": "your-refresh-token"
}
```

---

## 2️⃣ User Management

### User Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/users` | ⚠️ Verify | User list | MEDIUM |
| GET | `/api/users/:id` | ⚠️ Verify | User detail | MEDIUM |

**Files:** `lib/api/services/users.ts`

**Query Parameters (GET /users):**
- `role` (optional): Filter by role (OWNER, PENJAGA, PENGHUNI)
- `search` (optional): Search by name/username

**Test Commands:**
```bash
# Get all users
GET http://localhost:3000/api/users
Authorization: Bearer <token>

# Get user by ID
GET http://localhost:3000/api/users/{user-id}
Authorization: Bearer <token>
```

---

## 3️⃣ Room Management

### Room Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/rooms` | ⚠️ Verify | Room list, dashboard | HIGH |
| GET | `/api/rooms/:id` | ⚠️ Verify | Room detail | HIGH |
| POST | `/api/rooms` | ⚠️ Verify | Create room | HIGH |
| PATCH | `/api/rooms/:id` | ⚠️ Verify | Update room | HIGH |
| DELETE | `/api/rooms/:id` | ⚠️ Verify | Delete room | MEDIUM |

**Files:** `lib/api/services/rooms.ts`, `lib/hooks/useRooms.ts`

**Room Model:**
```typescript
{
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  facilities?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all rooms
GET http://localhost:3000/api/rooms
Authorization: Bearer <token>

# Get room by ID
GET http://localhost:3000/api/rooms/{room-id}
Authorization: Bearer <token>

# Create room
POST http://localhost:3000/api/rooms
Authorization: Bearer <token>
Content-Type: application/json
{
  "roomNumber": "101",
  "floor": 1,
  "type": "Standard",
  "price": 1500000,
  "status": "AVAILABLE",
  "facilities": "AC, WiFi, Kamar Mandi Dalam"
}

# Update room
PATCH http://localhost:3000/api/rooms/{room-id}
Authorization: Bearer <token>
Content-Type: application/json
{
  "price": 1600000,
  "status": "OCCUPIED"
}

# Delete room
DELETE http://localhost:3000/api/rooms/{room-id}
Authorization: Bearer <token>
```

---

## 4️⃣ Resident Management

### Resident Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/residents` | ⚠️ Verify | Resident list, dashboard | HIGH |
| GET | `/api/residents/:id` | ⚠️ Verify | Resident detail | HIGH |
| POST | `/api/residents` | ⚠️ Verify | Onboard resident | HIGH |
| PATCH | `/api/residents/:id` | ⚠️ Verify | Update resident | HIGH |
| POST | `/api/residents/:id/move-out` | ⚠️ Verify | Move out resident | HIGH |

**Files:** `lib/api/services/residents.ts`, `lib/hooks/useResidents.ts`

**Query Parameters (GET /residents):**
- `isActive` (optional): Filter by active status (true/false)
- `roomId` (optional): Filter by room

**Resident Model:**
```typescript
{
  id: string;
  userId: string;
  roomId: string;
  entryDate: string;
  exitDate?: string;
  isActive: boolean;
  emergencyContact?: string;
  emergencyPhone?: string;
  user: {
    id: string;
    username: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  room: {
    id: string;
    roomNumber: string;
    floor: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all residents
GET http://localhost:3000/api/residents
Authorization: Bearer <token>

# Get active residents only
GET http://localhost:3000/api/residents?isActive=true
Authorization: Bearer <token>

# Get resident by ID
GET http://localhost:3000/api/residents/{resident-id}
Authorization: Bearer <token>

# Create resident (onboard)
POST http://localhost:3000/api/residents
Authorization: Bearer <token>
Content-Type: application/json
{
  "userId": "user-id",
  "roomId": "room-id",
  "entryDate": "2026-01-10",
  "emergencyContact": "John Doe",
  "emergencyPhone": "08123456789"
}

# Update resident
PATCH http://localhost:3000/api/residents/{resident-id}
Authorization: Bearer <token>
Content-Type: application/json
{
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "08987654321"
}

# Move out resident
POST http://localhost:3000/api/residents/{resident-id}/move-out
Authorization: Bearer <token>
```

---

## 5️⃣ Utility Management

### Utility Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/utilities/resident/:residentId` | ⚠️ Verify | Utility list by resident | HIGH |
| POST | `/api/utilities` | ⚠️ Verify | Create utility record | HIGH |
| PATCH | `/api/utilities/:id` | ⚠️ Verify | Update utility | HIGH |
| DELETE | `/api/utilities/:id` | ⚠️ Verify | Delete utility | MEDIUM |

**Files:** `lib/api/services/utilities.ts`, `lib/hooks/useUtilities.ts`

**Query Parameters (GET /utilities/resident/:residentId):**
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year
- `isBilled` (optional): Filter by billing status

**Utility Model:**
```typescript
{
  id: string;
  residentId: string;
  month: number;
  year: number;
  electricityUsage: number;
  electricityCost: number;
  waterUsage: number;
  waterCost: number;
  isBilled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get utilities by resident
GET http://localhost:3000/api/utilities/resident/{resident-id}
Authorization: Bearer <token>

# Get unbilled utilities
GET http://localhost:3000/api/utilities/resident/{resident-id}?isBilled=false
Authorization: Bearer <token>

# Create utility
POST http://localhost:3000/api/utilities
Authorization: Bearer <token>
Content-Type: application/json
{
  "residentId": "resident-id",
  "month": 1,
  "year": 2026,
  "electricityUsage": 150,
  "electricityCost": 225000,
  "waterUsage": 10,
  "waterCost": 50000
}

# Update utility
PATCH http://localhost:3000/api/utilities/{utility-id}
Authorization: Bearer <token>
Content-Type: application/json
{
  "electricityUsage": 160,
  "electricityCost": 240000
}

# Delete utility
DELETE http://localhost:3000/api/utilities/{utility-id}
Authorization: Bearer <token>
```

---

## 6️⃣ Invoice Management

### Invoice Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/invoices` | ⚠️ Verify | Invoice list | HIGH |
| GET | `/api/invoices/:id` | ⚠️ Verify | Invoice detail | HIGH |
| GET | `/api/invoices/resident/:residentId` | ⚠️ Verify | Invoices by resident | HIGH |
| POST | `/api/invoices/generate/:residentId` | ⚠️ Verify | Generate invoice | HIGH |
| PATCH | `/api/invoices/:id/payment` | ⚠️ Verify | Update payment status | HIGH |

**Files:** `lib/api/services/invoices.ts`, `lib/hooks/useInvoices.ts`

**Query Parameters (GET /invoices):**
- `status` (optional): Filter by payment status (PENDING, PAID, OVERDUE, CANCELLED)
- `month` (optional): Filter by month
- `year` (optional): Filter by year

**Invoice Model:**
```typescript
{
  id: string;
  residentId: string;
  invoiceNumber: string;
  month: number;
  year: number;
  roomPrice: number;
  utilityCost: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidDate?: string;
  notes?: string;
  resident: {
    id: string;
    user: { name: string; username: string };
    room: { roomNumber: string };
  };
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all invoices
GET http://localhost:3000/api/invoices
Authorization: Bearer <token>

# Get pending invoices
GET http://localhost:3000/api/invoices?status=PENDING
Authorization: Bearer <token>

# Get invoice by ID
GET http://localhost:3000/api/invoices/{invoice-id}
Authorization: Bearer <token>

# Get invoices by resident
GET http://localhost:3000/api/invoices/resident/{resident-id}
Authorization: Bearer <token>

# Generate invoice
POST http://localhost:3000/api/invoices/generate/{resident-id}
Authorization: Bearer <token>

# Update payment status
PATCH http://localhost:3000/api/invoices/{invoice-id}/payment
Authorization: Bearer <token>
Content-Type: application/json
{
  "paymentStatus": "PAID",
  "paidDate": "2026-01-10"
}
```

---

## 7️⃣ Laundry Management

### Laundry Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/laundry` | ⚠️ Verify | Laundry list | MEDIUM |
| GET | `/api/laundry/resident/:residentId` | ⚠️ Verify | Laundry by resident | MEDIUM |
| POST | `/api/laundry` | ⚠️ Verify | Create laundry order | MEDIUM |
| PATCH | `/api/laundry/:id/status` | ⚠️ Verify | Update laundry status | MEDIUM |
| PATCH | `/api/laundry/:id/payment` | ⚠️ Verify | Update payment status | MEDIUM |

**Files:** `lib/api/services/laundry.ts`, `lib/hooks/useLaundry.ts`

**Query Parameters (GET /laundry):**
- `status` (optional): Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `paymentStatus` (optional): Filter by payment (UNPAID, PAID)

**Laundry Model:**
```typescript
{
  id: string;
  residentId: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID';
  orderDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all laundry orders
GET http://localhost:3000/api/laundry
Authorization: Bearer <token>

# Get laundry by resident
GET http://localhost:3000/api/laundry/resident/{resident-id}
Authorization: Bearer <token>

# Create laundry order
POST http://localhost:3000/api/laundry
Authorization: Bearer <token>
Content-Type: application/json
{
  "residentId": "resident-id",
  "weight": 5,
  "pricePerKg": 5000,
  "notes": "Cuci + Setrika"
}

# Update status
PATCH http://localhost:3000/api/laundry/{laundry-id}/status
Authorization: Bearer <token>
Content-Type: application/json
{
  "status": "COMPLETED"
}

# Update payment
PATCH http://localhost:3000/api/laundry/{laundry-id}/payment
Authorization: Bearer <token>
Content-Type: application/json
{
  "paymentStatus": "PAID"
}
```

---

## 8️⃣ Complaint Management

### Complaint Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/complaints` | ⚠️ Verify | Complaint list | MEDIUM |
| GET | `/api/complaints/:id` | ⚠️ Verify | Complaint detail | MEDIUM |
| POST | `/api/complaints` | ⚠️ Verify | Create complaint | MEDIUM |
| PATCH | `/api/complaints/:id/status` | ⚠️ Verify | Update complaint status | MEDIUM |

**Files:** `lib/api/services/complaints.ts`, `lib/hooks/useComplaints.ts`

**Query Parameters (GET /complaints):**
- `status` (optional): Filter by status (PENDING, IN_PROGRESS, RESOLVED, REJECTED)

**Complaint Model:**
```typescript
{
  id: string;
  residentId: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  response?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all complaints
GET http://localhost:3000/api/complaints
Authorization: Bearer <token>

# Get pending complaints
GET http://localhost:3000/api/complaints?status=PENDING
Authorization: Bearer <token>

# Get complaint by ID
GET http://localhost:3000/api/complaints/{complaint-id}
Authorization: Bearer <token>

# Create complaint
POST http://localhost:3000/api/complaints
Authorization: Bearer <token>
Content-Type: application/json
{
  "residentId": "resident-id",
  "title": "AC Tidak Dingin",
  "description": "AC di kamar tidak dingin sejak 2 hari yang lalu",
  "category": "Maintenance",
  "priority": "HIGH"
}

# Update status
PATCH http://localhost:3000/api/complaints/{complaint-id}/status
Authorization: Bearer <token>
Content-Type: application/json
{
  "status": "RESOLVED",
  "response": "AC sudah diperbaiki"
}
```

---

## 9️⃣ Fridge Management

### Fridge Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/fridge` | ⚠️ Verify | Fridge items list | LOW |
| POST | `/api/fridge` | ⚠️ Verify | Add fridge item | LOW |
| PATCH | `/api/fridge/:id` | ⚠️ Verify | Update fridge item | LOW |
| DELETE | `/api/fridge/:id` | ⚠️ Verify | Delete fridge item | LOW |

**Files:** `lib/api/services/fridge.ts`, `lib/hooks/useFridge.ts`

**Fridge Item Model:**
```typescript
{
  id: string;
  ownerId: string;
  itemName: string;
  quantity: number;
  dateIn: string;
  notes?: string;
  resident: {
    user: { name: string };
  };
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all fridge items
GET http://localhost:3000/api/fridge
Authorization: Bearer <token>

# Add fridge item
POST http://localhost:3000/api/fridge
Authorization: Bearer <token>
Content-Type: application/json
{
  "ownerId": "resident-id",
  "itemName": "Susu",
  "quantity": 2,
  "notes": "Expired 15 Jan"
}

# Update fridge item
PATCH http://localhost:3000/api/fridge/{item-id}
Authorization: Bearer <token>
Content-Type: application/json
{
  "quantity": 1
}

# Delete fridge item
DELETE http://localhost:3000/api/fridge/{item-id}
Authorization: Bearer <token>
```

---

## 🔟 Expense Management

### Expense Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/expenses` | ⚠️ Verify | Expense list | MEDIUM |
| GET | `/api/expenses/:id` | ⚠️ Verify | Expense detail | MEDIUM |
| POST | `/api/expenses` | ⚠️ Verify | Create expense | MEDIUM |
| PATCH | `/api/expenses/:id` | ⚠️ Verify | Update expense | MEDIUM |
| DELETE | `/api/expenses/:id` | ⚠️ Verify | Delete expense | MEDIUM |

**Files:** `lib/api/services/expenses.ts`, `lib/hooks/useExpenses.ts`

**Query Parameters (GET /expenses):**
- `category` (optional): Filter by category
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Expense Model:**
```typescript
{
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Test Commands:**
```bash
# Get all expenses
GET http://localhost:3000/api/expenses
Authorization: Bearer <token>

# Get expenses by date range
GET http://localhost:3000/api/expenses?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>

# Get expense by ID
GET http://localhost:3000/api/expenses/{expense-id}
Authorization: Bearer <token>

# Create expense
POST http://localhost:3000/api/expenses
Authorization: Bearer <token>
Content-Type: application/json
{
  "category": "Maintenance",
  "description": "Perbaikan AC",
  "amount": 500000,
  "date": "2026-01-10",
  "notes": "AC kamar 101"
}

# Update expense
PATCH http://localhost:3000/api/expenses/{expense-id}
Authorization: Bearer <token>
Content-Type: application/json
{
  "amount": 550000
}

# Delete expense
DELETE http://localhost:3000/api/expenses/{expense-id}
Authorization: Bearer <token>
```

---

## 1️⃣1️⃣ Reports

### Report Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/reports/financial` | ⚠️ Verify | Financial report | MEDIUM |

**Files:** `lib/api/services/reports.ts`, `lib/hooks/useReports.ts`

**Query Parameters (GET /reports/financial):**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Financial Report Model:**
```typescript
{
  period: {
    startDate: string;
    endDate: string;
  };
  income: {
    roomRental: number;
    utilities: number;
    laundry: number;
    total: number;
  };
  expenses: {
    maintenance: number;
    utilities: number;
    other: number;
    total: number;
  };
  netIncome: number;
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
}
```

**Test Commands:**
```bash
# Get financial report
GET http://localhost:3000/api/reports/financial?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

---

## 1️⃣2️⃣ Notifications (Already Complete ✅)

### Notification Endpoints
| Method | Endpoint | Status | Used By | Priority |
|--------|----------|--------|---------|----------|
| GET | `/api/notifications/preferences` | ✅ Complete | Settings page | HIGH |
| PATCH | `/api/notifications/preferences` | ✅ Complete | Settings page | HIGH |
| POST | `/api/notifications/fcm-token` | ✅ Complete | FCM registration | HIGH |
| POST | `/api/notifications/fcm-token/remove` | ✅ Complete | FCM removal | MEDIUM |
| GET | `/api/notifications/history` | ✅ Complete | Notification page | HIGH |
| GET | `/api/notifications/history/unread-count` | ✅ Complete | Badge count | HIGH |
| PATCH | `/api/notifications/history/:id/read` | ✅ Complete | Mark as read | HIGH |
| PATCH | `/api/notifications/history/read-all` | ✅ Complete | Mark all as read | MEDIUM |
| DELETE | `/api/notifications/history/:id` | ✅ Complete | Delete notification | MEDIUM |
| POST | `/api/notifications/test/push` | ✅ Complete | Testing | LOW |
| POST | `/api/notifications/test/whatsapp` | ✅ Complete | Testing | LOW |

**Files:** `lib/api/services/notification.ts`, `lib/api/services/notification-history.ts`

**Status:** ✅ All notification endpoints already verified and working!

---

## 📊 Summary

### By Priority

**CRITICAL (Must Have):**
- ✅ Auth: login, refresh, logout

**HIGH Priority:**
- ⚠️ Rooms: CRUD operations
- ⚠️ Residents: CRUD + move-out
- ⚠️ Utilities: CRUD by resident
- ⚠️ Invoices: CRUD + generate + payment
- ✅ Notifications: All endpoints

**MEDIUM Priority:**
- ⚠️ Users: Read operations
- ⚠️ Laundry: CRUD + status/payment
- ⚠️ Complaints: CRUD + status
- ⚠️ Expenses: CRUD
- ⚠️ Reports: Financial report

**LOW Priority:**
- ⚠️ Fridge: CRUD operations

### Total Endpoints Count

| Category | Total | Complete | Verify Needed |
|----------|-------|----------|---------------|
| Auth | 3 | 0 | 3 |
| Users | 2 | 0 | 2 |
| Rooms | 5 | 0 | 5 |
| Residents | 5 | 0 | 5 |
| Utilities | 4 | 0 | 4 |
| Invoices | 5 | 0 | 5 |
| Laundry | 5 | 0 | 5 |
| Complaints | 4 | 0 | 4 |
| Fridge | 4 | 0 | 4 |
| Expenses | 5 | 0 | 5 |
| Reports | 1 | 0 | 1 |
| Notifications | 11 | 11 | 0 |
| **TOTAL** | **54** | **11** | **43** |

---

## ✅ Verification Steps

### Step 1: Test Auth Endpoints (CRITICAL)
```bash
# Must work first before testing others
1. POST /api/auth/login
2. POST /api/auth/refresh
3. POST /api/auth/logout
```

### Step 2: Test Core Features (HIGH)
```bash
# Test in this order
1. GET /api/rooms
2. GET /api/residents
3. GET /api/utilities/resident/:id
4. GET /api/invoices
5. POST /api/invoices/generate/:residentId
```

### Step 3: Test Secondary Features (MEDIUM)
```bash
1. GET /api/laundry
2. GET /api/complaints
3. GET /api/expenses
4. GET /api/reports/financial
```

### Step 4: Test Optional Features (LOW)
```bash
1. GET /api/fridge
```

---

## 🎯 Recommendation

**Prioritas Testing:**
1. ✅ **Notifications** - Already complete
2. ⚠️ **Auth** - Test immediately (CRITICAL)
3. ⚠️ **Rooms & Residents** - Core features (HIGH)
4. ⚠️ **Invoices & Utilities** - Core features (HIGH)
5. ⚠️ **Laundry, Complaints, Expenses** - Secondary (MEDIUM)
6. ⚠️ **Fridge** - Optional (LOW)

**Kemungkinan Status:**
- Auth, Rooms, Residents, Utilities, Invoices → Kemungkinan besar sudah ada (core features)
- Laundry, Complaints, Expenses, Reports → Perlu verifikasi
- Fridge → Mungkin belum ada (optional feature)

---

**Last Updated:** 10 Januari 2026  
**Version:** 1.0
