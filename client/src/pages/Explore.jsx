import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Explore() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'all', urgency: 'all', status: 'all', search: '' });

  useEffect(() => { fetchRequests(); }, [filters.category, filters.urgency, filters.status]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.urgency !== 'all') params.urgency = filters.urgency;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const res = await API.get('/requests', { params });
      setRequests(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchRequests(); };

  const categories = ['all', 'Academic', 'Technical', 'Career', 'Creative', 'Wellness', 'Finance', 'Project', 'General'];

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      {/* Dark Hero Card */}
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>EXPLORE / FEED</span>
        <h1>Browse help requests with filterable community context.</h1>
        <p>Filter by category, urgency, skills, and location to surface the best matches.</p>
      </div>

      <div className="grid-sidebar">
        {/* Filters */}
        <div className="card" style={{ position: 'sticky', top: 'calc(var(--header-height) + 32px)' }}>
          <span className="section-label">FILTERS</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Refine the feed</h3>

          <div className="filter-group">
            <div className="filter-group-title">Category</div>
            <select className="form-select" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Urgency</div>
            <select className="form-select" value={filters.urgency} onChange={e => setFilters({ ...filters, urgency: e.target.value })}>
              {['all', 'urgent', 'high', 'medium', 'low'].map(u => <option key={u} value={u}>{u === 'all' ? 'All levels' : u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Status</div>
            <select className="form-select" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
              {['all', 'open', 'in-progress', 'solved'].map(s => <option key={s} value={s}>{s === 'all' ? 'All status' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
            </select>
          </div>

          <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => setFilters({ category: 'all', urgency: 'all', status: 'all', search: '' })}>Clear all filters</button>
        </div>

        {/* Request Cards */}
        <div>
          {loading ? <div className="loader"><div className="spinner"></div></div> : requests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {requests.map(req => (
                <div key={req._id} className="request-card">
                  <div className="request-card-tags">
                    <span className="tag tag-category">{req.category}</span>
                    <span className={`tag tag-urgency-${req.urgency}`}>{req.urgency}</span>
                    <span className={`tag tag-status-${req.status}`}>{req.status}</span>
                  </div>
                  <h3 className="request-card-title">{req.title}</h3>
                  <p className="request-card-desc" style={{ WebkitLineClamp: 3 }}>{req.description}</p>
                  <div className="request-card-skill-tags">
                    {req.tags?.slice(0, 4).map(t => <span key={t} className="tag tag-skill">{t}</span>)}
                  </div>
                  <div className="request-card-footer">
                    <div className="request-card-author">
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.author?.name}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginLeft: '4px' }}>{req.author?.location || 'Community'} • {req.helpers?.length || 0} helper interested</span>
                    </div>
                    <Link to={`/request/${req._id}`} className="btn btn-outline btn-sm">Open details</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="card"><div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-text">No requests match your filters</div></div></div>}
        </div>
      </div>
    </div></div></div>
  );
}
