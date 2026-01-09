/**
 * API Response Types
 * TypeScript interfaces for API responses
 */

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * User Role Enum
 */
export enum UserRole {
  OWNER = 'OWNER',
  PENJAGA = 'PENJAGA',
  PENGHUNI = 'PENGHUNI',
}

/**
 * User Type
 */
export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Room Status Enum
 */
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

/**
 * Room Type
 */
export interface Room {
  id: string;
  roomNumber: string;
  floor?: number;
  rentalPrice: number;
  facilities: Record<string, unknown>;
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resident Type
 */
export interface Resident {
  id: string;
  userId: string;
  roomId: string;
  billingCycleDate: number;
  entryDate: string;
  exitDate?: string;
  isActive: boolean;
  user: User;
  room: Room;
  createdAt: string;
  updatedAt: string;
}

/**
 * Utility Type Enum
 */
export enum UtilityType {
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
}

/**
 * Utility Record Type
 */
export interface UtilityRecord {
  id: string;
  residentId: string;
  utilityType: UtilityType;
  previousMeter: number;
  currentMeter: number;
  usage: number;
  ratePerUnit: number;
  totalCost: number;
  readingDate: string;
  isBilled: boolean;
  resident: Resident;
  createdAt: string;
  updatedAt: string;
}

/**
 * Invoice Status Enum
 */
export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
}

/**
 * Invoice Type
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  residentId: string;
  rentAmount: number;
  utilityAmount: number;
  totalAmount: number;
  paymentStatus: InvoiceStatus;
  billingDate: string;
  dueDate: string;
  paidDate?: string;
  resident: Resident;
  utilityRecords: UtilityRecord[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Laundry Status Enum
 */
export enum LaundryStatus {
  PENDING = 'PENDING',
  ON_PROCESS = 'ON_PROCESS',
  READY_TO_PICKUP = 'READY_TO_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Laundry Payment Status Enum
 */
export enum LaundryPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

/**
 * Laundry Transaction Type
 */
export interface LaundryTransaction {
  id: string;
  residentId: string;
  serviceType: string;
  weight: number;
  price: number;
  status: LaundryStatus;
  paymentStatus: LaundryPaymentStatus;
  orderDate: string;
  completedDate?: string;
  resident: Resident;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complaint Status Enum
 */
export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Complaint Type
 */
export interface Complaint {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  photos: string[];
  status: ComplaintStatus;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fridge Item Type
 */
export interface FridgeItem {
  id: string;
  ownerId: string;
  itemName: string;
  quantity: number;
  dateIn: string;
  resident: Resident;
  createdAt: string;
  updatedAt: string;
}

/**
 * Expense Category Enum
 */
export enum ExpenseCategory {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  TRASH_FEE = 'TRASH_FEE',
  SUPPLIES = 'SUPPLIES',
  OTHER = 'OTHER',
}

/**
 * Expense Type
 */
export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Financial Report Type
 */
export interface FinancialReport {
  period: {
    startDate: string;
    endDate: string;
  };
  rentRevenue: number;
  laundryRevenue: number;
  totalExpenses: number;
  netProfit: number;
  breakdown: {
    paidInvoices: number;
    paidLaundryTransactions: number;
    expenseRecords: number;
  };
}
