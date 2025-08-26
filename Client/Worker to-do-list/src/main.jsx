import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css'
import Login from './Pages/Login.jsx'
import MainAdmin from './Pages/MainAdmin.jsx'
import MainUser from './Pages/MainUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserStatsProvider>
          <UserProfileProvider>
            <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/MainAdmin" element={<MainAdmin />} />
          <Route path="/MainUser" element={<MainUser />} />
        </Routes>
        <ToastContainer />
          </UserProfileProvider>
        </UserStatsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
