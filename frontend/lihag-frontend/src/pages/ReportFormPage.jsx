import React, { useState } from 'react'
import { TenantHeader } from '../components/Header'
import { Upload } from 'lucide-react'

/**
 * Report Form Page - Create new maintenance report
 */
export const ReportFormPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
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
      setFormData((prev) => ({
        ...prev,
        image: file.name
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      setSubmitted(true)
      setTimeout(() => {
        onNavigate('tenant-dashboard')
      }, 2000)
    }
  }

  const handleLogout = () => {
    onNavigate('landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TenantHeader onNavigate={onNavigate} onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skapa felanmälan</h1>
          <p className="text-gray-600 mb-8">Beskrivhär vilket fel eller problem som behöver åtgärdas</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titel *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="T.ex. Läckande kran i köket"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
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
                    {formData.image && <p className="text-sm text-green-600 mt-3 font-medium">✓ {formData.image}</p>}
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
