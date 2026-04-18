import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api';

export default function Landing() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ members: 847, requests: 312, solved: 198 });

  useEffect(() => {
    API.get('/requests').then(res => {
      setRequests(res.data.slice(0, 3));
      const total = res.data.length;
      const solved = res.data.filter(r => r.status === 'solved').length;
      if (total > 0) setStats({ members: 847, requests: total, solved });
    }).catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="container">
          {/* Hero — 2 Column */}
          <div className="landing-hero">
            <div className="landing-hero-left">
              <span className="section-label" style={{ color: 'var(--accent)' }}>SMIT GRAND CODING NIGHT 2026</span>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08, margin: '12px 0 20px', color: 'var(--text-primary)' }}>
                Find help faster. Become help that matters.
              </h1>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '480px' }}>
                HelpHub AI is a community-powered support network for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <Link to="/dashboard" className="btn btn-primary btn-lg">Open product demo</Link>
                <Link to="/create-request" className="btn btn-outline btn-lg">Post a request</Link>
              </div>
            </div>
            <div className="landing-hero-right">
              <div className="golden-circle"></div>
              <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>LIVE PRODUCT FEEL</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '8px 0 20px', color: 'white' }}>
                More than a form. More like an ecosystem.
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '28px' }}>
                A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS, JavaScript, and LocalStorage.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>AI request intelligence</div>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card animate-in">
              <div className="stat-card-label teal">MEMBERS</div>
              <div className="stat-card-value">{stats.members}</div>
              <div className="stat-card-desc">Students, mentors, and helpers in the loop.</div>
            </div>
            <div className="stat-card animate-in animate-in-delay-1">
              <div className="stat-card-label orange">REQUESTS</div>
              <div className="stat-card-value">{stats.requests}</div>
              <div className="stat-card-desc">Support posts shared across learning journeys.</div>
            </div>
            <div className="stat-card animate-in animate-in-delay-2">
              <div className="stat-card-label green">SOLVED</div>
              <div className="stat-card-value">{stats.solved}</div>
              <div className="stat-card-desc">Problems resolved through fast community action.</div>
            </div>
          </div>

          {/* Core Flow */}
          <div style={{ marginBottom: '16px' }}><span className="section-label">CORE FLOW</span></div>
          <div style={{ marginBottom: '40px' }}>
            <h2 className="section-title">From struggling alone to solving together</h2>
          </div>
          <div className="grid-3" style={{ marginBottom: '48px' }}>
            <div className="card">
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>Ask for help clearly</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.</p>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>Discover the right people</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.</p>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>Track real contribution</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.</p>
            </div>
          </div>

          {/* Featured Requests */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-label">FEATURED REQUESTS</span>
              <h2 className="section-title">Community problems currently in motion</h2>
            </div>
            <Link to="/explore" className="btn btn-outline">View full feed</Link>
          </div>
          <div className="grid-3" style={{ marginBottom: '48px' }}>
            {requests.length > 0 ? requests.map(req => (
              <Link to={`/request/${req._id}`} key={req._id} className="request-card">
                <div className="request-card-tags">
                  <span className="tag tag-category">{req.category}</span>
                  <span className={`tag tag-urgency-${req.urgency}`}>{req.urgency}</span>
                  <span className={`tag tag-status-${req.status}`}>{req.status}</span>
                </div>
                <h3 className="request-card-title">{req.title}</h3>
                <p className="request-card-desc">{req.description}</p>
                <div className="request-card-skill-tags">
                  {req.tags?.slice(0, 3).map(t => <span key={t} className="tag tag-skill">{t}</span>)}
                </div>
                <div className="request-card-footer">
                  <div className="request-card-author">
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{req.author?.name}</span>
                  </div>
                  <div className="request-card-meta">
                    <span>{req.author?.location || 'Community'} • {req.helpers?.length || 0} helper interested</span>
                  </div>
                </div>
              </Link>
            )) : [1, 2, 3].map(i => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
                <p style={{ color: 'var(--text-tertiary)' }}>Sample request #{i}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ padding: '40px 0', textAlign: 'center' }}>
          <div className="container">
            <div className="nav-brand" style={{ justifyContent: 'center', marginBottom: '16px' }}>
              <span className="nav-brand-icon">H</span>HelpHub AI
            </div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Built for SMIT Grand Coding Night 2026 · Community Support Platform</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
