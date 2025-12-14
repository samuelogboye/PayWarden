import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-lg">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <div className="flex justify-center">
            <svg
              className="w-64 h-64 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard')} className="px-8">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate(-1)} variant="secondary" className="px-8">
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => navigate('/deposit')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Deposit Funds
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/transfer')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Transfer Money
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/api-keys')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
