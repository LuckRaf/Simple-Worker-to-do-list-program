import React, { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext();

// Hook to use auth easily
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [account_type, setAccountType] = useState("");

  // Generic login
  const login = (type) => setAccountType(type); // "admin" or "user"
  const logout = () => setAccountType(null);

  return (
    <AuthContext.Provider value={{ account_type, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
