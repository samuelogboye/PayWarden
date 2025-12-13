import { create } from 'zustand';
import { WalletBalance } from '@/types';

interface WalletState {
  balance: WalletBalance | null;
  setBalance: (balance: WalletBalance) => void;
  clearBalance: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,
  setBalance: (balance) => set({ balance }),
  clearBalance: () => set({ balance: null }),
}));
