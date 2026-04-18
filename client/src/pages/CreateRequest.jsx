import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', urgency: '', tags: '' });
  const [ai, setAi] = useState({ category: '', urgency: '', tags: [], rewrite: '' });
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!form.title && !form.description) return; setAnalyzing(true);
    try {
      const [c, u, t, r] = await Promise.all([API.post('/ai/categorize', { title: form.title, description: form.description }), API.post('/ai/urgency', { title: form.title, description: form.description }), API.post('/ai/tags', { title: form.title, description: form.description }), API.post('/ai/rewrite', { description: form.description })]);
      setAi({ category: c.data.category, urgency: u.data.urgency, tags: t.data.tags, rewrite: r.data.rewritten });
    } catch (err) { console.error(err); } finally { setAnalyzing(false); }
  };

  const apply = (field, value) => { if (field === 'tags') setForm({ ...form, tags: value.join(', ') }); else setForm({ ...form, [field]: value }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { title: form.title, description: form.description, category: form.category || ai.category || 'General', urgency: form.urgency || ai.urgency || 'medium', tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : ai.tags };
      const res = await API.post('/requests', data); navigate(`/request/${res.data._id}`);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const categories = ['Academic', 'Technical', 'Career', 'Creative', 'Wellness', 'Finance', 'Project', 'General'];

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>CREATE REQUEST</span>
        <h1>Turn a rough problem into a clear help request.</h1>
        <p>Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite.</p>
      </div>

      <div className="grid-sidebar-right">
        <div className="card">
          <span className="section-label">REQUEST FORM</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Describe your problem</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" placeholder="What do you need help with?" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe your problem in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={6} required /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="">Auto-detect by AI</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Urgency</label><select className="form-select" value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}><option value="">Auto-detect by AI</option>{['low', 'medium', 'high', 'urgent'].map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}</select></div>
            </div>
            <div className="form-group"><label className="form-label">Tags (comma separated)</label><input type="text" className="form-input" placeholder="e.g. react, javascript, debugging" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button type="button" className="btn btn-outline" onClick={handleAnalyze} disabled={analyzing}>🤖 {analyzing ? 'Analyzing...' : 'Get AI Suggestions'}</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Publishing...' : 'Publish Request'}</button>
            </div>
          </form>
        </div>
        <div className="card">
          <span className="section-label">AI ASSISTANT</span>
          <h3 className="card-title" style={{ marginBottom: '20px' }}>Smart guidance</h3>
          {ai.category ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px', background: 'rgba(0,139,125,0.04)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className="tag tag-category">{ai.category}</span><button className="btn btn-ghost btn-sm" onClick={() => apply('category', ai.category)}>Apply</button></div>
              </div>
              <div style={{ padding: '14px', background: 'rgba(0,139,125,0.04)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Urgency</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className={`tag tag-urgency-${ai.urgency}`}>{ai.urgency}</span><button className="btn btn-ghost btn-sm" onClick={() => apply('urgency', ai.urgency)}>Apply</button></div>
              </div>
              {ai.tags.length > 0 && <div style={{ padding: '14px', background: 'rgba(0,139,125,0.04)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>{ai.tags.map(t => <span key={t} className="badge-pill">{t}</span>)}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => apply('tags', ai.tags)}>Apply all</button>
              </div>}
              {ai.rewrite && <div style={{ padding: '14px', background: 'rgba(0,139,125,0.04)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rewrite</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '10px' }}>{ai.rewrite}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setForm({ ...form, description: ai.rewrite })}>Use rewrite</button>
              </div>}
            </div>
          ) : <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>Write your title & description, then click "Get AI Suggestions"</div>}
        </div>
      </div>
    </div></div></div>
  );
}
