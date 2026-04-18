import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', skills: user?.skills?.join(', ') || '', interests: user?.interests?.join(', ') || '', location: user?.location || '' });
  const [aiSkills, setAiSkills] = useState([]);
  const [aiAreas, setAiAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    const interests = form.interests.split(',').map(s => s.trim()).filter(Boolean);
    const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const [skillRes, areaRes] = await Promise.all([API.post('/ai/suggest-skills', { interests }), API.post('/ai/suggest-help-areas', { skills })]);
      setAiSkills(skillRes.data.skills || []); setAiAreas(areaRes.data.areas || []);
    } catch (err) { console.log('AI error:', err); }
  };

  const addSkill = (skill) => { const current = form.skills.split(',').map(s => s.trim()).filter(Boolean); if (!current.includes(skill)) setForm({ ...form, skills: [...current, skill].join(', ') }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { name: form.name, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), interests: form.interests.split(',').map(s => s.trim()).filter(Boolean), location: form.location, onboarded: true };
      const res = await API.put(`/users/${user.id || user._id}`, data);
      updateUser(res.data); navigate('/dashboard');
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>ONBOARDING</span>
        <h1>Shape your support identity with AI suggestions.</h1>
        <p>Name your strengths, interests, and location so the system can recommend where you can help.</p>
      </div>

      <div className="grid-sidebar-right">
        <div className="card">
          <span className="section-label">PROFILE SETUP</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Complete your profile</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Skills (comma separated)</label><input type="text" className="form-input" placeholder="e.g. JavaScript, React, Python" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Interests (comma separated)</label><input type="text" className="form-input" placeholder="e.g. web development, ai, data science" value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Location</label><input type="text" className="form-input" placeholder="e.g. Karachi, Pakistan" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button type="button" className="btn btn-outline" onClick={handleGetSuggestions}>🤖 Get AI Suggestions</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Complete Onboarding →'}</button>
            </div>
          </form>
        </div>
        <div className="card">
          <span className="section-label">AI SUGGESTIONS</span>
          <h3 className="card-title" style={{ marginBottom: '20px' }}>Your contribution map</h3>
          {aiSkills.length > 0 && <div style={{ marginBottom: '20px' }}><div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--accent)' }}>Skills you can help with:</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{aiSkills.map(s => <button key={s} className="badge-pill" onClick={() => addSkill(s)} style={{ cursor: 'pointer' }}>+ {s}</button>)}</div></div>}
          {aiAreas.length > 0 && <div><div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--high)' }}>Areas you may need help:</div><div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{aiAreas.map(a => <div key={a} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '8px 14px', background: 'rgba(232,93,58,0.04)', borderRadius: 'var(--radius-sm)' }}>→ {a}</div>)}</div></div>}
          {aiSkills.length === 0 && aiAreas.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>Fill in your skills & interests, then click "Get AI Suggestions"</div>}
        </div>
      </div>
    </div></div></div>
  );
}
