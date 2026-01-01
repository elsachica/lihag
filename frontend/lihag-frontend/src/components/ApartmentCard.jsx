import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'

/**
 * Apartment Card Component - displayed in search grid
 */
export const ApartmentCard = ({ apartment }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/${apartment._id || apartment.id}`)}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition cursor-pointer group"
    >
      <div className="overflow-hidden h-48">
        <img
          src={apartment.image}
          alt={apartment.address}
          className="h-48 w-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{apartment.address}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{apartment.rooms} rum</span>
          <span className="text-blue-600 font-bold text-lg">{apartment.price} kr</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <MapPin size={14} />
          <span>
            {apartment.area}, {apartment.city}
          </span>
        </div>
        <div className="text-xs text-gray-600 font-medium">{apartment.size} m²</div>
      </div>
    </div>
  )
}
