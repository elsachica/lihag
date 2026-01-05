import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const MaintenanceList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/maintenance`);
            if (!response.ok) throw new Error('Failed to fetch maintenance reports');
            const data = await response.json();
            setReports(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill radera denna rapport?')) return;

        try {
            const response = await fetch(`${API_URL}/maintenance/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete report');
            fetchReports();
        } catch (err) {
            alert('Kunde inte radera: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Laddar...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="resource-container">
            <div className="header">
                <h2>Felanmälningar</h2>
                <Link to="/maintenance/create" className="btn btn-primary">
                    + Skapa ny rapport
                </Link>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Lägenhet</th>
                        <th>Kategori</th>
                        <th>Beskrivning</th>
                        <th>Status</th>
                        <th>Prioritet</th>
                        <th>Skapad</th>
                        <th>Åtgärder</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id}>
                            <td>{report.apartmentId}</td>
                            <td>{report.category}</td>
                            <td className="description">{report.description}</td>
                            <td>
                                <span className={`status status-${report.status}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td>
                                <span className={`priority priority-${report.priority}`}>
                                    {report.priority || 'N/A'}
                                </span>
                            </td>
                            <td>{new Date(report.createdAt).toLocaleDateString('sv-SE')}</td>
                            <td className="actions">
                                <Link to={`/maintenance/edit/${report._id}`} className="btn btn-sm btn-edit">
                                    Redigera
                                </Link>
                                <button
                                    onClick={() => handleDelete(report._id)}
                                    className="btn btn-sm btn-delete"
                                >
                                    Radera
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {reports.length === 0 && (
                <div className="empty-state">
                    <p>Inga felanmälningar hittades</p>
                </div>
            )}
        </div>
    );
};
