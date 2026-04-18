import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => { API.get(`/requests/${id}`).then(r => setRequest(r.data)).catch(console.error).finally(() => setLoading(false)); }, [id]);

  const handleHelp = async () => { setActionLoading('help'); try { const r = await API.put(`/requests/${id}/help`); setRequest(r.data); } catch (e) { alert(e.response?.data?.message || 'Error'); } finally { setActionLoading(''); } };
  const handleSolve = async () => { setActionLoading('solve'); try { const r = await API.put(`/requests/${id}/solve`); setRequest(r.data); } catch (e) { alert(e.response?.data?.message || 'Error'); } finally { setActionLoading(''); } };

  if (loading) return <div className="page-wrapper"><div className="page-content"><div className="loader" style={{ marginTop: '120px' }}><div className="spinner"></div></div></div></div>;
  if (!request) return <div className="page-wrapper"><div className="page-content"><div className="container" style={{ padding: '120px 0', textAlign: 'center' }}><h2>Request not found</h2><Link to="/explore" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Explore</Link></div></div></div>;

  const userId = user?.id || user?._id;
  const isAuthor = request.author?._id === userId;
  const isHelper = request.helpers?.some(h => (h._id || h) === userId);

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      {/* Dark Hero Card */}
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>REQUEST DETAIL</span>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="tag tag-category" style={{ background: 'rgba(0,139,125,0.15)' }}>{request.category}</span>
          <span className={`tag tag-urgency-${request.urgency}`} style={{ background: request.urgency === 'high' ? 'rgba(232,93,58,0.15)' : undefined }}>{request.urgency}</span>
          <span className={`tag tag-status-${request.status}`} style={{ background: 'rgba(42,157,92,0.15)' }}>{request.status}</span>
        </div>
        <h1 style={{ fontSize: '2.4rem' }}>{request.title}</h1>
        <p>{request.description?.slice(0, 120)}...</p>
      </div>

      <div className="grid-sidebar-right">
        <div>
          {/* AI Summary */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <span className="section-label">AI SUMMARY</span>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>What this request needs</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{request.aiSummary || request.description}</p>
            {request.tags?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>{request.tags.map(t => <span key={t} className="tag tag-skill">{t}</span>)}</div>}
          </div>

          {/* Helpers */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <span className="section-label">HELPERS</span>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>People offering support ({request.helpers?.length || 0})</h3>
            {request.helpers?.length > 0 ? <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{request.helpers.map(h => (
              <div key={h._id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="avatar" style={{ fontSize: '0.75rem' }}>{h.name?.[0]}{h.name?.split(' ')[1]?.[0]}</div>
                <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{h.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Trust {h.trustScore || 0}% {h.skills?.slice(0, 2).map(s => ` · ${s}`).join('')}</div></div>
              </div>
            ))}</div> : <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>No helpers yet. Be the first!</p>}
          </div>

          {/* Actions */}
          <div className="card">
            <span className="section-label">ACTIONS</span>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Take action</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {!isAuthor && !isHelper && request.status !== 'solved' && <button className="btn btn-primary" onClick={handleHelp} disabled={actionLoading === 'help'}>🤝 {actionLoading === 'help' ? 'Offering...' : 'I can help'}</button>}
              {isHelper && <span className="badge-pill" style={{ padding: '12px 20px', fontSize: '0.88rem' }}>✅ You are helping</span>}
              {(isAuthor || isHelper) && request.status !== 'solved' && <button className="btn btn-success" onClick={handleSolve} disabled={actionLoading === 'solve'}>✅ {actionLoading === 'solve' ? 'Marking...' : 'Mark as solved'}</button>}
              {request.status === 'solved' && <span className="badge-pill" style={{ padding: '12px 20px', fontSize: '0.88rem', background: 'rgba(111,66,193,0.08)', color: 'var(--solved)' }}>🎉 This request has been solved</span>}
              <Link to="/explore" className="btn btn-outline">← Back to Feed</Link>
            </div>
          </div>
        </div>

        {/* Requester Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <span className="section-label" style={{ color: 'var(--high)' }}>REQUESTER</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px', marginBottom: '16px' }}>
              <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '0.85rem' }}>{request.author?.name?.[0]}{request.author?.name?.split(' ')[1]?.[0]}</div>
              <div><div style={{ fontWeight: 800, fontSize: '1rem' }}>{request.author?.name}</div><div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{request.author?.location || 'Community'} • Trust {request.author?.trustScore || 0}%</div></div>
            </div>
          </div>
          <div className="card">
            <span className="section-label">REQUEST INFO</span>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}><span style={{ color: 'var(--text-secondary)' }}>Status</span><span className={`tag tag-status-${request.status}`}>{request.status}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}><span style={{ color: 'var(--text-secondary)' }}>Category</span><span className="tag tag-category">{request.category}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}><span style={{ color: 'var(--text-secondary)' }}>Urgency</span><span className={`tag tag-urgency-${request.urgency}`}>{request.urgency}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}><span style={{ color: 'var(--text-secondary)' }}>Created</span><span>{new Date(request.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div></div></div>
  );
}
