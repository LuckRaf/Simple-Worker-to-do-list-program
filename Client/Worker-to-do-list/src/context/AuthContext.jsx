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

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  });

  // Login dengan role, id, dan username dari backend
  const login = (role, id, uname) => {
    setAccountType(role);
    setUserId(id);
    setUsername(uname);

    localStorage.setItem("account_type", role);
    localStorage.setItem("user_id", id);
    localStorage.setItem("username", uname);
  };

  const logout = () => {
    setAccountType(null);
    setUserId(null);
    setUsername(null);

    localStorage.removeItem("account_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
  };

  // Sinkronisasi dengan localStorage jika berubah dari tab lain
  useEffect(() => {
    const handleStorageChange = () => {
      setAccountType(localStorage.getItem("account_type"));
      setUserId(localStorage.getItem("user_id"));
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        account_type,
        user_id,
        username,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
