import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { TransferRequest, TransferResponse } from '@/types';

export function useTransfer() {
  return useMutation({
    mutationFn: async (data: TransferRequest) => {
      const response = await api.post<TransferResponse>('/wallet/transfer', data);
      return response.data;
    },
  });
}
