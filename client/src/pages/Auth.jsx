import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'both' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isLogin) { const data = await login(form.email, form.password); navigate(data.user.onboarded ? '/dashboard' : '/onboarding'); }
      else { await register(form.name, form.email, form.password, form.role); navigate('/onboarding'); }
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>AUTHENTICATION</span>
        <h1>Enter the support network.</h1>
        <p>Choose a demo identity, set your role, and jump into a multi-page product flow.</p>
      </div>

      <div className="grid-sidebar-right">
        <div className="card">
          <span className="section-label">COMMUNITY ACCESS</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Why join HelpHub AI?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🎯', title: 'Role-based entry', desc: 'Need Help, Can Help, or Both' },
              { icon: '🚀', title: 'Direct path', desc: 'Dashboard, requests, AI Center, and community feed' },
              { icon: '💾', title: 'Persistent session', desc: 'Your data stays with MongoDB + JWT' },
              { icon: '🤖', title: 'AI-powered matching', desc: 'Smart suggestions based on your skills' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                <div><div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '2px' }}>{item.title}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <span className="section-label" style={{ color: 'var(--high)' }}>LOGIN / SIGNUP</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Authenticate</h3>

          <div className="tabs" style={{ marginBottom: '24px' }}>
            <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
            <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>

          {error && <div style={{ padding: '12px 16px', background: 'rgba(220,53,69,0.06)', borderRadius: 'var(--radius-md)', color: 'var(--urgent)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>}
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
            {!isLogin && <div className="form-group"><label className="form-label">Role</label><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{[{ v: 'needHelp', l: '🙋 Need Help' }, { v: 'canHelp', l: '🤝 Can Help' }, { v: 'both', l: '🔄 Both' }].map(r => <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })} className={form.role === r.v ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>{r.l}</button>)}</div></div>}
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>{loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}</button>
          </form>

          {isLogin && <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,139,125,0.04)', borderRadius: 'var(--radius-lg)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--accent)' }}>Demo:</strong> ahmed@helplytics.com / password123</div>}
        </div>
      </div>
    </div></div></div>
  );
}
