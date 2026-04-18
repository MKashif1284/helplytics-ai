import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({ trustScore: 0, helping: 0, openRequests: 0, aiPulse: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/requests'),
      API.get('/notifications'),
      API.get('/ai/recommendations').catch(() => ({ data: [] })),
      API.get('/ai/trends').catch(() => ({ data: {} }))
    ]).then(([reqRes, notifRes, recRes, trendRes]) => {
      setRequests(reqRes.data.slice(0, 5));
      setNotifications(notifRes.data.slice(0, 5));
      setRecommendations(recRes.data.slice(0, 3));
      const userId = user?.id || user?._id;
      const helping = reqRes.data.filter(r => r.helpers?.some(h => (h._id || h) === userId)).length;
      setStats({ trustScore: user?.trustScore || 0, helping, openRequests: reqRes.data.filter(r => r.status === 'open').length, aiPulse: trendRes.data.recentActivity || 0 });
    }).catch(console.error);
  }, [user]);

  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      {/* Dark Hero Card */}
      <div className="page-hero-card">
        <span className="section-label">DASHBOARD</span>
        <h1>Welcome back, {user?.name || 'User'}.</h1>
        <p>Your command center for requests, AI insights, helper momentum, and live community activity.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card"><div className="stat-card-label teal">TRUST SCORE</div><div className="stat-card-value">{stats.trustScore}%</div><div className="stat-card-desc">Driven by solved requests and consistent support.</div></div>
        <div className="stat-card"><div className="stat-card-label orange">HELPING</div><div className="stat-card-value">{stats.helping}</div><div className="stat-card-desc">Requests where you are currently listed as a helper.</div></div>
        <div className="stat-card"><div className="stat-card-label green">OPEN REQUESTS</div><div className="stat-card-value">{stats.openRequests}</div><div className="stat-card-desc">Community requests currently active across the feed.</div></div>
        <div className="stat-card"><div className="stat-card-label purple">AI PULSE</div><div className="stat-card-value">{stats.aiPulse} trends</div><div className="stat-card-desc">Trend count detected in the latest request activity.</div></div>
      </div>

      {/* Content Grid */}
      <div className="grid-sidebar-right">
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <span className="section-label">RECENT REQUESTS</span>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>What the community needs right now</h3>
            {requests.length > 0 ? requests.map(req => (
              <Link to={`/request/${req._id}`} key={req._id} style={{ display: 'block', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{req.title}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span className={`tag tag-urgency-${req.urgency}`}>{req.urgency}</span>
                      <span className="tag tag-category">{req.category}</span>
                      <span className={`tag tag-status-${req.status}`}>{req.status}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{timeAgo(req.createdAt)}</span>
                </div>
              </Link>
            )) : <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">No requests yet</div></div>}
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <span className="section-label">AI INSIGHTS</span>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Suggested actions</h3>
            {recommendations.length > 0 ? recommendations.map((rec, i) => (
              <Link to={`/request/${rec._id}`} key={rec._id || i} style={{ display: 'block', padding: '12px 16px', marginBottom: '8px', background: 'rgba(0,139,125,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '3px' }}>{rec.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{rec.category} · {rec.urgency} urgency</div>
              </Link>
            )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>AI recommendations loading...</p>}
          </div>
          <div className="card">
            <span className="section-label">NOTIFICATIONS</span>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Latest updates</h3>
            {notifications.length > 0 ? notifications.map(n => (
              <div key={n._id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                <div className={`notification-icon ${n.type === 'help_offered' ? 'help' : n.type === 'solved' ? 'solved' : n.type === 'badge_earned' ? 'badge' : 'system'}`}>
                  {n.type === 'help_offered' ? '🤝' : n.type === 'solved' ? '✅' : n.type === 'badge_earned' ? '🏅' : '🔔'}
                </div>
                <div className="notification-content"><div className="notification-title">{n.title}</div><div className="notification-message">{n.message}</div><div className="notification-time">{timeAgo(n.createdAt)}</div></div>
              </div>
            )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>No notifications yet</p>}
          </div>
        </div>
      </div>
    </div></div></div>
  );
}
