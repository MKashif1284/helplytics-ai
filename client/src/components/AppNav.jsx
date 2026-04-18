import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNav() {
  const location = useLocation();
  const path = location.pathname;
  const { logout } = useAuth();

  return (
    <nav className="nav">
      <div className="container">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-icon">H</span>HelpHub AI
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${path === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/explore" className={`nav-link ${path === '/explore' ? 'active' : ''}`}>Explore</Link>
          <Link to="/create-request" className={`nav-link ${path === '/create-request' ? 'active' : ''}`}>Create Request</Link>
          <Link to="/messages" className={`nav-link ${path === '/messages' ? 'active' : ''}`}>Messages</Link>
          <Link to="/profile" className={`nav-link ${path === '/profile' ? 'active' : ''}`}>Profile</Link>
        </div>
        <div className="nav-actions">
          <Link to="/notifications" className="nav-icon-btn">Notifications</Link>
          <Link to="/ai-center" className="nav-auth-btn">Open AI Center</Link>
        </div>
      </div>
    </nav>
  );
}
