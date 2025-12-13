import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateApiKey } from '@/hooks/useApiKeys';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const PERMISSIONS = [
  {
    value: 'read',
    label: 'Read',
    description: 'View balance and transaction history',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    value: 'deposit',
    label: 'Deposit',
    description: 'Initiate deposit transactions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    value: 'transfer',
    label: 'Transfer',
    description: 'Send money to other wallets',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
];

const DURATIONS = [
  { value: '1H', label: '1 Hour', description: 'Short-lived key for testing' },
  { value: '1D', label: '1 Day', description: 'Daily rotation' },
  { value: '1M', label: '1 Month', description: 'Monthly rotation (recommended)' },
  { value: '1Y', label: '1 Year', description: 'Long-term access' },
];

const createKeySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name too long'),
  expiryDuration: z.string(),
});

type CreateKeyFormData = z.infer<typeof createKeySchema>;

interface CreateKeyFormProps {
  onSuccess: (apiKey: string) => void;
}

export function CreateKeyForm({ onSuccess }: CreateKeyFormProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['read']);
  const createKey = useCreateApiKey();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateKeyFormData>({
    resolver: zodResolver(createKeySchema),
    defaultValues: {
      name: '',
      expiryDuration: '1M',
    },
  });

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      // Always keep at least one permission
      if (prev.includes(permission) && prev.length === 1) {
        toast.error('At least one permission is required');
        return prev;
      }

      return prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission];
    });
  };

  const onSubmit = async (data: CreateKeyFormData) => {
    if (selectedPermissions.length === 0) {
      toast.error('Select at least one permission');
      return;
    }

    try {
      const result = await createKey.mutateAsync({
        name: data.name,
        permissions: selectedPermissions,
        expiryDuration: data.expiryDuration,
      });

      reset();
      setSelectedPermissions(['read']);
      onSuccess(result.apiKey);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create API key');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Key Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Key Name
        </label>
        <Input
          id="name"
          placeholder="e.g., Production Server, Mobile App"
          {...register('name')}
          error={errors.name?.message}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Choose a descriptive name to identify where this key is used
        </p>
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Permissions
        </label>
        <div className="space-y-2">
          {PERMISSIONS.map((perm) => {
            const isSelected = selectedPermissions.includes(perm.value);
            return (
              <button
                key={perm.value}
                type="button"
                onClick={() => togglePermission(perm.value)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`}>
                    {perm.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {perm.label}
                      </h4>
                      {isSelected && (
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-primary-700' : 'text-gray-600'}`}>
                      {perm.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Expiry Duration */}
      <div>
        <label htmlFor="expiryDuration" className="block text-sm font-medium text-gray-700 mb-2">
          Expiry Duration
        </label>
        <div className="grid grid-cols-2 gap-3">
          {DURATIONS.map((duration) => (
            <label
              key={duration.value}
              className="relative flex cursor-pointer"
            >
              <input
                type="radio"
                value={duration.value}
                {...register('expiryDuration')}
                className="sr-only peer"
              />
              <div className="w-full p-4 border-2 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {duration.label}
                  </span>
                  <svg className="w-5 h-5 text-primary-600 hidden peer-checked:block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">{duration.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-900">Security Best Practices</h4>
            <ul className="mt-2 text-sm text-amber-700 space-y-1">
              <li>• Only grant the minimum permissions needed</li>
              <li>• Store API keys securely (never in source code)</li>
              <li>• Rotate keys regularly for better security</li>
              <li>• You'll only see the key once - save it immediately</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        isLoading={createKey.isPending}
        className="w-full h-12 text-base"
      >
        {createKey.isPending ? 'Creating API Key...' : 'Create API Key'}
      </Button>
    </form>
  );
}
