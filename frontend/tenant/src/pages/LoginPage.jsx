import React, { useState } from 'react'
import { LoginHeader, Navigation } from '../components/Header'

/**
 * Login Page - User authentication
 */
export const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    const url = import.meta.env.AUTH_URL
    e.preventDefault()
    if (email && password) {
      try {
        const response = await fetch(url + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()
        if (!response.ok) {
          alert(data.message || 'Login failed')
          return
        }

        // Spara token (eller session-id) lokalt
        localStorage.setItem('token', data.token)

        // Navigera vidare
        onNavigate('tenant-dashboard')
      } catch (err) {
        console.error(err)
        alert('Something went wrong')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <LoginHeader onNavigate={onNavigate} />
      <Navigation currentPage="login" onNavigate={onNavigate} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-blue-600 mb-3">Lihag AB</div>
            <p className="text-gray-600 text-lg">Logga in som hyresgäst</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din.epost@example.com"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
            >
              Logga in
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">Demo: Använd vilken e-post och lösenord som helst</p>
          </div>
        </div>
      </div>
    </div>
  )
}
