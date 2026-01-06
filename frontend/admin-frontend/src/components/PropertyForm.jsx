import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../utils/auth';

const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        number: '',
        size: '',
        propertyId: '',
        area: '',
        type: 'apartment',
        price: '',
        isAvailable: true,
        description: '',
        floor: '',
        rooms: '',
        objnr: '',
        address: '',
        city: '',
        image: '',
        built: '',
        features: [],
        available: '',
        deadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${API_URL}/property/apartments/${id}`);
            if (!response.ok) throw new Error('Failed to fetch property');
            const data = await response.json();
            setFormData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = isEdit
                ? `${API_URL}/property/apartments/${id}`
                : `${API_URL}/property/apartments`;

            const response = await fetchWithAuth(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to save property (${response.status})`);
            }
            navigate('/properties');
        } catch (err) {
            console.error('Property save error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) return <div className="loading">Laddar...</div>;

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Redigera lägenhet' : 'Skapa ny lägenhet'}</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Nummer *</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Storlek (kvm) *</label>
                        <input
                            type="number"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Property ID *</label>
                        <input
                            type="text"
                            name="propertyId"
                            value={formData.propertyId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Område *</label>
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Typ *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="apartment">Lägenhet</option>
                            <option value="locale">Lokal</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Månadshyra (kr) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Våning</label>
                        <input
                            type="number"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Antal rum *</label>
                        <input
                            type="number"
                            name="rooms"
                            value={formData.rooms}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Objektnummer *</label>
                        <input
                            type="text"
                            name="objnr"
                            value={formData.objnr}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Adress *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Stad *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                        />
                        Ledig
                    </label>
                </div>

                <div className="form-group">
                    <label>Beskrivning</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Bild-URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Byggnadsår</label>
                        <input
                            type="number"
                            name="built"
                            value={formData.built}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Egenskaper (kommaseparerat)</label>
                    <input
                        type="text"
                        name="features"
                        value={Array.isArray(formData.features) ? formData.features.join(', ') : ''}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                        }))}
                        placeholder="t.ex. Balkong, Hiss, Tvättstuga"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Tillgänglig från</label>
                        <input
                            type="date"
                            name="available"
                            value={formData.available ? formData.available.split('T')[0] : ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Ansökningsdeadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline ? formData.deadline.split('T')[0] : ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/properties')} className="btn btn-secondary">
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
