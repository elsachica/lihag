import React, { useState } from 'react'

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
  // Current view/page state
  const [currentView, setCurrentView] = useState('landing')

  // Selected apartment state (used across multiple pages)
  const [selectedApartment, setSelectedApartment] = useState(null)

  /**
   * Navigate to a different view/page
   * @param {string} view - The view name to navigate to
   */
  const handleNavigate = (view) => {
    setCurrentView(view)
    // Scroll to top of page
    window.scrollTo(0, 0)
  }

  /**
   * Set the selected apartment and navigate to its detail page
   * @param {object} apartment - The apartment object
   */
  const handleSelectApartment = (apartment) => {
    setSelectedApartment(apartment)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Landing Page */}
      {currentView === 'landing' && (
        <LandingPage onNavigate={handleNavigate} onSelectApartment={handleSelectApartment} />
      )}

      {/* About Page */}
      {currentView === 'about' && <AboutPage onNavigate={handleNavigate} />}

      {/* Contact Page */}
      {currentView === 'contact' && <ContactPage onNavigate={handleNavigate} />}

      {/* Apartment Detail Page */}
      {currentView === 'apartment-detail' && (
        <ApartmentDetailPage apartment={selectedApartment} onNavigate={handleNavigate} onSelectApartment={handleSelectApartment} />
      )}

      {/* Interest Form Page */}
      {currentView === 'interest-form' && (
        <InterestFormPage apartment={selectedApartment} onNavigate={handleNavigate} />
      )}

      {/* Login Page */}
      {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}

      {/* Tenant Dashboard Page */}
      {currentView === 'tenant-dashboard' && <TenantDashboardPage onNavigate={handleNavigate} />}

      {/* Report Form Page */}
      {currentView === 'report-form' && <ReportFormPage onNavigate={handleNavigate} />}

      {/* Profile Page */}
      {currentView === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
    </div>
  )
}

export default App
