import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function Chat({ open, onClose }) {
  const { me } = useApp();
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!open || tab !== 'chat') return;
    const load = () => api('getChatMessages').then(m => setMessages(m || [])).catch(() => {});
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [open, tab]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!me || !text.trim()) return;
    const v = text.trim();
    setText('');
    const r = await api('sendChatMessage', me.id, me.username, v);
    if (r?.success) {
      api('getChatMessages').then(m => setMessages(m || []));
    }
  };

  if (!open) return null;

  return (
    <section className="chat on">
      <div className="chat-h">
        <div className="chat-tabs">
          <button className={`chat-tab${tab === 'chat' ? ' active' : ''}`} onClick={() => setTab('chat')}>Chat</button>
          <button className={`chat-tab${tab === 'rules' ? ' active' : ''}`} onClick={() => setTab('rules')}>Rules</button>
          <button className={`chat-tab${tab === 'support' ? ' active' : ''}`} onClick={() => setTab('support')}>Support</button>
        </div>
        <button className="x" onClick={onClose}><i className="fas fa-xmark" /></button>
      </div>
      <div className="chat-body" ref={bodyRef}>
        {tab === 'chat' && (
          messages.length ? messages.map((x, i) => (
            <div key={i} className={`msg${me && x.username === me.username ? ' mine' : ''}`}>
              <div className="msg-av" style={{ background: `hsl(${Math.abs(x.username.charCodeAt(0) * 10) % 360},60%,45%)` }}>
                {(x.username || '?').charAt(0).toUpperCase()}
              </div>
              <div className="msg-main">
                <div className="who">{x.username}<span className="ts">{x.timestamp}</span></div>
                <div className="tx">{x.message}</div>
              </div>
            </div>
          )) : <div className="empty">No messages yet.</div>
        )}
        {tab === 'rules' && (
          <div className="card" style={{ margin: 0 }}>
            <h3>Chat Rules</h3>
            <ul><li>Be respectful</li><li>No spam or advertising</li><li>No harassment</li><li>English preferred</li></ul>
          </div>
        )}
        {tab === 'support' && <div className="muted">Support form coming soon (use the original for full support).</div>}
      </div>
      {tab === 'chat' && (
        <div className="chat-in">
          <input className="input" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." maxLength={500} />
          <button className="btn sm" onClick={send}><i className="fas fa-paper-plane" /></button>
        </div>
      )}
    </section>
  );
}
