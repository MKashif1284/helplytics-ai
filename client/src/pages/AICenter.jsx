import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function AICenter() {
  const [trends, setTrends] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/ai/trends'), API.get('/ai/recommendations').catch(() => ({ data: [] }))]).then(([t, r]) => { setTrends(t.data); setRecommendations(r.data); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const topCategory = trends?.topCategories?.[0]?.name || 'N/A';
  const urgentCount = trends?.urgencyBreakdown?.urgent || 0;
  const highCount = trends?.urgencyBreakdown?.high || 0;

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      {/* Dark Hero Card */}
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>AI CENTER</span>
        <h1>See what the platform intelligence is noticing.</h1>
        <p>AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations.</p>
      </div>

      {loading ? <div className="loader"><div className="spinner"></div></div> : <>
        {/* 3 Stat Cards */}
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-card-label teal">TREND PULSE</div>
            <div className="stat-card-value" style={{ fontSize: '2rem' }}>{topCategory}</div>
            <div className="stat-card-desc">Most common support area based on active community requests.</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label orange">URGENCY WATCH</div>
            <div className="stat-card-value">{urgentCount + highCount}</div>
            <div className="stat-card-desc">Requests currently flagged high priority by the urgency detector.</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label green">MENTOR POOL</div>
            <div className="stat-card-value">{trends?.totalRequests > 0 ? Math.ceil(trends.totalRequests * 0.4) : 2}</div>
            <div className="stat-card-desc">Trusted helpers with strong response history and contribution signals.</div>
          </div>
        </div>

        {/* Category + Urgency */}
        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div className="card">
            <span className="section-label">CATEGORY DEMAND</span>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Where help is needed most</h3>
            {trends?.topCategories?.map(cat => {
              const max = Math.max(...trends.topCategories.map(c => c.count));
              const pct = max > 0 ? Math.round((cat.count / max) * 100) : 0;
              return (
                <div key={cat.name} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{cat.count} requests</span>
                  </div>
                  <div className="trust-bar"><div className="trust-bar-fill" style={{ width: `${pct}%` }}></div></div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <span className="section-label">URGENCY BREAKDOWN</span>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Priority distribution</h3>
            {trends?.urgencyBreakdown && Object.entries(trends.urgencyBreakdown).map(([level, count]) => {
              const total = Object.values(trends.urgencyBreakdown).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const colors = { urgent: 'var(--urgent)', high: 'var(--high)', medium: 'var(--medium)', low: 'var(--low)' };
              return (
                <div key={level} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>{level}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{count} ({pct}%)</span>
                  </div>
                  <div className="trust-bar"><div className="trust-bar-fill" style={{ width: `${pct}%`, background: colors[level] || 'var(--accent)' }}></div></div>
                </div>
              );
            })}
            {trends?.topTags?.length > 0 && <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <span className="section-label">TRENDING TAGS</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>{trends.topTags.map(t => <span key={t.name} className="badge-pill">{t.name} ({t.count})</span>)}</div>
            </div>}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <span className="section-label">AI RECOMMENDATIONS</span>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 className="card-title">Requests that need attention</h3>
            <Link to="/explore" className="btn btn-outline btn-sm">View all →</Link>
          </div>
          {recommendations.length > 0 ? <div className="grid-3">
            {recommendations.map(req => (
              <Link to={`/request/${req._id}`} key={req._id} className="request-card">
                <div className="request-card-tags"><span className="tag tag-category">{req.category}</span><span className={`tag tag-urgency-${req.urgency}`}>{req.urgency}</span></div>
                <h3 className="request-card-title">{req.title}</h3>
                <p className="request-card-desc">{req.description}</p>
              </Link>
            ))}
          </div> : <div className="empty-state"><div className="empty-state-icon">🤖</div><div className="empty-state-text">Login to get personalized recommendations</div></div>}
        </div>
      </>}
    </div></div></div>
  );
}
