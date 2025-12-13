import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface ResolveWalletResponse {
  walletNumber: string;
  accountName: string;
}

export function useResolveWallet(walletNumber: string | undefined) {
  return useQuery<ResolveWalletResponse>({
    queryKey: ['wallet', 'resolve', walletNumber],
    queryFn: async () => {
      if (!walletNumber || walletNumber.length < 10) {
        throw new Error('Invalid wallet number');
      }

      const { data } = await api.get<ResolveWalletResponse>(
        `/Wallet/resolve/${walletNumber}`
      );
      return data;
    },
    enabled: !!walletNumber && walletNumber.length >= 10,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
