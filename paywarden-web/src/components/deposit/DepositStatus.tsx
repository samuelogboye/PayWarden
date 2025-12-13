import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDepositStatus } from '@/hooks/useDeposit';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export function DepositStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const reference = searchParams.get('reference');

  const { data, isLoading, error } = useDepositStatus(reference);

  useEffect(() => {
    if (data?.status === 'Success') {
      // Invalidate wallet balance to fetch updated balance
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });

      // Redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data?.status, navigate, queryClient]);

  if (!reference) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Reference Found
        </h3>
        <p className="text-gray-600 mb-6">
          No transaction reference was provided
        </p>
        <Button onClick={() => navigate('/deposit')}>Try Again</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verifying Payment...
        </h3>
        <p className="text-gray-600">Please wait while we confirm your payment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verification Failed
        </h3>
        <p className="text-gray-600 mb-6">
          Unable to verify your payment status
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (data?.status === 'Success') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Deposit Successful!
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          {formatCurrency(data.amount)} has been added to your wallet
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono font-medium text-gray-900">
                {data.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">Completed</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Redirecting to dashboard in a moment...
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard Now
        </Button>
      </div>
    );
  }

  // Failed state
  if (data?.status === 'Failed') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Deposit Failed
        </h2>
        <p className="text-gray-600 mb-4">Your payment could not be processed</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-mono font-medium text-gray-900">
                {data.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-red-600">Failed</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate('/deposit')}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Pending state
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Payment Pending
      </h2>
      <p className="text-gray-600 mb-4">
        Waiting for payment confirmation from Paystack...
      </p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Reference:</span>
            <span className="font-mono font-medium text-gray-900">
              {data?.reference}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(data?.amount || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium text-yellow-600">Pending</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        This page will automatically update when payment is confirmed
      </p>
    </div>
  );
}
