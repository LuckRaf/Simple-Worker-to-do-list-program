import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css'
import Login from './Client/Worker-to-do-list/src/Pages/Login.jsx'
import MainAdmin from './Client/Worker-to-do-list/src/Pages/MainAdmin.jsx'
import MainUser from './Client/Worker-to-do-list/src/Pages/MainUser.jsx'
import Activity from './Client/Worker-to-do-list/src/Pages/Activity.jsx'
import Productivity from './Client/Worker-to-do-list/src/Pages/Productivity.jsx'
import TaskA from './Client/Worker-to-do-list/src/Pages/TaskListA.jsx';
import TaskU from './Client/Worker-to-do-list/src/Pages/TaskU.jsx';
import ProfileU from './Client/Worker-to-do-list/src/Pages/ProfileUser.jsx';
import NotificationU from './Client/Worker-to-do-list/src/Pages/NotificationU.jsx';

import { AuthProvider } from './Client/Worker-to-do-list/src/context/AuthContext.jsx'
import ProtectedRoute from './Client/Worker-to-do-list/src/context/ProtectedRoute.jsx'

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
              <ProtectedRoute allowed={["user"]}>
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
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
