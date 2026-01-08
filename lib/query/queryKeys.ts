/**
 * Query Keys
 * Centralized query key definitions for Tanstack Query
 */

export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
  rooms: {
    all: ['rooms'] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  residents: {
    all: (params?: { isActive?: boolean }) => ['residents', params] as const,
    detail: (id: string) => ['residents', id] as const,
  },
  utilities: {
    byResident: (
      residentId: string,
      params?: { utilityType?: string; isBilled?: boolean }
    ) => ['utilities', 'resident', residentId, params] as const,
  },
  invoices: {
    all: (params?: { paymentStatus?: string }) => ['invoices', params] as const,
    byResident: (residentId: string, params?: { paymentStatus?: string }) =>
      ['invoices', 'resident', residentId, params] as const,
    detail: (id: string) => ['invoices', id] as const,
  },
  laundry: {
    all: (params?: { status?: string; paymentStatus?: string }) =>
      ['laundry', params] as const,
    byResident: (residentId: string) =>
      ['laundry', 'resident', residentId] as const,
  },
  complaints: {
    all: (params?: { status?: string }) => ['complaints', params] as const,
    detail: (id: string) => ['complaints', id] as const,
  },
  fridge: {
    all: ['fridge'] as const,
  },
  expenses: {
    all: (params?: {
      category?: string;
      startDate?: string;
      endDate?: string;
    }) => ['expenses', params] as const,
    detail: (id: string) => ['expenses', id] as const,
  },
  reports: {
    financial: (startDate: string, endDate: string) =>
      ['reports', 'financial', startDate, endDate] as const,
  },
};
