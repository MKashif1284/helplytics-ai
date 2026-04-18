import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', skills: '', interests: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    API.get(`/users/${userId}`).then(u => {
      setProfile(u.data);
      setForm({ name: u.data.name || '', bio: u.data.bio || '', skills: u.data.skills?.join(', ') || '', interests: u.data.interests?.join(', ') || '', location: u.data.location || '' });
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    try {
      const userId = user?.id || user?._id;
      const res = await API.put(`/users/${userId}`, { name: form.name, bio: form.bio, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), interests: form.interests.split(',').map(s => s.trim()).filter(Boolean), location: form.location });
      setProfile(res.data); updateUser(res.data);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="page-wrapper"><div className="page-content"><div className="loader" style={{ marginTop: '120px' }}><div className="spinner"></div></div></div></div>;

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      {/* Dark Hero Card */}
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>PROFILE</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '4px' }}>{profile?.name}</h1>
        <p>{profile?.role === 'needHelp' ? 'Need Help' : profile?.role === 'canHelp' ? 'Can Help' : 'Both'}{profile?.location && ` • ${profile.location}`}</p>
      </div>

      <div className="grid-sidebar-right">
        {/* Public Profile */}
        <div className="card">
          <span className="section-label">PUBLIC PROFILE</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Skills and reputation</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.92rem' }}>Trust score</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent)' }}>{profile?.trustScore || 0}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.92rem' }}>Contributions</span>
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>{(profile?.requestsCreated || 0) + (profile?.requestsSolved || 0) + (profile?.helpOffered || 0)}</span>
          </div>

          {profile?.skills?.length > 0 && <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.92rem', marginBottom: '10px' }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{profile.skills.map(s => <span key={s} className="tag tag-category">{s}</span>)}</div>
          </div>}

          {profile?.badges?.length > 0 && <div style={{ padding: '16px 0' }}>
            <div style={{ fontSize: '0.92rem', marginBottom: '10px' }}>Badges</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{profile.badges.map(b => <span key={b.name} className="badge-pill" style={{ padding: '8px 16px' }}>{b.icon} {b.name}</span>)}</div>
          </div>}
        </div>

        {/* Edit Profile */}
        <div className="card">
          <span className="section-label" style={{ color: 'var(--high)' }}>EDIT PROFILE</span>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Update your identity</h3>

          <div className="grid-2">
            <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Location</label><input type="text" className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..." /></div>
          <div className="form-group"><label className="form-label">Skills (comma separated)</label><input type="text" className="form-input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Interests (comma separated)</label><input type="text" className="form-input" value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>Save profile</button>
        </div>
      </div>
    </div></div></div>
  );
}
