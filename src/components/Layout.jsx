import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Chat from './Chat';
import { api } from '../utils/api';

const SITE_LOGO = 'https://i.postimg.cc/0j2KJMXM/Screenshot-2026-10-29-at-6-20-50-PM-removebg-preview.png';

export default function Layout({ children }) {
  const { me, clearUser, ticker, setTicker } = useApp();
  const navigate = useNavigate();
  const [chatOn, setChatOn] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const fav = document.createElement('link');
    fav.rel = 'icon';
    fav.href = SITE_LOGO;
    document.head.appendChild(fav);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      api('getActivityTicker', 25).then(setTicker).catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, [setTicker]);

  const logout = () => {
    clearUser();
    try { localStorage.removeItem('gpt_token_v2'); } catch {}
    window.location.href = '/#/';
  };

  return (
    <>
      <div className="bg" aria-hidden="true" />
      <header className="topnav">
        <div className="brand">
          <img data-logo alt="01GH" src={SITE_LOGO} />
        </div>
        <nav className="tn-links">
          <NavLink to="/earn" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            <i className="fas fa-hand-holding-dollar" /><span>Earn</span>
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            <i className="fas fa-bag-shopping" /><span>Rewards</span>
          </NavLink>
          <NavLink to="/leaders" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            <i className="fas fa-trophy" /><span>Leaders</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            <i className="fas fa-user" /><span>Profile</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            <i className="fas fa-circle-question" /><span>Help</span>
          </NavLink>
          {me?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-btn admin${isActive ? ' active' : ''}`}>
              <i className="fas fa-shield-halved" /><span>Admin</span>
            </NavLink>
          )}
          <button className="nav-btn" onClick={() => setChatOn(v => !v)}>
            <i className="fas fa-comments" /><span>Chat</span>
          </button>
        </nav>
        <div className="tn-right desktop-only">
          <div className="pill" title="Your diamonds">
            <i className="fas fa-gem" /><span>{me ? (me.diamonds || 0).toLocaleString() : '0'}</span>
          </div>
          {me ? (
            <>
              <div style={{ position: 'relative' }}>
                <button className="btn light sm" onClick={() => setUserMenu(v => !v)}>
                  <span className="mini-av">{me.username.charAt(0).toUpperCase()}</span>
                  {me.username}
                </button>
                {userMenu && (
                  <div className="user-dd">
                    <div className="dd-lab">On hold</div>
                    <div className="dd-val"><i className="fas fa-lock" /> {(me.holdBalance || 0).toLocaleString()}</div>
                    <div className="dd-note">Releases after 30 days</div>
                    <hr />
                    <button className="btn light sm block" onClick={() => { setUserMenu(false); navigate('/profile'); }}>Profile</button>
                  </div>
                )}
              </div>
              <button type="button" className="btn light sm" onClick={() => {
                try { localStorage.clear(); } catch {}
                try { sessionStorage.clear(); } catch {}
                document.cookie = 'logged_out=1; Max-Age=10; path=/';
                window.location.href = '/';
              }}>Logout</button>
            </>
          ) : (
            <button className="btn light sm" onClick={() => document.getElementById('auth-trigger')?.click()}>
              <i className="fas fa-right-to-bracket" /> Log in
            </button>
          )}
        </div>
      </header>

      {/* Mobile bar under header — logo is in header, this is the row under it */}
      <div className="mobile-bar">
        {me ? (
          <>
            <div style={{ position: 'relative' }}>
              <button className="btn light sm" onClick={() => setUserMenu(v => !v)} style={{ padding: '6px 8px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10 }}>
                <span className="mini-av">{me.username.charAt(0).toUpperCase()}</span>
              </button>
              {userMenu && (
                <div className="user-dd" style={{ left: 0, right: 'auto' }}>
                  <div className="dd-lab">On hold</div>
                  <div className="dd-val"><i className="fas fa-lock" /> {(me.holdBalance || 0).toLocaleString()}</div>
                  <div className="dd-note">Releases after 30 days</div>
                  <hr />
                  <button className="btn light sm block" onClick={() => { setUserMenu(false); navigate('/profile'); }}>Profile</button>
                </div>
              )}
            </div>
            <div className="pill" style={{ padding: '6px 12px' }}>
              <i className="fas fa-gem" /><span>{(me.diamonds || 0).toLocaleString()}</span>
            </div>
            <button type="button" className="btn light sm" onClick={() => {
              try { localStorage.clear(); } catch {}
              try { sessionStorage.clear(); } catch {}
              document.cookie = 'logged_out=1; Max-Age=10; path=/';
              window.location.href = '/';
            }} style={{ padding: '8px 10px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10 }}>
              <i className="fas fa-right-from-bracket" />
            </button>
          </>
        ) : (
          <button className="btn light sm" onClick={() => document.getElementById('auth-trigger')?.click()}>Log in</button>
        )}
      </div>

      {ticker && ticker.length > 0 && (
        <div className="ticker">
          <div className="ticker-track">
            {ticker.concat(ticker).map((t, i) => (
              <div key={i} className="tk">
                <span className="tk-av">{(t.username || '?').charAt(0).toUpperCase()}</span>
                <span className="tk-name">{t.username}</span>
                <span className="tk-amt">{t.detail || t.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="app">
        <main className="main">
          {children}
          <footer className="site-footer">
            <div className="links">
              <NavLink to="/tos">Terms of Service</NavLink>
              <NavLink to="/privacy">Privacy Policy</NavLink>
              <NavLink to="/help">Help</NavLink>
            </div>
            <p className="copy">© {new Date().getFullYear()} 01GH. All rights reserved.</p>
            <p className="note">Diamonds have no cash value until a reward is approved and paid. Offerwalls are operated by third-party networks.</p>
          </footer>
        </main>
      </div>

      <nav className="dock">
        <NavLink to="/earn" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-hand-holding-dollar" />Earn
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-bag-shopping" />Rewards
        </NavLink>
        <NavLink to="/leaders" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-trophy" />Leaders
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-user" />Profile
        </NavLink>
        <NavLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-circle-question" />Help
        </NavLink>
        {me?.isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fas fa-shield-halved" />Admin
          </NavLink>
        )}
        <button onClick={() => setChatOn(v => !v)}>
          <i className="fas fa-comments" />Chat
        </button>
      </nav>

      <Chat open={chatOn} onClose={() => setChatOn(false)} />
    </>
  );
}
