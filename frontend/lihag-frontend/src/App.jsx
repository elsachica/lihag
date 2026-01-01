import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import all page components
import { LandingPage } from './pages/LandingPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ApartmentDetailPage } from './pages/ApartmentDetailPage'
import { InterestFormPage } from './pages/InterestFormPage'
import { LoginPage } from './pages/LoginPage'
import { TenantDashboardPage } from './pages/TenantDashboardPage'
import { ReportFormPage } from './pages/ReportFormPage'
import { ProfilePage } from './pages/ProfilePage'

/**
 * Main App Component
 * Central router and state management for the entire tenant portal
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path=":apartmentId" element={<ApartmentDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="interest-form" element={<InterestFormPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="tenant-dashboard" element={<TenantDashboardPage />} />
        <Route path="report-form" element={<ReportFormPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
