import React, { useState } from 'react';
import { Home, Users, AlertCircle, FileText, LogOut, Plus, Edit, Trash2, Eye, EyeOff, DollarSign, TrendingUp, CheckCircle, X } from 'lucide-react';

const LihagAdminFrontend = () => {
  const [currentView, setCurrentView] = useState('login');
  const [sidebarSection, setSidebarSection] = useState('statistics');
  const [showCreateApartment, setShowCreateApartment] = useState(false);
  const [showCreateTenant, setShowCreateTenant] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const apartments = [
    { id: 1, address: 'Vasallgatan 14B', area: 'Funkabo', city: 'Kalmar', rooms: 3, price: 10991, visible: true, occupied: true },
    { id: 2, address: 'Storgatan 45', area: 'Centrum', city: 'Kalmar', rooms: 2, price: 8500, visible: true, occupied: false },
    { id: 3, address: 'Parkvägen 12', area: 'Nybro Centrum', city: 'Nybro', rooms: 4, price: 12500, visible: true, occupied: true },
    { id: 4, address: 'Kvarnholmsvägen 8', area: 'Kvarnholmen', city: 'Kalmar', rooms: 1, price: 5900, visible: false, occupied: false },
    { id: 5, address: 'Lindövägen 34', area: 'Lindö', city: 'Kalmar', rooms: 3, price: 9800, visible: true, occupied: true },
  ];

  const tenants = [
    { id: 1, name: 'Anna Andersson', email: 'anna@example.com', phone: '070-123 45 67', apartment: 'Vasallgatan 14B', contractStart: '2023-04-01', rent: 10991 },
    { id: 2, name: 'Erik Eriksson', email: 'erik@example.com', phone: '070-234 56 78', apartment: 'Parkvägen 12', contractStart: '2022-08-15', rent: 12500 },
    { id: 3, name: 'Maria Svensson', email: 'maria@example.com', phone: '070-345 67 89', apartment: 'Lindövägen 34', contractStart: '2024-01-10', rent: 9800 },
  ];

  const reports = [
    { id: 1, tenant: 'Anna Andersson', apartment: 'Vasallgatan 14B', title: 'Läckande kran', status: 'pågående', date: '2025-11-20' },
    { id: 2, tenant: 'Erik Eriksson', apartment: 'Parkvägen 12', title: 'Trasig spis', status: 'mottagen', date: '2025-11-15' },
    { id: 3, tenant: 'Maria Svensson', apartment: 'Lindövägen 34', title: 'Dålig värme', status: 'pågående', date: '2025-11-10' },
  ];

  const interests = [
    { id: 1, name: 'Johan Johansson', email: 'johan@example.com', phone: '070-456 78 90', apartment: 'Storgatan 45', date: '2025-12-01' },
    { id: 2, name: 'Lisa Larsson', email: 'lisa@example.com', phone: '070-567 89 01', apartment: 'Kvarnholmsvägen 8', date: '2025-12-03' },
  ];

  const totalApartments = apartments.length;
  const occupiedApartments = apartments.filter(a => a.occupied).length;
  const totalTenants = tenants.length;
  const totalMonthlyIncome = tenants.reduce((sum, t) => sum + t.rent, 0);
  const totalYearlyIncome = totalMonthlyIncome * 12;

  return (
    <div>
      {currentView === 'login' ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">Lihag AB</div>
              <p className="text-gray-600">Admin Dashboard</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-post</label>
                <input type="email" className="w-full px-4 py-3 border border-blue-200 rounded-lg" placeholder="admin@lihag.se" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lösenord</label>
                <input type="password" className="w-full px-4 py-3 border border-blue-200 rounded-lg" placeholder="••••••••" />
              </div>
              <button onClick={() => setCurrentView('dashboard')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                Logga in
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
          <aside className="w-64 bg-white shadow-lg fixed h-full">
            <div className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-8">Lihag AB</div>
              <nav className="space-y-2">
                <button onClick={() => setSidebarSection('statistics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${sidebarSection === 'statistics' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <TrendingUp size={20} />Översikt
                </button>
                <button onClick={() => setSidebarSection('apartments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${sidebarSection === 'apartments' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Home size={20} />Lägenheter
                </button>
                <button onClick={() => setSidebarSection('tenants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${sidebarSection === 'tenants' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Users size={20} />Hyresgäster
                </button>
                <button onClick={() => setSidebarSection('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${sidebarSection === 'reports' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <AlertCircle size={20} />Felanmälningar
                </button>
                <button onClick={() => setSidebarSection('interests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${sidebarSection === 'interests' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <FileText size={20} />Intresseanmälningar
                </button>
              </nav>
            </div>
          </aside>
          <main className="flex-1 ml-64">
            <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-10">
              <div className="px-8 py-4 flex items-center justify-between">
                <div className="text-lg font-semibold">Admin Dashboard</div>
                <button onClick={() => setCurrentView('login')} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut size={20} />Logga ut
                </button>
              </div>
            </header>
            <div className="p-8">
              {sidebarSection === 'statistics' && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">Översikt</h1>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Totalt lägenheter</p>
                          <p className="text-3xl font-bold text-gray-900">{totalApartments}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg"><Home className="text-blue-600" size={24} /></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Uthyrda</p>
                          <p className="text-3xl font-bold text-gray-900">{occupiedApartments}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={24} /></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Lediga</p>
                          <p className="text-3xl font-bold text-gray-900">{totalApartments - occupiedApartments}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg"><Home className="text-yellow-600" size={24} /></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Hyresgäster</p>
                          <p className="text-3xl font-bold text-gray-900">{totalTenants}</p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg"><Users className="text-indigo-600" size={24} /></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <DollarSign size={28} />
                        <h2 className="text-xl font-semibold">Månadsinkomst</h2>
                      </div>
                      <p className="text-4xl font-bold mb-2">{totalMonthlyIncome.toLocaleString('sv-SE')} kr</p>
                      <p className="text-blue-100">Från {totalTenants} hyresgäster</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp size={28} />
                        <h2 className="text-xl font-semibold">Årsinkomst</h2>
                      </div>
                      <p className="text-4xl font-bold mb-2">{totalYearlyIncome.toLocaleString('sv-SE')} kr</p>
                      <p className="text-green-100">Baserat på nuvarande hyror</p>
                    </div>
                  </div>
                </div>
              )}
              {sidebarSection === 'apartments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Lägenheter</h1>
                    <button onClick={() => setShowCreateApartment(!showCreateApartment)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Plus size={20} />Skapa lägenhet
                    </button>
                  </div>
                  {showCreateApartment && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Skapa ny lägenhet</h2>
                        <button onClick={() => setShowCreateApartment(false)}><X size={24} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Adress" className="px-4 py-3 border border-blue-200 rounded-lg" />
                        <input type="text" placeholder="Område" className="px-4 py-3 border border-blue-200 rounded-lg" />
                        <input type="number" placeholder="Rum" className="px-4 py-3 border border-blue-200 rounded-lg" />
                        <input type="number" placeholder="Pris" className="px-4 py-3 border border-blue-200 rounded-lg" />
                      </div>
                      <button onClick={() => setShowCreateApartment(false)} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Skapa</button>
                    </div>
                  )}
                  <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Adress</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Rum</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Pris</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Synlig</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">Åtgärder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {apartments.map(apt => (
                          <tr key={apt.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{apt.address}</td>
                            <td className="px-6 py-4">{apt.rooms}</td>
                            <td className="px-6 py-4">{apt.price} kr</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${apt.occupied ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {apt.occupied ? 'Uthyrd' : 'Ledig'}
                              </span>
                            </td>
                            <td className="px-6 py-4">{apt.visible ? <Eye className="text-green-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}</td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {sidebarSection === 'tenants' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Hyresgäster</h1>
                    <button onClick={() => setShowCreateTenant(!showCreateTenant)} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                      <Plus size={20} />Skapa
                    </button>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Namn</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Kontakt</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Lägenhet</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Hyra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {tenants.map(t => (
                          <tr key={t.id}>
                            <td className="px-6 py-4">{t.name}</td>
                            <td className="px-6 py-4 text-sm">{t.email}</td>
                            <td className="px-6 py-4">{t.apartment}</td>
                            <td className="px-6 py-4">{t.rent} kr</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {sidebarSection === 'reports' && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Felanmälningar</h1>
                  <div className="space-y-4">
                    {reports.map(r => (
                      <div key={r.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                            <p className="text-sm text-gray-600">{r.tenant} - {r.apartment}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${r.status === 'åtgärdad' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sidebarSection === 'interests' && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Intresseanmälningar</h1>
                  <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Namn</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Kontakt</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Intresserad i</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {interests.map(i => (
                          <tr key={i.id}>
                            <td className="px-6 py-4">{i.name}</td>
                            <td className="px-6 py-4 text-sm">{i.email}</td>
                            <td className="px-6 py-4">{i.apartment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default LihagAdminFrontend;