import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowed }) => {
  const { account_type } = useAuth();

  // If not logged in at all → send to login
  if (!account_type) return <Navigate to="/login" />;

  // If account type doesn’t match allowed → block
  if (!allowed.includes(account_type)) return <Navigate to="/login" />;

  // Otherwise → allow access
  return children;
};

export default ProtectedRoute;
