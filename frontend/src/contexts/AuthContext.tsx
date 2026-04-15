interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (walletAddress: string, signature: string) => Promise<void>;
  logout: () => void;
}
