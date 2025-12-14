import { useWalletBalance } from '@/hooks/useWallet';
import { formatCurrency } from '@/lib/utils';
import type { AxiosError } from "axios";

export function BalanceCard() {
  const { data: balance, isLoading, error } = useWalletBalance();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 h-48 rounded-xl" />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Failed to load balance</h3>
            <p className="text-sm text-red-600 mt-1">
              {(error as AxiosError<{ message: string }>)?.response?.data?.message || 'Please try refreshing the page'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm opacity-90 mb-1">Total Balance</p>
          <h2 className="text-5xl font-bold tracking-tight">
            {formatCurrency(balance?.balance || 0)}
          </h2>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div>
          <p className="text-xs opacity-75">Wallet Number</p>
          <p className="text-sm font-mono font-medium">{balance?.walletNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75">Created</p>
          <p className="text-sm font-medium">
            {balance?.createdAt ? new Date(balance.createdAt).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
