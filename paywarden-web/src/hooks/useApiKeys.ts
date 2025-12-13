import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse } from '@/types';

export function useApiKeys() {
  return useQuery<ApiKey[]>({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const response = await api.get('/keys');
      return response.data;
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApiKeyRequest) => {
      const response = await api.post<CreateApiKeyResponse>('/keys/create', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}

export function useRolloverApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      oldKeyId,
      expiryDuration,
    }: {
      oldKeyId: string;
      expiryDuration: string;
    }) => {
      const response = await api.post<CreateApiKeyResponse>('/keys/rollover', {
        oldKeyId,
        expiryDuration,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}
