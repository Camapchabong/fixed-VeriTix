import React, { createContext } from 'react';
export const Web3Context = createContext<any>(null);
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Web3Context.Provider value={{ isConnected: true, address: '0x123...' }}>
      {children}
    </Web3Context.Provider>
  );
};
