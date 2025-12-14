const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_GOOGLE_CLIENT_ID',
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
        'Please create a .env file with the following variables:\n' +
        requiredEnvVars.map((key) => `${key}=your_value_here`).join('\n')
    );
  }

  console.log('✓ Environment variables validated successfully');
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
