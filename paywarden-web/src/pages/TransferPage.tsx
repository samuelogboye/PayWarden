import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransferForm } from '@/components/transfer/TransferForm';
import { useNavigate } from 'react-router-dom';

export default function TransferPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Transfer Money</h1>
                <p className="text-indigo-100 text-sm">
                  Send money to another PayWarden wallet
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <TransferForm />
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Security */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-900">
                  Secure Transfers
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  All transfers are encrypted and processed securely
                </p>
              </div>
            </div>
          </div>

          {/* Instant */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-900">
                  Instant Processing
                </h3>
                <p className="text-sm text-purple-700 mt-1">
                  Recipient receives funds immediately
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900">
                Can I cancel a transfer?
              </p>
              <p className="text-gray-600 mt-1">
                No, transfers are instant and cannot be reversed. Please verify
                the wallet number before confirming.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Are there any fees?</p>
              <p className="text-gray-600 mt-1">
                No, wallet-to-wallet transfers are completely free.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                What if I enter the wrong wallet number?
              </p>
              <p className="text-gray-600 mt-1">
                Always double-check the recipient's wallet number. Transfers
                cannot be reversed once confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
