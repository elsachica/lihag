import React from 'react'
import { LogOut, User, AlertCircle } from 'lucide-react'

/**
 * Authenticated Header Component - shown on tenant dashboard pages
 */
export const TenantHeader = ({ onNavigate, onLogout }) => (
  <header className="bg-white shadow-sm border-b border-blue-100">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Klickbar logo - tar dig till startsidan */}
      <button
        onClick={() => onNavigate('landing')}
        className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
        title="Gå till startsidan"
      >
        Lihag AB
      </button>
      <div className="flex items-center gap-4">
        {/* Mina sidor knapp */}
        <button
          onClick={() => onNavigate('tenant-dashboard')}
          className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
          title="Gå till Mina sidor"
        >
          Mina sidor
        </button>
        {/* Felanmälan knapp */}
        <button
          onClick={() => onNavigate('report-form')}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
          title="Skapa felanmälan"
        >
          <AlertCircle size={20} />
          Felanmälan
        </button>
        {/* Profil knapp */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
          title="Redigera profil"
        >
          <User size={20} />
          Profil
        </button>
        {/* Logga ut knapp */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition"
        >
          <LogOut size={20} />
          Logga ut
        </button>
      </div>
    </div>
  </header>
)

/**
 * Public Header Component - shown on non-authenticated pages
 */
export const PublicHeader = ({ onNavigate }) => (
  <header className="bg-white shadow-sm border-b border-blue-100">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">Lihag AB</div>
      <button
        onClick={() => onNavigate('login')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Logga in
      </button>
    </div>
  </header>
)

/**
 * Navigation Bar Component - shown on public pages
 */
export const Navigation = ({ currentPage, onNavigate }) => (
  <nav className="bg-white border-b border-blue-100">
    <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8">
      <button
        onClick={() => onNavigate('landing')}
        className={`font-medium transition ${currentPage === 'landing' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
      >
        Sök lediga lägenheter
      </button>
      <button
        onClick={() => onNavigate('about')}
        className={`transition ${currentPage === 'about' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
      >
        Om Lihag
      </button>
      <button
        onClick={() => onNavigate('contact')}
        className={`transition ${currentPage === 'contact' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
      >
        Kontakta oss
      </button>
    </div>
  </nav>
)
