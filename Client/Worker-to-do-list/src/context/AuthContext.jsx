import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [account_type, setAccountType] = useState(() => {
    return localStorage.getItem("account_type") || null;
  });
  const [user_id, setUserId] = useState(() => {
    return localStorage.getItem("user_id") || null;
  });

  // Login dengan role dan id dari backend
  const login = (role, id) => {
    setAccountType(role);
    setUserId(id);
    localStorage.setItem("account_type", role);
    localStorage.setItem("user_id", id);
  };

  const logout = () => {
    setAccountType(null);
    setUserId(null);
    localStorage.removeItem("account_type");
    localStorage.removeItem("user_id");
  };

  // Sinkronisasi dengan localStorage jika berubah dari tab lain
  useEffect(() => {
    const handleStorageChange = () => {
      setAccountType(localStorage.getItem("account_type"));
      setUserId(localStorage.getItem("user_id"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ account_type, user_id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
