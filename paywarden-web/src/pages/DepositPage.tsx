import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DepositForm } from '@/components/deposit/DepositForm';
import { useNavigate } from 'react-router-dom';

export default function DepositPage() {
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
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Deposit Funds</h1>
                <p className="text-primary-100 text-sm">
                  Add money to your wallet
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <DepositForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900">
                How long does it take?
              </p>
              <p className="text-gray-600 mt-1">
                Deposits are processed instantly once payment is confirmed.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">What payment methods?</p>
              <p className="text-gray-600 mt-1">
                We accept cards, bank transfers, and USSD via Paystack.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Is it secure?</p>
              <p className="text-gray-600 mt-1">
                Yes! All payments are processed securely through Paystack with
                PCI DSS compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
