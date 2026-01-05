import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const MaintenanceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        apartmentId: '',
        category: 'electrical',
        description: '',
        status: 'new',
        priority: 'medium',
        assignedTo: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchReport();
        }
    }, [id]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/maintenance/${id}`);
            if (!response.ok) throw new Error('Failed to fetch report');
            const data = await response.json();
            setFormData(data);
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
                ? `${API_URL}/maintenance/${id}`
                : `${API_URL}/maintenance`;

            const response = await fetch(url, {
                method: isEdit ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save report');
            navigate('/maintenance');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) return <div className="loading">Laddar...</div>;

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Redigera felanmälan' : 'Skapa ny felanmälan'}</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Lägenhet ID *</label>
                    <input
                        type="text"
                        name="apartmentId"
                        value={formData.apartmentId}
                        onChange={handleChange}
                        required
                        disabled={isEdit}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Kategori *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="electrical">El</option>
                            <option value="plumbing">VVS</option>
                            <option value="heating">Värme</option>
                            <option value="ventilation">Ventilation</option>
                            <option value="other">Övrigt</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="new">Ny</option>
                            <option value="in_progress">Pågående</option>
                            <option value="completed">Klar</option>
                            <option value="cancelled">Avbruten</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Prioritet</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Låg</option>
                            <option value="medium">Medium</option>
                            <option value="high">Hög</option>
                            <option value="urgent">Akut</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tilldelad till</label>
                        <input
                            type="text"
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Beskrivning *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="6"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/maintenance')} className="btn btn-secondary">
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
