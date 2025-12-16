import React from 'react'
import { TenantHeader } from '../components/Header'
import { ReportCard } from '../components/ReportCard'
import { maintenanceReports } from '../data/reports'

/**
 * Tenant Dashboard Page - Main logged-in page showing apartment info and reports
 */
export const TenantDashboardPage = ({ onNavigate }) => {
  // Mock tenant data (in real app, this would come from API)
  const tenantApartment = {
    address: 'Vasallgatan 14B',
    area: 'Funkabo',
    city: 'Kalmar',
    rooms: 3,
    size: 75,
    floor: 5,
    price: 10991,
    contractDate: '2023-04-01 - Tillsvidare',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'
  }

  const ongoingReports = maintenanceReports.filter((r) => r.status === 'pågående')
  const resolvedReports = maintenanceReports.filter((r) => r.status === 'åtgärdad')

  const handleLogout = () => {
    onNavigate('landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TenantHeader onNavigate={onNavigate} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Mina sidor</h1>

        {/* My Apartment Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Min lägenhet</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image */}
            <div>
              <img src={tenantApartment.image} alt="Min lägenhet" className="h-64 w-full object-cover rounded-lg" />
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Adress</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{tenantApartment.address}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Område</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {tenantApartment.area}, {tenantApartment.city}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Rum</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{tenantApartment.rooms} rum</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Storlek</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{tenantApartment.size} m²</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Våning</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{tenantApartment.floor}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Hyra</p>
                  <p className="text-lg font-semibold text-blue-600 mt-1">{tenantApartment.price} kr/mån</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Kontraktsdatum</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{tenantApartment.contractDate}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Maintenance Reports Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Mina felanmälningar</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ongoing Reports */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pågående ärenden</h3>
              <div className="space-y-4">
                {ongoingReports.length > 0 ? (
                  ongoingReports.map((report) => <ReportCard key={report.id} report={report} />)
                ) : (
                  <p className="text-gray-500 text-sm">Inga pågående ärenden</p>
                )}
              </div>
            </div>

            {/* Resolved Reports */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Åtgärdade</h3>
              <div className="space-y-4">
                {resolvedReports.length > 0 ? (
                  resolvedReports.map((report) => <ReportCard key={report.id} report={report} />)
                ) : (
                  <p className="text-gray-500 text-sm">Inga åtgärdade ärenden</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
