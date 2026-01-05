import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../utils/auth';

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'tenant',
        propertyId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${API_URL}/auth/users/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
            setFormData({
                email: data.email,
                password: '',
                role: data.role,
                propertyId: data.propertyId || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = isEdit
                ? `${API_URL}/auth/users/${id}`
                : `${API_URL}/register`;

            const body = isEdit && !formData.password
                ? { email: formData.email, role: formData.role, propertyId: formData.propertyId }
                : formData;

            const response = await fetchWithAuth(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Failed to save user');
            navigate('/users');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) return <div className="loading">Laddar...</div>;

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Redigera användare' : 'Skapa ny användare'}</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Lösenord {isEdit ? '(lämna tomt för att behålla)' : '*'}</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEdit}
                    />
                </div>

                <div className="form-group">
                    <label>Roll *</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="tenant">Tenant</option>
                        <option value="admin">Admin</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Property ID</label>
                    <input
                        type="text"
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/users')} className="btn btn-secondary">
                        Avbryt
                    </button>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Sparar...' : 'Spara'}
                    </button>
                </div>
            </form>
        </div>
    );
};
