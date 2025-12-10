import React, { useState } from 'react'
import { PublicHeader, Navigation } from '../components/Header'
import { ApartmentCard } from '../components/ApartmentCard'
import { SearchFilters } from '../components/SearchFilters'
import { useFilteredApartments } from '../hooks/useFilteredApartments'
import { apartments } from '../data/apartments'

/**
 * Landing Page - Main apartment search page
 * Users can filter and browse available apartments
 */
export const LandingPage = ({ onNavigate, onSelectApartment }) => {
  const [selectedType, setSelectedType] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [filters, setFilters] = useState({ price: '', rooms: '', floor: '', size: '' })

  const filteredApartments = useFilteredApartments(apartments, selectedType, selectedCity, filters)

  const handleSelectApartment = (apt) => {
    onSelectApartment(apt)
    onNavigate('apartment-detail')
  }

  const handleClearFilters = () => {
    setSelectedType('')
    setSelectedCity('')
    setFilters({ price: '', rooms: '', floor: '', size: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PublicHeader onNavigate={onNavigate} />
      <Navigation currentPage="landing" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Hitta ditt nästa hem</h1>
          <p className="text-xl text-gray-600">Moderna lägenheter och lokaler i Kalmar och Nybro</p>
        </div>

        {/* Search Filters */}
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Visar <span className="font-semibold text-gray-900">{filteredApartments.length}</span> av{' '}
            <span className="font-semibold text-gray-900">{apartments.length}</span> lägenheter
          </p>
        </div>

        {/* Apartments Grid */}
        {filteredApartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredApartments.map((apt) => (
              <ApartmentCard
                key={apt.id}
                apartment={apt}
                onSelectApartment={() => handleSelectApartment(apt)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">Inga lägenheter matchar din sökning.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Rensa filter
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
