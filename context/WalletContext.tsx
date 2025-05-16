import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the context type
interface WalletContextType {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  setWalletAddress: () => {},
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext); 