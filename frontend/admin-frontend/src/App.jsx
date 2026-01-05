import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { PropertiesList } from './components/PropertiesList';
import { PropertyForm } from './components/PropertyForm';
import { MaintenanceList } from './components/MaintenanceList';
import { MaintenanceForm } from './components/MaintenanceForm';
import { UsersList } from './components/UsersList';
import { UserForm } from './components/UserForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/properties" replace />} />
          
          <Route path="/properties" element={<PropertiesList />} />
          <Route path="/properties/create" element={<PropertyForm />} />
          <Route path="/properties/edit/:id" element={<PropertyForm />} />
          
          <Route path="/maintenance" element={<MaintenanceList />} />
          <Route path="/maintenance/create" element={<MaintenanceForm />} />
          <Route path="/maintenance/edit/:id" element={<MaintenanceForm />} />
          
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/create" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
