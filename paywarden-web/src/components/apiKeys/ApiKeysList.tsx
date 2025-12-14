import { useState } from 'react';
import { useApiKeys, useRolloverApiKey } from '@/hooks/useApiKeys';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { AxiosError } from "axios";
import { ApiKeyModal } from './ApiKeyModal';

export function ApiKeysList() {
  const { data: keys, isLoading, error } = useApiKeys();
  const rollover = useRolloverApiKey();
  const [newKey, setNewKey] = useState<string | null>(null);
  const [rolloverKeyId, setRolloverKeyId] = useState<string | null>(null);

  const handleRollover = async (keyId: string) => {
    try {
      const result = await rollover.mutateAsync({
        oldKeyId: keyId,
        expiryDuration: '1M',
      });
      setNewKey(result.apiKey);
      setRolloverKeyId(null);
      toast.success('API key rolled over successfully');
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Rollover failed');
    }
  };

  const getPermissionBadge = (permission: string) => {
    const styles = {
      read: 'bg-blue-100 text-blue-800 border-blue-200',
      deposit: 'bg-green-100 text-green-800 border-green-200',
      transfer: 'bg-purple-100 text-purple-800 border-purple-200',
    }[permission] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <span
        key={permission}
        className={`px-2.5 py-1 rounded-md text-xs font-medium border ${styles}`}
      >
        {permission}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load API Keys</h3>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  if (!keys || keys.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No API Keys Yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first API key to start integrating with PayWarden
        </p>
        <div className="max-w-md mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Getting Started</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click "Create New Key" above to generate your first API key</li>
            <li>• Choose the permissions your application needs</li>
            <li>• Set an expiry duration for security</li>
            <li>• Use the key to authenticate API requests</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {keys.map((key) => {
          const isExpired = new Date(key.expiresAt) < new Date();
          const daysUntilExpiry = Math.ceil(
            (new Date(key.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={key.keyId}
              className={`border-2 rounded-xl p-6 transition-all ${
                isExpired
                  ? 'bg-red-50 border-red-200'
                  : daysUntilExpiry <= 7
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {key.name}
                    </h3>
                    {isExpired ? (
                      <span className="shrink-0 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                        EXPIRED
                      </span>
                    ) : daysUntilExpiry <= 7 ? (
                      <span className="shrink-0 px-3 py-1 bg-yellow-600 text-white rounded-full text-xs font-bold">
                        EXPIRES SOON
                      </span>
                    ) : (
                      <span className="shrink-0 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-mono">ID: {key.keyId}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Permissions */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {key.permissions.map((perm) => getPermissionBadge(perm))}
                  </div>
                </div>

                {/* Expiry */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Expires</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(key.expiresAt)}
                    </p>
                    {!isExpired && (
                      <p className={`text-xs mt-1 ${
                        daysUntilExpiry <= 7 ? 'text-yellow-700' : 'text-gray-600'
                      }`}>
                        {daysUntilExpiry > 0
                          ? `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining`
                          : 'Expires today'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Last Used */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Last Used</p>
                  <p className="text-sm text-gray-900">
                    {key.lastUsedAt ? formatDate(key.lastUsedAt) : (
                      <span className="text-gray-400 italic">Never used</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              {key.createdAt && (
                <p className="text-xs text-gray-500 mb-4">
                  Created: {formatDate(key.createdAt)}
                </p>
              )}

              {/* Expiry Warning */}
              {!isExpired && daysUntilExpiry <= 7 && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-800">
                      This key will expire soon. Consider rolling it over to maintain uninterrupted access.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {isExpired ? (
                rolloverKeyId === key.keyId ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 mb-3">
                      Roll over this expired key? The new key will have the same permissions with a 1-month expiry.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => setRolloverKeyId(null)}
                        disabled={rollover.isPending}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleRollover(key.keyId)}
                        isLoading={rollover.isPending}
                        className="flex-1"
                      >
                        Confirm Rollover
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setRolloverKeyId(key.keyId)}
                    variant="secondary"
                    className="w-full"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Rollover Key
                  </Button>
                )
              ) : (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>This key is active and working</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rollover Modal */}
      {newKey && <ApiKeyModal apiKey={newKey} onClose={() => setNewKey(null)} />}
    </>
  );
}
