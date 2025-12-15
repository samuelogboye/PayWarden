import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function SupportPage() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Get Started" button and sign in with your Google account. Your PayWarden wallet will be created automatically.',
    },
    {
      question: 'How do I add money to my wallet?',
      answer: 'Navigate to the Deposit page from your dashboard, enter the amount you want to add, and complete the payment through Paystack using your card, bank transfer, or USSD.',
    },
    {
      question: 'Are transfers instant?',
      answer: 'Yes! All wallet-to-wallet transfers on PayWarden are processed instantly. The recipient will receive the funds immediately.',
    },
    {
      question: 'What are API keys used for?',
      answer: 'API keys allow you to integrate PayWarden with your applications or services. You can create keys with specific permissions (read, deposit, transfer) and set expiry durations for security.',
    },
    {
      question: 'Is my money safe?',
      answer: 'Absolutely. We use bank-level encryption, secure authentication, and industry-standard security protocols to protect your funds and data.',
    },
    {
      question: 'What payment methods are supported for deposits?',
      answer: 'We support all payment methods available through Paystack, including debit/credit cards, bank transfers, and USSD codes.',
    },
    {
      question: 'Are there any fees?',
      answer: 'Wallet-to-wallet transfers are free. Deposit fees may apply based on your chosen payment method through Paystack.',
    },
    {
      question: 'Can I cancel a transfer?',
      answer: 'Once a transfer is confirmed, it is processed immediately and cannot be canceled. Please double-check recipient details before confirming.',
    },
    {
      question: 'How do I view my transaction history?',
      answer: 'Your transaction history is available on your dashboard. You can see all deposits, transfers, and other wallet activities with detailed information.',
    },
    {
      question: 'What if I forgot my wallet number?',
      answer: 'Your wallet number is always displayed on your dashboard. You can also find it in the balance section of any page.',
    },
    {
      question: 'How do I rollover an expired API key?',
      answer: 'Go to the API Keys page, find the expired key, and click the "Rollover Key" button. A new key will be created with the same permissions.',
    },
    {
      question: 'Can I have multiple API keys?',
      answer: 'Yes, you can create up to 5 active API keys at a time, each with different permissions and expiry durations.',
    },
  ];

  const contactMethods = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Support',
      description: 'Get help via email',
      detail: 'support@paywarden.com',
      response: 'Response within 24 hours',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Live Chat',
      description: 'Chat with our team',
      detail: 'Available 24/7',
      response: 'Instant response',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Documentation',
      description: 'API guides and tutorials',
      detail: 'Comprehensive docs',
      response: 'Self-service',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">PayWarden</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Home
              </button>
              <Button onClick={() => navigate('/login')} variant="primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">How Can We Help?</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant answers to common questions or reach out to our support team
            </p>
          </div>

          {/* Contact Methods */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <p className="text-sm font-semibold text-primary-600 mb-1">{method.detail}</p>
                  <p className="text-sm text-gray-500">{method.response}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
                >
                  <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                    <span className="text-lg">{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Our support team is here to assist you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = 'mailto:support@paywarden.com'}
                className="bg-white !text-primary-600 hover:bg-gray-100 px-8 py-3"
              >
                Email Support
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="secondary"
                className="px-8 py-3 bg-primary-700 text-white border-white hover:bg-primary-800"
              >
                Access Dashboard
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
