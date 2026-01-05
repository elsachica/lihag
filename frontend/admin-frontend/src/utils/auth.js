// Simple auth utilities for admin panel
const TOKEN_KEY = 'admin_token';

export const auth = {
    // Save token to localStorage
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Get token from localStorage
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Remove token
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Login
    async login(email, password) {
        const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data;
    },

    // Logout
    logout() {
        this.removeToken();
    },

    // Get headers with auth token
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    },
};

// Fetch wrapper that includes auth token
export async function fetchWithAuth(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...auth.getAuthHeaders(),
            ...options.headers,
        },
    });

    // If unauthorized, redirect to login
    if (response.status === 401) {
        auth.logout();
        window.location.href = '/login';
    }

    return response;
}
