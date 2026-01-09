/**
 * Reports API Service
 * Handles financial reporting operations
 */

import apiClient from '../client';

export interface FinancialReportParams {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}

export interface ExpensesByCategory {
  MAINTENANCE: number;
  UTILITIES: number;
  TRASH_FEE: number;
  SUPPLIES: number;
  OTHER: number;
}

export interface FinancialReport {
  period: {
    startDate: string;
    endDate: string;
  };
  rentRevenue: number;
  laundryRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  breakdown: {
    paidInvoices: number;
    paidLaundryTransactions: number;
    expenseRecords: number;
  };
  expensesByCategory: ExpensesByCategory;
}

export const reportsApi = {
  /**
   * Get financial report for a date range
   * @param params - Date range parameters
   * @returns Financial report data
   */
  getFinancial: async (params: FinancialReportParams): Promise<FinancialReport> => {
    const response = await apiClient.get<FinancialReport>('/reports/financial', {
      params,
    });
    return response.data;
  },
};
