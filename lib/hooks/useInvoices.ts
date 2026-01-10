/**
 * Invoices Hooks
 * Custom hooks for invoice data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  invoicesApi,
  InvoiceQueryParams,
  UpdatePaymentStatusDto,
} from '../api/services/invoices';
import { queryKeys } from '../query/queryKeys';
import { Invoice, InvoiceStatus } from '../api/types';

/**
 * Hook to fetch all invoices
 */
export function useInvoices(params?: InvoiceQueryParams & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params || {};
  return useQuery({
    queryKey: queryKeys.invoices.all(queryParams),
    queryFn: () => invoicesApi.getAll(queryParams),
    enabled: enabled !== false,
  });
}

/**
 * Hook to fetch invoices by resident
 */
export function useInvoicesByResident(
  residentId: string,
  params?: InvoiceQueryParams
) {
  return useQuery({
    queryKey: queryKeys.invoices.byResident(residentId, params),
    queryFn: () => invoicesApi.getByResident(residentId, params),
    enabled: !!residentId,
  });
}

/**
 * Hook to fetch invoice by ID
 */
export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => invoicesApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to generate invoice
 */
export function useGenerateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (residentId: string) => invoicesApi.generate(residentId),
    onSuccess: () => {
      // Invalidate all invoice queries
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      // Also invalidate utilities as they get marked as billed
      queryClient.invalidateQueries({ queryKey: ['utilities'] });
    },
  });
}

/**
 * Hook to update payment status
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentStatusDto }) =>
      invoicesApi.updatePayment(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['invoices'] });
      await queryClient.cancelQueries({
        queryKey: queryKeys.invoices.detail(id),
      });

      // Snapshot previous values
      const previousInvoices = queryClient.getQueryData<Invoice[]>(
        queryKeys.invoices.all()
      );
      const previousInvoice = queryClient.getQueryData<Invoice>(
        queryKeys.invoices.detail(id)
      );

      // Optimistically update invoice list
      if (previousInvoices) {
        queryClient.setQueryData<Invoice[]>(queryKeys.invoices.all(), (old) =>
          (old || []).map((invoice) =>
            invoice.id === id
              ? {
                  ...invoice,
                  paymentStatus: data.paymentStatus as InvoiceStatus,
                  paidDate:
                    data.paymentStatus === 'PAID'
                      ? new Date().toISOString()
                      : invoice.paidDate,
                }
              : invoice
          )
        );
      }

      // Optimistically update invoice detail
      if (previousInvoice) {
        queryClient.setQueryData<Invoice>(queryKeys.invoices.detail(id), {
          ...previousInvoice,
          paymentStatus: data.paymentStatus as InvoiceStatus,
          paidDate:
            data.paymentStatus === 'PAID'
              ? new Date().toISOString()
              : previousInvoice.paidDate,
        });
      }

      return { previousInvoices, previousInvoice };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousInvoices) {
        queryClient.setQueryData(
          queryKeys.invoices.all(),
          context.previousInvoices
        );
      }
      if (context?.previousInvoice) {
        queryClient.setQueryData(
          queryKeys.invoices.detail(id),
          context.previousInvoice
        );
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(id),
      });
    },
  });
}
