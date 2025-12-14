import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransfer } from '@/hooks/useTransfer';
import { useWalletBalance } from '@/hooks/useWallet';
import { useResolveWallet } from '@/hooks/useResolveWallet';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const transferSchema = z.object({
  recipientWalletNumber: z
    .string()
    .min(10, 'Wallet number must be at least 10 characters')
    .regex(/^[0-9]+$/, 'Wallet number must contain only digits'),
  amount: z
    .number()
    .min(1, 'Amount must be greater than 0')
    .max(10000000, 'Maximum transfer is ₦10,000,000'),
  description: z.string().optional(),
  recipientAccountName: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

export function TransferForm() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState<TransferFormData | null>(null);

  const transfer = useTransfer();
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientWalletNumber: '',
      amount: 0,
      description: '',
    },
  });

  const amount = watch('amount');
  const recipientWalletNumber = watch('recipientWalletNumber');

  const insufficientBalance = amount > (balance?.balance || 0);
  const isSameWallet = recipientWalletNumber === balance?.walletNumber;

  // Quick amount suggestions based on balance
  const quickAmounts = [1000, 5000, 10000, 50000].filter(
    amt => amt <= (balance?.balance || 0)
  );

  const {
    data: resolvedWallet,
    isLoading: resolvingWallet,
    isError: resolveError,
    error: resolveErrorData,
  } = useResolveWallet(recipientWalletNumber);

  const onSubmit = (data: TransferFormData) => {
    if (insufficientBalance) {
      toast.error('Insufficient balance');
      return;
    }
    if (isSameWallet) {
      toast.error("You can't transfer to your own wallet");
      return;
    }
    setFormData({
      ...data,
      recipientAccountName: resolvedWallet?.accountName,
    });
    setShowConfirm(true);
  };

  const confirmTransfer = async () => {
    if (!formData) return;

    try {
      await transfer.mutateAsync(formData);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });

      toast.success('Transfer successful!');

      // Reset form and navigate
      reset();
      setShowConfirm(false);
      setFormData(null);

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Transfer failed';
      toast.error(errorMessage);
      setShowConfirm(false);
    }
  };

  // Confirmation view
  if (showConfirm && formData) {
    return (
      <div className="space-y-6">
        {/* Confirmation Header */}
        <div className="text-center pb-4 border-b">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirm Transfer</h3>
          <p className="text-sm text-gray-600 mt-1">
            Please review the details before confirming
          </p>
        </div>

        {/* Transfer Details */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Recipient Name</span>
            <span className="font-semibold text-gray-900">
              {formData.recipientAccountName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Recipient Wallet</span>
            <span className="font-mono font-semibold text-gray-900">
              {formData.recipientWalletNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(formData.amount)}
            </span>
          </div>

          {formData.description && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Description</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">
                {formData.description}
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Your Current Balance</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(balance?.balance || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-semibold text-gray-900">
                New Balance
              </span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency((balance?.balance || 0) - formData.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900">
                Important Notice
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                This action cannot be undone. Please ensure the recipient wallet
                number is correct before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirm(false);
              setFormData(null);
            }}
            disabled={transfer.isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmTransfer}
            isLoading={transfer.isPending}
            className="flex-1"
          >
            {transfer.isPending ? 'Processing...' : 'Confirm Transfer'}
          </Button>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Balance Display */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
        <p className="text-sm text-primary-700 mb-1">Available Balance</p>
        <div className="flex items-baseline gap-2">
          {balanceLoading ? (
            <div className="h-8 w-32 bg-primary-200 animate-pulse rounded" />
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-900">
                {formatCurrency(balance?.balance || 0)}
              </p>
              <p className="text-sm text-primary-600">
                ({balance?.walletNumber})
              </p>
            </>
          )}
        </div>
      </div>

      {/* Recipient Wallet Number */}
      <div>
        <label
          htmlFor="recipientWalletNumber"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Recipient Wallet Number
        </label>
        <Input
          id="recipientWalletNumber"
          type="text"
          placeholder="Enter recipient's wallet number"
          {...register('recipientWalletNumber')}
          error={errors.recipientWalletNumber?.message}
        />
        {errors.recipientWalletNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recipientWalletNumber.message}
          </p>
        )}
        {isSameWallet && recipientWalletNumber && (
          <p className="mt-1 text-sm text-red-600">
            You cannot transfer to your own wallet
          </p>
        )}
      </div>
      {resolvingWallet && (
                <p className="mt-1 text-sm text-gray-500">Resolving account…</p>
              )}

              {resolvedWallet?.accountName && (
                <p className="mt-1 text-sm font-medium text-green-600">
                  {resolvedWallet.accountName}
                </p>
              )}

              {resolveError && recipientWalletNumber?.length >= 10 && (
                <p className="mt-1 text-sm text-red-600">
                  Wallet number not found
                </p>
              )}

      {/* Amount */}
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
        {insufficientBalance && amount > 0 && (
          <p className="mt-1 text-sm text-red-600">
            Insufficient balance. You need {formatCurrency(amount - (balance?.balance || 0))} more.
          </p>
        )}

        {/* Quick Amount Selection */}
        {quickAmounts.length > 0 && (
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setValue('amount', amt, { shouldValidate: true })}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                    amount === amt
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          placeholder="What's this transfer for?"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
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
              Instant Transfer
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Transfers are processed instantly. Make sure the recipient wallet
              number is correct as transfers cannot be reversed.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={insufficientBalance || isSameWallet || !amount || amount <= 0}
        className="w-full h-12 text-base"
      >
        Review Transfer
      </Button>
    </form>
  );
}
