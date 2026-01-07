/**
 * Query keys for Tanstack Query
 * Organized by entity for better cache management
 */

export const queryKeys = {
  // Authentication
  auth: {
    user: ['auth', 'user'] as const,
  },

  // Rooms
  rooms: {
    all: ['rooms'] as const,
    lists: () => [...queryKeys.rooms.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.rooms.lists(), filters] as const,
    details: () => [...queryKeys.rooms.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.rooms.details(), id] as const,
  },

  // Residents
  residents: {
    all: ['residents'] as const,
    lists: () => [...queryKeys.residents.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.residents.lists(), filters] as const,
    details: () => [...queryKeys.residents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.residents.details(), id] as const,
  },

  // Utilities
  utilities: {
    all: ['utilities'] as const,
    lists: () => [...queryKeys.utilities.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.utilities.lists(), filters] as const,
    details: () => [...queryKeys.utilities.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.utilities.details(), id] as const,
    byResident: (residentId: string) =>
      [...queryKeys.utilities.all, 'resident', residentId] as const,
  },

  // Invoices
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.invoices.lists(), filters] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
  },

  // Laundry
  laundry: {
    all: ['laundry'] as const,
    lists: () => [...queryKeys.laundry.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.laundry.lists(), filters] as const,
    details: () => [...queryKeys.laundry.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.laundry.details(), id] as const,
  },

  // Complaints
  complaints: {
    all: ['complaints'] as const,
    lists: () => [...queryKeys.complaints.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.complaints.lists(), filters] as const,
    details: () => [...queryKeys.complaints.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.complaints.details(), id] as const,
  },

  // Fridge
  fridge: {
    all: ['fridge'] as const,
    items: () => [...queryKeys.fridge.all, 'items'] as const,
  },

  // Expenses
  expenses: {
    all: ['expenses'] as const,
    lists: () => [...queryKeys.expenses.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.expenses.lists(), filters] as const,
    details: () => [...queryKeys.expenses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.expenses.details(), id] as const,
    summary: () => [...queryKeys.expenses.all, 'summary'] as const,
  },

  // Reports
  reports: {
    all: ['reports'] as const,
    financial: (dateRange?: { start: string; end: string }) =>
      [...queryKeys.reports.all, 'financial', dateRange] as const,
  },
} as const;
