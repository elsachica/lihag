// Simple auth utilities for admin panel
const TOKEN_KEY = 'token';

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

    // Get headers with auth token
    getAuthHeaders() {
        const token = this.getToken();
        console.log('Auth token:', token ? 'exists' : 'missing');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    },
};

// Fetch wrapper that includes auth token
export async function fetchWithAuth(url, options = {}) {
    console.log('fetchWithAuth called:', url, 'method:', options.method || 'GET');
    const response = await fetch(url, {
        ...options,
        headers: {
            ...auth.getAuthHeaders(),
            ...options.headers,
        },
    });

    console.log('Response status:', response.status);

    // If unauthorized, redirect to login
    if (response.status === 401) {
        console.log('401 Unauthorized - redirecting to login');
        auth.removeToken();
        window.location.href = '/login';
    }

    return response;
}
