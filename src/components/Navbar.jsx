import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav>
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>OFFRAMP_PROTOCOL</Link>
      <div className="nav-links">
        <Link to="/dashboard" className={`nav-item ${path === '/dashboard' ? 'nav-active' : ''}`}>Dashboard</Link>
        <Link to="/leads" className={`nav-item ${path.startsWith('/leads') ? 'nav-active' : ''}`}>Leads</Link>
        <Link to="/pipeline" className={`nav-item ${path === '/pipeline' ? 'nav-active' : ''}`}>Pipeline</Link>
        <Link to="/outreach" className={`nav-item ${path === '/outreach' ? 'nav-active' : ''}`}>Outreach</Link>
        <Link to="/capture" className={`nav-item ${path === '/capture' ? 'nav-active' : ''}`}>Capture</Link>
      </div>
      <Link to="/leads/new" className="cta-small" style={{ textDecoration: 'none' }}>+ New Lead</Link>
    </nav>
  );
}
