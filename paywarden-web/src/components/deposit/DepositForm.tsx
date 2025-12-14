import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInitiateDeposit } from '@/hooks/useDeposit';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import type { AxiosError } from "axios";

const depositSchema = z.object({
  amount: z
    .number()
    .min(100, 'Minimum deposit is ₦100')
    .max(10000000, 'Maximum deposit is ₦10,000,000'),
});

type DepositFormData = z.infer<typeof depositSchema>;

export function DepositForm() {
  const initiate = useInitiateDeposit();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = watch('amount');

  const onSubmit = async (data: DepositFormData) => {
    try {
      const result = await initiate.mutateAsync(data.amount);

      // Redirect to Paystack
      window.location.href = result.authorizationUrl;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || 'Failed to initiate deposit'
      );
    }
  };

  // Predefined amounts for quick selection
  const quickAmounts = [1000, 5000, 10000, 50000];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Amount Input */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Amount (NGN)
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setValue('amount', amt, { shouldValidate: true })}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all border-2 ${
                amount === amt
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              ₦{amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900">
              Secure Payment
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              You'll be redirected to Paystack to complete your payment
              securely. Your wallet will be credited automatically once payment
              is confirmed.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        isLoading={initiate.isPending}
        disabled={!amount || amount < 100}
        className="w-full h-12 text-base"
      >
        {initiate.isPending ? 'Processing...' : 'Continue to Payment'}
      </Button>

      {/* Payment Methods Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">Powered by Paystack</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs text-gray-400">Card</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">Bank Transfer</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">USSD</span>
        </div>
      </div>
    </form>
  );
}
