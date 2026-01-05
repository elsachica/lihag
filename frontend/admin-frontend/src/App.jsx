import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { PropertiesList } from './components/PropertiesList';
import { PropertyForm } from './components/PropertyForm';
import { MaintenanceList } from './components/MaintenanceList';
import { MaintenanceForm } from './components/MaintenanceForm';
import { UsersList } from './components/UsersList';
import { UserForm } from './components/UserForm';
import { auth } from './utils/auth';
import './App.css';
import { useEffect } from 'react';

// Protected route wrapper - redirects till huvudsidan om ingen token
const ProtectedRoute = ({ children }) => {
    if (!auth.isAuthenticated()) {
        window.location.href = 'http://lihag.194.47.171.149.nip.io/login';
        return null;
    }
    return children;
};

function App() {
    // Kolla om token finns i URL (från redirect efter login)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            console.log('Token found in URL, saving to localStorage');
            auth.setToken(tokenFromUrl);
            // Ta bort token från URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/properties" replace />} />

                <Route path="/properties" element={
                    <ProtectedRoute>
                        <Layout><PropertiesList /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/properties/create" element={
                    <ProtectedRoute>
                        <Layout><PropertyForm /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/properties/edit/:id" element={
                    <ProtectedRoute>
                        <Layout><PropertyForm /></Layout>
                    </ProtectedRoute>
                } />

                <Route path="/maintenance" element={
                    <ProtectedRoute>
                        <Layout><MaintenanceList /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/maintenance/create" element={
                    <ProtectedRoute>
                        <Layout><MaintenanceForm /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/maintenance/edit/:id" element={
                    <ProtectedRoute>
                        <Layout><MaintenanceForm /></Layout>
                    </ProtectedRoute>
                } />

                <Route path="/users" element={
                    <ProtectedRoute>
                        <Layout><UsersList /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/users/create" element={
                    <ProtectedRoute>
                        <Layout><UserForm /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/users/edit/:id" element={
                    <ProtectedRoute>
                        <Layout><UserForm /></Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
