import { useState, useEffect } from 'react';
import API from '../api';

export default function Admin() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([API.get('/requests'), API.get('/users'), API.get('/ai/trends')]).then(([r, u, t]) => {
      setRequests(r.data); setUsers(u.data);
      setStats({ totalUsers: u.data.length, totalRequests: r.data.length, openRequests: r.data.filter(x => x.status === 'open').length, solvedRequests: r.data.filter(x => x.status === 'solved').length, ...t.data });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => { if (!window.confirm('Delete this request?')) return; try { await API.delete(`/requests/${id}`); setRequests(p => p.filter(r => r._id !== id)); } catch (e) { alert(e.response?.data?.message || 'Error'); } };
  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>ADMIN PANEL</span>
        <h1>Moderation and analytics overview.</h1>
        <p>Admin visibility for managing request quality and platform health.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card"><div className="stat-card-label teal">TOTAL USERS</div><div className="stat-card-value">{stats.totalUsers || 0}</div></div>
        <div className="stat-card"><div className="stat-card-label orange">TOTAL REQUESTS</div><div className="stat-card-value">{stats.totalRequests || 0}</div></div>
        <div className="stat-card"><div className="stat-card-label green">SOLVED</div><div className="stat-card-value">{stats.solvedRequests || 0}</div></div>
        <div className="stat-card"><div className="stat-card-label red">OPEN</div><div className="stat-card-value">{stats.openRequests || 0}</div></div>
      </div>

      <div className="card">
        <div className="tabs">
          <button className={`tab ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Requests ({requests.length})</button>
          <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users ({users.length})</button>
          <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
        </div>
        {loading ? <div className="loader"><div className="spinner"></div></div> : activeTab === 'requests' ? (
          <div className="table-wrapper"><table className="data-table"><thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Urgency</th><th>Status</th><th>Helpers</th><th>Actions</th></tr></thead>
          <tbody>{requests.map(req => (
            <tr key={req._id}>
              <td style={{ fontWeight: 700, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><a href={`/request/${req._id}`} style={{ color: 'var(--accent)' }}>{req.title}</a></td>
              <td>{req.author?.name}</td>
              <td><span className="tag tag-category">{req.category}</span></td>
              <td><span className={`tag tag-urgency-${req.urgency}`}>{req.urgency}</span></td>
              <td><span className={`tag tag-status-${req.status}`}>{req.status}</span></td>
              <td style={{ textAlign: 'center' }}>{req.helpers?.length || 0}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(req._id)}>Delete</button></td>
            </tr>
          ))}</tbody></table></div>
        ) : activeTab === 'users' ? (
          <div className="table-wrapper"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Trust</th><th>Solved</th><th>Badges</th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u._id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>{u.name?.[0]}</div><span style={{ fontWeight: 700 }}>{u.name}</span>{u.isAdmin && <span className="badge-pill" style={{ fontSize: '0.68rem' }}>Admin</span>}</div></td>
              <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</td>
              <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
              <td><span style={{ fontWeight: 800, color: 'var(--accent)' }}>{u.trustScore}</span></td>
              <td style={{ textAlign: 'center' }}>{u.requestsSolved || 0}</td>
              <td>{u.badges?.map(b => <span key={b.name} title={b.name}>{b.icon}</span>)}</td>
            </tr>
          ))}</tbody></table></div>
        ) : (
          <div className="grid-2">
            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-xl)' }}>
              <span className="section-label">CATEGORIES</span>
              <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>Distribution</h4>
              {stats.topCategories?.map(cat => { const pct = stats.totalRequests > 0 ? Math.round((cat.count / stats.totalRequests) * 100) : 0; return (
                <div key={cat.name} style={{ marginBottom: '14px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{cat.name}</span><span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{cat.count} ({pct}%)</span></div><div className="trust-bar"><div className="trust-bar-fill" style={{ width: `${pct}%` }}></div></div></div>
              ); })}
            </div>
            <div style={{ padding: '24px', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-xl)' }}>
              <span className="section-label">KEY METRICS</span>
              <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>Platform health</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Solve Rate</span><span style={{ fontWeight: 800, color: 'var(--accent)' }}>{stats.totalRequests > 0 ? Math.round((stats.solvedRequests / stats.totalRequests) * 100) : 0}%</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Avg Trust Score</span><span style={{ fontWeight: 800, color: 'var(--accent)' }}>{users.length > 0 ? Math.round(users.reduce((a, u) => a + u.trustScore, 0) / users.length) : 0}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Active Helpers</span><span style={{ fontWeight: 800, color: 'var(--accent)' }}>{users.filter(u => u.helpOffered > 0).length}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div></div></div>
  );
}
