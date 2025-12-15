import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css'
import Login from './Pages/Login.jsx'
import MainAdmin from './Pages/MainAdmin.jsx'
import MainUser from './Pages/MainUser.jsx'
import Activity from './Pages/Activity.jsx'
import Productivity from './Pages/Productivity.jsx'
import TaskA from './Pages/TaskListA.jsx';
import TaskU from './Pages/TaskU.jsx';
import ProfileU from './Pages/ProfileUser.jsx';
import NotificationU from './Pages/NotificationU.jsx';
import Group from './Pages/Group.jsx';

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
          <Route 
            path="/TaskListA" 
            element={
              <ProtectedRoute allowed={["admin"]}>
                <TaskA />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Activity" 
            element={
              <ProtectedRoute allowed={["admin"]}>
                <Activity/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Productivity" 
            element={
              <ProtectedRoute allowed={["admin"]}>
                <Productivity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Logout" 
            element={
              <ProtectedRoute allowed={["user", "admin"]}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/TaskListU" 
            element={
              <ProtectedRoute allowed={["user"]}>
                <TaskU />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ProfileU" 
            element={
              <ProtectedRoute allowed={["user", "admin"]}>
                <ProfileU />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/NotificationU" 
            element={
              <ProtectedRoute allowed={["user"]}>
                <NotificationU />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Group" 
            element={
              <ProtectedRoute allowed={["user", "admin"]}>
                <Group />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
