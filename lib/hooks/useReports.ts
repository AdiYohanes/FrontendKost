/**
 * Reports Hooks
 * Custom hooks for financial report data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { reportsApi, FinancialReportParams } from '../api/services/reports';
import { queryKeys } from '../query/queryKeys';

/**
 * Hook to fetch financial report
 * @param params - Date range parameters (startDate and endDate)
 */
export function useFinancialReport(params: FinancialReportParams) {
  return useQuery({
    queryKey: queryKeys.reports.financial(params.startDate, params.endDate),
    queryFn: () => reportsApi.getFinancial(params),
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 1000 * 60 * 5, // 5 minutes - financial data doesn't change frequently
  });
}
