import React from 'react'

/**
 * Apartment Search Filters Component
 * Filters apartments by: type, city, price, rooms, floor, size
 */
export const SearchFilters = ({ filters, onFilterChange, selectedType, onTypeChange, selectedCity, onCityChange, onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Alla typer</option>
            <option value="lägenhet">Lägenhet</option>
            <option value="lokal">Lokal</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Alla städer</option>
            <option value="Kalmar">Kalmar</option>
            <option value="Nybro">Nybro</option>
          </select>
        </div>

        <div>
          <input
            type="number"
            placeholder="Max pris"
            value={filters.price}
            onChange={(e) => onFilterChange({ ...filters, price: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Antal rum"
            value={filters.rooms}
            onChange={(e) => onFilterChange({ ...filters, rooms: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Våning"
            value={filters.floor}
            onChange={(e) => onFilterChange({ ...filters, floor: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Min storlek (m²)"
            value={filters.size}
            onChange={(e) => onFilterChange({ ...filters, size: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="mt-4 text-blue-600 hover:underline text-sm font-medium transition"
      >
        Rensa filter
      </button>
    </div>
  )
}
