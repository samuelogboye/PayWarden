import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { WalletBalance, TransactionList } from '@/types';

export function useWalletBalance() {
  return useQuery<WalletBalance>({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      const response = await api.get('/wallet/balance');
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

export function useTransactions(pageNumber = 1, pageSize = 20) {
  return useQuery<TransactionList>({
    queryKey: ['wallet', 'transactions', pageNumber, pageSize],
    queryFn: async () => {
      const response = await api.get('/wallet/transactions', {
        params: { pageNumber, pageSize },
      });
      return response.data;
    },
    staleTime: 10000, // 10 seconds
  });
}
