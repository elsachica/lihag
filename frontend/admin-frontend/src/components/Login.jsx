import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
                setLoading(false);
                return;
            }

            // Kontrollera att användaren är admin
            if (data.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            // Spara token
            auth.setToken(data.token);

            // Redirect till admin panel
            navigate('/properties');
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="login-icon">🏠</div>
                    <h2>Lihag Admin</h2>
                    <p className="login-subtitle">
                        Välkommen tillbaka! Logga in för att hantera fastigheter.
                    </p>
                </div>

                {error && (
                    <div className="error">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>📧 E-postadress</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@lihag.se"
                            required
                            disabled={loading}
                            className="login-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>🔒 Lösenord</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            className="login-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? '⏳ Loggar in...' : '🚀 Logga in'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>🔐 Endast för administratörer</p>
                </div>
            </div>
        </div>
    );
};
