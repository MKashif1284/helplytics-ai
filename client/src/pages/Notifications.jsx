import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { API.get('/notifications').then(r => setNotifications(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  const markAsRead = async (id) => { try { await API.put(`/notifications/${id}/read`); setNotifications(p => p.map(n => n._id === id ? { ...n, read: true } : n)); } catch (e) { console.error(e); } };
  const markAllRead = async () => { try { await API.put('/notifications/read-all'); setNotifications(p => p.map(n => ({ ...n, read: true }))); } catch (e) { console.error(e); } };
  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };

  const typeIcon = { new_request: '📋', help_offered: '🤝', solved: '✅', badge_earned: '🏅', message: '💬', system: '🔔' };
  const typeClass = { new_request: 'system', help_offered: 'help', solved: 'solved', badge_earned: 'badge', message: 'help', system: 'system' };
  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>NOTIFICATIONS</span>
        <h1>Stay updated on requests, helpers, and trust signals.</h1>
        <p>Track new matches, solved items, AI insights, and reputation changes.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div><span className="section-label">LIVE UPDATES</span><h3 className="card-title">Notification feed{unreadCount > 0 && ` · ${unreadCount} unread`}</h3></div>
          {unreadCount > 0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>}
        </div>
        <div className="tabs">
          {[{ key: 'all', label: 'All' }, { key: 'help_offered', label: 'Help' }, { key: 'solved', label: 'Solved' }, { key: 'new_request', label: 'Requests' }, { key: 'badge_earned', label: 'Badges' }].map(tab => (
            <button key={tab.key} className={`tab ${filter === tab.key ? 'active' : ''}`} onClick={() => setFilter(tab.key)}>{tab.label}</button>
          ))}
        </div>
        {loading ? <div className="loader"><div className="spinner"></div></div> : filtered.length > 0 ? filtered.map(n => (
          <div key={n._id} className={`notification-item ${!n.read ? 'unread' : ''}`} onClick={() => markAsRead(n._id)}>
            <div className={`notification-icon ${typeClass[n.type] || 'system'}`}>{typeIcon[n.type] || '🔔'}</div>
            <div className="notification-content"><div className="notification-title">{n.title}</div><div className="notification-message">{n.message}</div><div className="notification-time">{timeAgo(n.createdAt)}</div></div>
            {n.relatedRequest && <Link to={`/request/${n.relatedRequest._id || n.relatedRequest}`} className="btn btn-outline btn-sm" onClick={e => e.stopPropagation()}>View</Link>}
          </div>
        )) : <div className="empty-state"><div className="empty-state-icon">🔔</div><div className="empty-state-text">No notifications yet</div></div>}
      </div>
    </div></div></div>
  );
}
