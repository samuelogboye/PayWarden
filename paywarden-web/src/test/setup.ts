import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables for testing
process.env.VITE_API_BASE_URL = 'http://localhost:8080/api';
process.env.VITE_GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.VITE_PAYSTACK_PUBLIC_KEY = 'pk_test_xxx';
