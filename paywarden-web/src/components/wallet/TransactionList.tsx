import { useState } from 'react';
import { useTransactions } from '@/hooks/useWallet';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types';

export function TransactionList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTransactions(page, 10);

  const getTypeColor = (type: Transaction['type']) => {
    return {
      Deposit: 'text-green-600 bg-green-50 border-green-200',
      TransferCredit: 'text-green-600 bg-green-50 border-green-200',
      TransferDebit: 'text-red-600 bg-red-50 border-red-200',
    }[type];
  };

  const getTypeIcon = (type: Transaction['type']) => {
    if (type === 'Deposit') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
        </svg>
      );
    }
    if (type === 'TransferCredit') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" transform="rotate(180 10 10)" />
      </svg>
    );
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      Success: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Failed: 'bg-red-100 text-red-800',
    }[status];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <p className="text-sm text-gray-500 mt-1">View your transaction history</p>
      </div>

      {isLoading ? (
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Failed to load transactions</p>
        </div>
      ) : data?.transactions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
          <p className="text-gray-600">Your transaction history will appear here</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {data?.transactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getTypeColor(tx.type)}`}>
                      {getTypeIcon(tx.type)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {tx.type === 'Deposit' ? 'Deposit' :
                           tx.type === 'TransferCredit' ? 'Money Received' : 'Money Sent'}
                        </h4>
                        {getStatusBadge(tx.status)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{tx.description || 'No description'}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                        <p className="text-xs text-gray-400 font-mono">{tx.reference}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right ml-4">
                    <p className={`text-lg font-bold ${
                      tx.type === 'TransferDebit' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {tx.type === 'TransferDebit' ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{((page - 1) * 10) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * 10, data.totalCount)}</span> of{' '}
                  <span className="font-medium">{data.totalCount}</span> transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                    Page {page} of {data.totalPages}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
