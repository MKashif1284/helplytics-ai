import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const msgEndRef = useRef(null);
  const userId = user?.id || user?._id;

  useEffect(() => {
    API.get('/messages/conversations').then(r => { setConversations(r.data); if (r.data.length > 0) setActiveChat(r.data[0].partner); }).catch(() => {});
    API.get('/users').then(r => setAllUsers(r.data.filter(u => u._id !== userId))).catch(() => {});
  }, [userId]);

  useEffect(() => { if (activeChat) API.get(`/messages/${activeChat._id}`).then(r => setMessages(r.data)).catch(() => {}); }, [activeChat]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault(); if (!newMessage.trim() || !activeChat) return;
    try { const r = await API.post('/messages', { to: activeChat._id, content: newMessage }); setMessages(p => [...p, r.data]); setNewMessage(''); }
    catch (err) { console.error(err); }
  };

  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };

  return (
    <div className="page-wrapper"><div className="page-content"><div className="container">
      <div className="page-hero-card">
        <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>MESSAGES</span>
        <h1>Keep support moving through direct communication.</h1>
        <p>Basic messaging gives helpers and requesters a clear follow-up path.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', minHeight: '500px' }}>
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <span className="section-label">CONVERSATIONS</span>
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Recent chats</h3>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {conversations.map(conv => (
              <div key={conv.partner._id} className={`conversation-item ${activeChat?._id === conv.partner._id ? 'active' : ''}`} onClick={() => setActiveChat(conv.partner)}>
                <div className="avatar">{conv.partner.name?.[0]}</div>
                <div className="conversation-preview"><div className="conversation-name">{conv.partner.name}</div><div className="conversation-last-msg">{conv.lastMessage?.content}</div></div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: '8px', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', padding: '4px 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Start new</div>
              {allUsers.slice(0, 5).map(u => (
                <div key={u._id} className="conversation-item" onClick={() => setActiveChat(u)}>
                  <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.72rem' }}>{u.name?.[0]}</div>
                  <div className="conversation-name" style={{ fontSize: '0.85rem' }}>{u.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeChat ? (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="avatar">{activeChat.name?.[0]}</div>
              <div><div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeChat.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Online</div></div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map(msg => (
                <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: (msg.from?._id || msg.from) === userId ? 'flex-end' : 'flex-start' }}>
                  <div className={`message-bubble ${(msg.from?._id || msg.from) === userId ? 'sent' : 'received'}`}>{msg.content}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', padding: '2px 4px' }}>{timeAgo(msg.createdAt)}</span>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <input type="text" className="form-input" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </>) : <div className="empty-state"><div className="empty-state-icon">💬</div><div className="empty-state-text">Select a conversation</div></div>}
        </div>
      </div>
    </div></div></div>
  );
}
