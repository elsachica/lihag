import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../utils/auth';

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const PropertiesList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${API_URL}/property/apartments`);
            if (!response.ok) throw new Error('Failed to fetch properties');
            const data = await response.json();
            console.log('Fetched properties:', data);
            console.log('First property:', data[0]);
            setProperties(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill radera denna lägenhet?')) return;

        try {
            const response = await fetchWithAuth(`${API_URL}/property/apartments/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete property');
            fetchProperties();
        } catch (err) {
            alert('Kunde inte radera: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Laddar...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="resource-container">
            <div className="header">
                <h2>Lägenheter</h2>
                <Link to="/properties/create" className="btn btn-primary">
                    + Skapa ny lägenhet
                </Link>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nummer</th>
                        <th>Storlek (kvm)</th>
                        <th>Område</th>
                        <th>Typ</th>
                        <th>Hyra (kr)</th>
                        <th>Status</th>
                        <th>Åtgärder</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td>{property.number}</td>
                            <td>{property.size}</td>
                            <td>{property.area}</td>
                            <td>{property.type}</td>
                            <td>{property.price}</td>
                            <td>
                                <span className={`status ${property.isAvailable ? 'available' : 'occupied'}`}>
                                    {property.isAvailable ? 'Ledig' : 'Uthyrd'}
                                </span>
                            </td>
                            <td className="actions">
                                <Link to={`/properties/edit/${property._id}`} className="btn btn-sm btn-edit">
                                    Redigera
                                </Link>
                                <button
                                    onClick={() => handleDelete(property._id)}
                                    className="btn btn-sm btn-delete"
                                >
                                    Radera
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {properties.length === 0 && (
                <div className="empty-state">
                    <p>Inga lägenheter hittades</p>
                </div>
            )}
        </div>
    );
};
