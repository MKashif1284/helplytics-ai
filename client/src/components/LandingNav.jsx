import { Link, useLocation } from 'react-router-dom';

export default function LandingNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="nav">
      <div className="container">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-icon">H</span>HelpHub AI
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/explore" className={`nav-link ${path === '/explore' ? 'active' : ''}`}>Explore</Link>
          <Link to="/leaderboard" className={`nav-link ${path === '/leaderboard' ? 'active' : ''}`}>Leaderboard</Link>
          <Link to="/ai-center" className={`nav-link ${path === '/ai-center' ? 'active' : ''}`}>AI Center</Link>
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn">Live community signals</button>
          <Link to="/auth" className="nav-auth-btn">Join the platform</Link>
        </div>
      </div>
    </nav>
  );
}
