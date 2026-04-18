import { useState, useEffect } from 'react';
import API from '../api';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/users/leaderboard').then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      {/* Dark Hero Card */}
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>LEADERBOARD</span>
        <h1>Recognize the people who keep the community moving.</h1>
        <p>Trust score, contribution count, and badges create visible momentum for reliable helpers.</p>
      </div>

      <div className="grid-sidebar-right">
        <div className="card">
          <span className="section-label">TOP HELPERS</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Rankings</h3>
          {loading ? <div className="loader"><div className="spinner"></div></div> : users.map((u, i) => (
            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 0', borderBottom: i < users.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              <span className={`rank-number ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>#{i + 1}</span>
              <div className="avatar" style={{ background: i === 0 ? '#e6b800' : i === 1 ? '#a0a0a0' : i === 2 ? '#cd7f32' : 'var(--accent)' }}>{u.name?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>{u.name}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {u.badges?.map(b => <span key={b.name} style={{ fontSize: '0.95rem' }} title={b.name}>{b.icon}</span>)}
                  {u.skills?.slice(0, 3).map(s => <span key={s} className="tag tag-skill" style={{ padding: '3px 10px', fontSize: '0.72rem' }}>{s}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--accent)' }}>{u.trustScore}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>trust score</div></div>
              <div style={{ textAlign: 'right', minWidth: '50px' }}><div style={{ fontWeight: 800, fontSize: '1rem' }}>{u.requestsSolved || 0}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>solved</div></div>
            </div>
          ))}
        </div>
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <span className="section-label">BADGE SYSTEM</span>
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Trust and achievement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'First Solve', icon: '🏅', desc: 'Solved your first community request' },
                { name: 'Helpful Hand', icon: '🤝', desc: 'Offered help on 5+ requests' },
                { name: 'Trusted Member', icon: '⭐', desc: 'Reached 50+ trust score' },
                { name: 'Problem Solver', icon: '🧩', desc: 'Solved 10+ requests' },
                { name: 'Community Leader', icon: '👑', desc: 'Reached 100+ trust score' },
                { name: 'Mentor', icon: '🎓', desc: 'Consistently helping others learn' }
              ].map(badge => (
                <div key={badge.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-lg)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{badge.icon}</span>
                  <div><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{badge.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{badge.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <span className="section-label">TRUST SCORE</span>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>How it works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>✅ Help solve a request → +10</span>
              <span>🤝 Offer help on requests → +2</span>
              <span>📝 Create quality requests → +1</span>
            </div>
          </div>
        </div>
      </div>
    </div></div></div>
  );
}
