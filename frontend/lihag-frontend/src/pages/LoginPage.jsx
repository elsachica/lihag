import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginHeader, Navigation } from '../components/Header'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate() // <-- React Router navigation

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted')
    const url = import.meta.env.VITE_AUTH_SERVICE_URL
    console.log('Auth service URL:', url)

    if (email && password) {
      try {
        console.log('Sending login request...')
        const response = await fetch(url + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Login response:', data)

        if (!response.ok) {
          alert(data.message || 'Login failed')
          return
        }

        console.log('User role:', data.role)

        localStorage.setItem('token', data.token)
        localStorage.setItem('apartmentId', data.apartmentId)

        // Redirect baserat på roll
        if (data.role === 'admin') {
          console.log('Redirecting to admin frontend')
          console.log('About to redirect to: http://lihag.admin.194.47.171.149.nip.io')
          // Skicka token som query parameter eftersom localStorage inte delas mellan domäner
          window.location.replace(`http://lihag.admin.194.47.171.149.nip.io?token=${data.token}`)
          return
        } else {
          console.log('Navigating to tenant dashboard')
          navigate('/tenant-dashboard')
        }
      } catch (err) {
        console.error('Login error:', err)
        alert('Something went wrong: ' + err.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <LoginHeader />
      <Navigation currentPage="login" />

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
