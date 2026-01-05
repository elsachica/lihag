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

    // If unauthorized, redirect to main site login
    if (response.status === 401) {
        auth.removeToken();
        window.location.href = 'http://lihag.194.47.171.149.nip.io/login';
    }

    return response;
}
