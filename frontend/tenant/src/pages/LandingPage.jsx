import React, { useEffect, useState } from 'react'
import { PublicHeader, Navigation } from '../components/Header'
import { ApartmentCard } from '../components/ApartmentCard'
import { SearchFilters } from '../components/SearchFilters'
import { useFilteredApartments } from '../hooks/useFilteredApartments'

export const LandingPage = ({ onNavigate, onSelectApartment }) => {
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedType, setSelectedType] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [filters, setFilters] = useState({ price: '', rooms: '', floor: '', size: '' })

  const filteredApartments = useFilteredApartments(
    apartments,
    selectedType,
    selectedCity,
    filters
  )

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const baseUrl = import.meta.env.VITE_AUTH_SERVICE_URL

        const response = await fetch(`${baseUrl}/property/apartments`)
        if (!response.ok) {
          throw new Error('Failed to fetch apartments')
        }

        const data = await response.json()
        setApartments(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApartments()
  }, [])

  const handleSelectApartment = (apt) => {
    onSelectApartment(apt)
    onNavigate('apartment-detail')
  }

  const handleClearFilters = () => {
    setSelectedType('')
    setSelectedCity('')
    setFilters({ price: '', rooms: '', floor: '', size: '' })
  }

  if (loading) {
    return <p className="text-center mt-20">Laddar lägenheter...</p>
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PublicHeader onNavigate={onNavigate} />
      <Navigation currentPage="landing" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hitta ditt nästa hem
          </h1>
          <p className="text-xl text-gray-600">
            Moderna lägenheter och lokaler i Kalmar och Nybro
          </p>
        </div>

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

        <div className="mb-6">
          <p className="text-gray-600">
            Visar <span className="font-semibold">{filteredApartments.length}</span> av{' '}
            <span className="font-semibold">{apartments.length}</span> objekt
          </p>
        </div>

        {filteredApartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredApartments.map((apt) => (
              <ApartmentCard
                key={apt._id || apt.id}
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
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Rensa filter
            </button>
          </div>
        )}
      </main>
    </div>
  )
}