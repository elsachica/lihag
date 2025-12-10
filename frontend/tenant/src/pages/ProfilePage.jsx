import React, { useState } from 'react'
import { TenantHeader } from '../components/Header'

/**
 * Profile Page - Edit tenant profile information
 */
export const ProfilePage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: 'Anna Andersson',
    email: 'anna.andersson@example.com',
    phone: '070-123 45 67',
    password: ''
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
    setTimeout(() => {
      onNavigate('tenant-dashboard')
    }, 2000)
  }

  const handleLogout = () => {
    onNavigate('landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TenantHeader onNavigate={onNavigate} onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Min profil</h1>
          <p className="text-gray-600 mb-8">Uppdatera dina personliga uppgifter</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Namn</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-post</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefonnummer</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nytt lösenord</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Lämna tomt för att behålla nuvarande"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-2">Du kan lämna detta fält tomt om du inte vill ändra lösenordet</p>
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
              <h2 className="text-2xl font-bold text-green-600 mb-2">Profil uppdaterad!</h2>
              <p className="text-gray-600">Dina ändringar har sparats.</p>
              <p className="text-sm text-gray-500 mt-4">Du omdirigeras snart...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
