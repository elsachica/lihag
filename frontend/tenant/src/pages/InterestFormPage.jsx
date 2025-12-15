import React, { useState } from 'react'

/**
 * Interest Form Page - User expresses interest in an apartment
 */
export const InterestFormPage = ({ apartment, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
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
    if (formData.name && formData.phone && formData.email) {
      setSubmitted(true)
      setTimeout(() => {
        onNavigate('landing')
      }, 2000)
    }
  }

  if (!apartment) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => onNavigate('apartment-detail')}
            className="text-blue-600 hover:text-blue-800 font-medium transition flex items-center gap-2"
          >
            ← Tillbaka
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Intresseanmälan</h1>

          {!submitted ? (
            <>
              {/* Apartment Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Du anmäler intresse för:</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{apartment.address}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span>{apartment.rooms} rum</span>
                  <span>•</span>
                  <span className="font-medium text-blue-600">{apartment.price} kr/mån</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Namn *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="För- och efternamn"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefonnummer *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="070-123 45 67"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">E-post *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="din.epost@example.com"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg mt-8"
                >
                  Skicka intresseanmälan
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Tack för din intresseanmälan!</h2>
              <p className="text-gray-600 mb-6">Vi kontaktar dig inom kort.</p>
              <p className="text-sm text-gray-500">Du omdirigeras snart...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
