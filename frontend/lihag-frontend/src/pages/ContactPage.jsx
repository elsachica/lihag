import React from 'react'
import { PublicHeader, Navigation } from '../components/Header'
import { Phone, Mail, Clock, AlertCircle } from 'lucide-react'

/**
 * Contact Page - Company contact information
 */
export const ContactPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PublicHeader onNavigate={onNavigate} />
      <Navigation currentPage="contact" onNavigate={onNavigate} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Kontakta oss</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Phone Card */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-blue-600" size={28} />
                <h2 className="text-xl font-semibold text-gray-900">Telefon</h2>
              </div>
              <p className="text-gray-700 text-lg font-medium mb-3">0480-123 456</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Måndag-Fredag: 08:00-17:00</span>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-600" size={28} />
                <h2 className="text-xl font-semibold text-gray-900">E-post</h2>
              </div>
              <p className="text-gray-700 text-lg font-medium mb-3">info@lihag.se</p>
              <p className="text-sm text-gray-600">Vi svarar vanligtvis inom 24 timmar</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Öppettider
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span>Måndag - Fredag:</span>
                <span className="font-semibold">08:00 - 17:00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Lördag - Söndag:</span>
                <span className="font-semibold">Stängt</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Akuta ärenden</h3>
                <p className="text-gray-700">
                  För brådskande felanmälningar utanför kontorstid, ring vår jourlinje:{' '}
                  <span className="font-bold">0480-999 000</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
