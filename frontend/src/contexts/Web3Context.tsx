interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<string>;
  disconnect: () => void;
}
