import React from 'react'
import { CheckCircle } from 'lucide-react'
import { PublicHeader, Navigation } from '../components/Header'

/**
 * Apartment Detail Page - Full apartment information
 */
export const ApartmentDetailPage = ({ apartment, onNavigate, onSelectApartment }) => {
  if (!apartment) return null

  const handleInterestClick = () => {
    onSelectApartment(apartment)
    onNavigate('interest-form')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PublicHeader onNavigate={onNavigate} />
      <Navigation currentPage="apartment" onNavigate={onNavigate} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="h-96 overflow-hidden">
            <img src={apartment.image} alt={apartment.address} className="h-full w-full object-cover" />
          </div>

          <div className="p-8 md:p-12">
            {/* Title Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 pb-8 border-b border-gray-200">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{apartment.address}</h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <span className="text-gray-700 font-medium">{apartment.rooms} rum och kök</span>
                  <span className="text-gray-400">•</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {apartment.area}, {apartment.city}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-3xl md:text-4xl font-bold text-blue-600">{apartment.price} kr</p>
                <p className="text-gray-600 text-sm md:text-base">per månad</p>
              </div>
            </div>

            {/* Lägenhetsfakta Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fakta</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Område</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.area}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Kvarter</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.area}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Adress</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.address}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Obj.nr</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.objnr}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Typ</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.rooms} rum och kök</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Boyta</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.size} m²</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Våning</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.floor}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Hyra</p>
                  <p className="text-base md:text-lg font-semibold text-blue-600">{apartment.price} kr</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide font-semibold">Byggt</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{apartment.built}</p>
                </div>
              </div>
            </section>

            {/* Important Dates */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Viktiga datum</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold mb-2">Tillgänglig från</p>
                  <p className="text-2xl font-semibold text-green-700">{apartment.available}</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold mb-2">Anmäl senast</p>
                  <p className="text-2xl font-semibold text-red-700">{apartment.deadline}</p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Beskrivning</h2>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">{apartment.description}</p>
            </section>

            {/* Features */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mer information</h2>
              <ul className="space-y-3">
                {apartment.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* CTA Button */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button
                onClick={handleInterestClick}
                className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
              >
                Gör en intresseanmälan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
