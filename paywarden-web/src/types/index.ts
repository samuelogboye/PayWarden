export interface User {
  email: string;
  name?: string;
  walletNumber?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  expiresAt: string;
}

export interface WalletBalance {
  walletId: string;
  walletNumber: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  reference: string;
  type: 'Deposit' | 'TransferDebit' | 'TransferCredit';
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  description?: string;
  createdAt: string;
}

export interface TransactionList {
  transactions: Transaction[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface DepositResponse {
  reference: string;
  amount: number;
  authorizationUrl: string;
  accessCode: string;
}

export interface DepositStatus {
  reference: string;
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  paystackStatus: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransferRequest {
  recipientWalletNumber: string;
  amount: number;
  description?: string;
}

export interface TransferResponse {
  transferReference: string;
  senderWalletNumber: string;
  recipientWalletNumber: string;
  amount: number;
  newBalance: number;
  transferredAt: string;
  description?: string;
}

export interface ApiKey {
  keyId: string;
  name: string;
  permissions: string[];
  expiresAt: string;
  lastUsedAt?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expiryDuration: string;
}

export interface CreateApiKeyResponse {
  apiKey: string;
  keyId: string;
  name: string;
  permissions: string[];
  expiresAt: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  details?: string;
}
