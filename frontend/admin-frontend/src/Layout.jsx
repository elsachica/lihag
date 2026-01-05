import { Link, useLocation } from 'react-router-dom';
import './App.css';

export const Layout = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <h1>Lihag Admin Panel</h1>
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
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};
