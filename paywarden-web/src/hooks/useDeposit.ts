import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DepositResponse, DepositStatus } from '@/types';

export function useInitiateDeposit() {
  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await api.post<DepositResponse>('/wallet/deposit', {
        amount,
      });
      return response.data;
    },
  });
}

export function useDepositStatus(reference: string | null) {
  return useQuery<DepositStatus>({
    queryKey: ['deposit', 'status', reference],
    queryFn: async () => {
      if (!reference) throw new Error('No reference provided');
      const response = await api.get(`/wallet/deposit/${reference}/status`);
      return response.data;
    },
    enabled: !!reference,
    refetchInterval: (query) => {
      // Stop polling when status is no longer pending
      return query.state.data?.status === 'Pending' ? 3000 : false;
    },
    staleTime: 0, // Always refetch to get latest status
  });
}
