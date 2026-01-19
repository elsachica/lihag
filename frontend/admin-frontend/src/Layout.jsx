import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from './utils/auth';
import './App.css';

export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    auth.removeToken();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="nav-header">
          <h1>Lihag Admin Panel</h1>
        </div>
        <ul>
          <li className={isActive('/properties') ? 'active' : ''}>
            <Link to="/properties">🏠 Properties</Link>
          </li>
          <li className={isActive('/maintenance') ? 'active' : ''}>
            <Link to="/maintenance">🔧 Maintenance</Link>
          </li>
          <li className={isActive('/users') ? 'active' : ''}>
            <Link to="/users">👤 Users</Link>
          </li>
        </ul>
        <div className="nav-footer">
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logga ut
          </button>
        </div>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};
