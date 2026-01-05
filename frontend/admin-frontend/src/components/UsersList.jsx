import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/auth/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill radera denna användare?')) return;

        try {
            const response = await fetch(`${API_URL}/auth/users/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete user');
            fetchUsers();
        } catch (err) {
            alert('Kunde inte radera: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Laddar...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="resource-container">
            <div className="header">
                <h2>Användare</h2>
                <Link to="/users/create" className="btn btn-primary">
                    + Skapa ny användare
                </Link>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Roll</th>
                        <th>Property ID</th>
                        <th>Skapad</th>
                        <th>Åtgärder</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.email}</td>
                            <td>
                                <span className={`role role-${user.role}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>{user.propertyId || 'N/A'}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString('sv-SE')}</td>
                            <td className="actions">
                                <Link to={`/users/edit/${user._id}`} className="btn btn-sm btn-edit">
                                    Redigera
                                </Link>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="btn btn-sm btn-delete"
                                >
                                    Radera
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {users.length === 0 && (
                <div className="empty-state">
                    <p>Inga användare hittades</p>
                </div>
            )}
        </div>
    );
};
