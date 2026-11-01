import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function Chat({ open, onClose }) {
  const { me } = useApp();
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [supportMsgs, setSupportMsgs] = useState([]);
  const [text, setText] = useState('');
  const [supText, setSupText] = useState('');
  const [supBusy, setSupBusy] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!open || tab !== 'chat') return;
    const load = () => api('getChatMessages').then(m => setMessages(m || [])).catch(() => {});
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [open, tab]);

  useEffect(() => {
    if (!open || tab !== 'support' || !me) return;
    const load = () => api('getSupportMessages', me.id).then(m => setSupportMsgs(m || [])).catch(() => {});
    load();
  }, [open, tab, me]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, supportMsgs, tab]);

  const send = async () => {
    if (!me || !text.trim()) return;
    const v = text.trim();
    setText('');
    const r = await api('sendChatMessage', me.id, me.username, v);
    if (r?.success) {
      api('getChatMessages').then(m => setMessages(m || []));
    }
  };

  const sendSupport = async () => {
    if (!me || !supText.trim() || supBusy) return;
    setSupBusy(true);
    try {
      const r = await api('sendSupportMessage', me.id, supText.trim());
      if (r?.success) {
        setSupText('');
        const m = await api('getSupportMessages', me.id);
        setSupportMsgs(m || []);
      } else {
        alert(r?.error || 'Failed to send');
      }
    } catch (e) {
      alert('Send failed');
    } finally {
      setSupBusy(false);
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
        {tab === 'support' && (
          !me ? (
            <div className="empty">Log in to contact support.</div>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <textarea
                  className="input"
                  value={supText}
                  onChange={e => setSupText(e.target.value)}
                  placeholder="Describe your issue..."
                  rows={3}
                  style={{ marginBottom: 8, resize: 'vertical' }}
                  maxLength={1000}
                />
                <button className="btn sm block" onClick={sendSupport} disabled={supBusy || !supText.trim()}>
                  {supBusy ? 'Sending...' : 'Send to Support'}
                </button>
              </div>
              <div>
                {supportMsgs.length ? supportMsgs.map((x, i) => (
                  <div key={i} className="msg" style={{ background: x.fromAdmin ? 'rgba(255,122,26,.12)' : 'var(--raised)' }}>
                    <div className="msg-main">
                      <div className="who">
                        {x.fromAdmin ? 'Admin' : 'You'}
                        <span className="ts">{x.timestamp}</span>
                      </div>
                      <div className="tx">{x.message}</div>
                    </div>
                  </div>
                )) : (
                  <p className="muted" style={{ textAlign: 'center', marginTop: 12 }}>No support messages yet.</p>
                )}
              </div>
            </>
          )
        )}
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
