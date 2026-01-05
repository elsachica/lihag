// Simple auth utilities for admin panel
const TOKEN_KEY = 'token';

// Hjälpfunktion för att läsa cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export const auth = {
    // Save token to localStorage
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Get token from cookie först, sedan localStorage som fallback
    getToken() {
        return getCookie('authToken') || localStorage.getItem(TOKEN_KEY);
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
