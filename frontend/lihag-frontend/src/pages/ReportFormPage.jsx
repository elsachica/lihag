import React, { useState } from 'react'
import { TenantHeader } from '../components/Header'
import { Upload } from 'lucide-react'

/**
 * Report Form Page - Create new maintenance report
 */
export const ReportFormPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    images: [] // array för bilder
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // lägg till filen i arrayen
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, file]
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.category || !formData.description) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const apartmentId = localStorage.getItem('apartmentId')

      if (!token) {
        throw new Error('Ingen token hittades – användaren är inte inloggad')
      }

      const baseUrl = import.meta.env.VITE_AUTH_SERVICE_URL

      const response = await fetch(`${baseUrl}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          apartmentId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Backend svarade med fel:', data)
        throw new Error(data.message || 'Fel vid skickande av felanmälan')
      }

      setSubmitted(true)

      setTimeout(() => {
        onNavigate('tenant-dashboard')
      }, 2000)
    } catch (error) {
      console.error('Fel vid skickande av felanmälan:', error)
    }
  }



  const handleLogout = () => {
    localStorage.clear()
    onNavigate('landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TenantHeader onNavigate={onNavigate} onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skapa felanmälan</h1>
          <p className="text-gray-600 mb-8">Beskriv vilket fel eller problem som behöver åtgärdas</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                >
                  <option value="">Välj kategori</option>
                  <option value="Sovrum">Sovrum</option>
                  <option value="Kök">Kök</option>
                  <option value="Vardagsrum">Vardagsrum</option>
                  <option value="Badrum">Badrum</option>
                  <option value="Klädkammare">Klädkammare</option>
                  <option value="Balkong">Balkong</option>
                  <option value="Hall">Hall</option>
                  <option value="Vitvaror">Vitvaror</option>
                  <option value="Värme & ventilation">Värme & ventilation</option>
                  <option value="El">El</option>
                  <option value="Vatten & avlopp">Vatten & avlopp</option>
                  <option value="Hiss">Hiss</option>
                  <option value="Trapphus">Trapphus</option>
                  <option value="Entré">Entré</option>
                  <option value="Utegård">Utegård</option>
                  <option value="Tvättstuga">Tvättstuga</option>
                  <option value="Miljörum">Miljörum</option>
                  <option value="Fastighet">Fastighet</option>
                  <option value="Parkering & garage">Parkering & garage</option>
                  <option value="Cykelrum">Cykelrum</option>
                  <option value="Övrigt">Övrigt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Beskrivning *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Beskriv problemet så detaljerat som möjligt..."
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Ladda upp bild (valfritt)</label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer hover:bg-blue-50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="mx-auto text-blue-600 mb-2" size={40} />
                    <p className="text-gray-600 font-medium">Klicka för att välja bild</p>
                    <p className="text-sm text-gray-500 mt-1">Max 5MB, JPG eller PNG</p>
                    {formData.images.length > 0 && (
                      <ul className="text-sm text-green-600 mt-3 font-medium">
                        {formData.images.map((img, idx) => (
                          <li key={idx}>✓ {img.name}</li>
                        ))}
                      </ul>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg mt-8"
              >
                Skicka felanmälan
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Felanmälan skickad!</h2>
              <p className="text-gray-600 mb-6">Vi återkommer så snart som möjligt.</p>
              <p className="text-sm text-gray-500">Du omdirigeras snart...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
