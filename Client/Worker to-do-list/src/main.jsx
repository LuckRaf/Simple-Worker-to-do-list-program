import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css'
import Login from './Pages/Login.jsx'
import MainAdmin from './Pages/MainAdmin.jsx'
import MainUser from './Pages/MainUser.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './context/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/MainAdmin" 
            element={
              <ProtectedRoute allowed={["admin"]}>
                <MainAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/MainUser" 
            element={
              <ProtectedRoute allowed={["user"]}>
                <MainUser />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
