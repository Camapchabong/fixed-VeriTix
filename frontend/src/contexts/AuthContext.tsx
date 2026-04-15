import React, { createContext } from 'react';
export const AuthContext = createContext<any>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user là organizer để vào được trang
  return (
    <AuthContext.Provider value={{ user: { role: 'organizer' }, isAuthenticated: true }}>
      {children}
    </AuthContext.Provider>
  );
};
