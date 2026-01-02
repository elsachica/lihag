import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TenantHeader } from '../components/Header'

/**
 * Profile Page - Edit tenant profile information
 */
export const ProfilePage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: 'Anna',
    lastName: 'Andersson',
    email: 'anna.andersson@example.com',
    phone: '070-123 45 67'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)

    // Simulera sparning + redirect
    setTimeout(() => {
      navigate('/tenant-dashboard')
    }, 2000)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/') // landing page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TenantHeader onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Min profil</h1>
          <p className="text-gray-600 mb-8">Uppdatera dina personliga uppgifter</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Förnamn
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Efternamn
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg mt-8"
              >
                Spara ändringar
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Profil uppdaterad!
              </h2>
              <p className="text-gray-600">Dina ändringar har sparats.</p>
              <p className="text-sm text-gray-500 mt-4">
                Du omdirigeras snart...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
