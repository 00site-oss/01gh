import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import AuthModal from '../components/AuthModal';
import DailyModal from '../components/DailyModal';

function Landing({ board, walls, shop }) {
  const top = board && board[0] ? board[0].diamonds.toLocaleString() : '0';
  return (
    <section className="land">
      <h1 className="land-h">Turn spare time into <span>real rewards</span></h1>
      <p className="land-p">Finish offers and surveys, collect diamonds, then cash out to crypto, PayPal or gift cards.</p>
      <div className="lt-grid">
        <button className="lt" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <div className="lt-t">Take <span>Surveys</span></div>
          <div className="lt-i"><i className="fas fa-clipboard-list" /><i className="fas fa-chart-simple" /></div>
        </button>
        <button className="lt" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <div className="lt-t">Try <span>Apps</span></div>
          <div className="lt-i"><i className="fas fa-cloud-arrow-down" /><i className="fas fa-mobile-screen" /></div>
        </button>
        <button className="lt" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <div className="lt-t">Play <span>Games</span></div>
          <div className="lt-i"><i className="fas fa-keyboard" /><i className="fas fa-computer-mouse" /></div>
        </button>
      </div>
      <div className="lt-sep">— and cash out as —</div>
      <div className="lt-grid">
        <button className="lt" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <div className="lt-t">Crypto <span>Coins</span></div>
          <div className="lt-i"><i className="fa-brands fa-bitcoin" /><i className="fa-brands fa-ethereum" /></div>
        </button>
        <button className="lt" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <div className="lt-t">PayPal <span>Cash</span></div>
          <div className="lt-i"><i className="fa-brands fa-paypal" /><i className="fas fa-money-bill-wave" /></div>
        </button>
        <button className="lt" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <div className="lt-t">Gift <span>Cards</span></div>
          <div className="lt-i"><i className="fas fa-gift" /><i className="fas fa-credit-card" /></div>
        </button>
      </div>
      <div className="ls-grid">
        <div className="ls"><div className="ls-t">Offer <span>Walls</span></div><div className="ls-v"><i className="fas fa-layer-group" />{walls.length}</div></div>
        <div className="ls"><div className="ls-t">Reward <span>Options</span></div><div className="ls-v"><i className="fas fa-gift" />{shop.length}</div></div>
        <div className="ls"><div className="ls-t">Top <span>Balance</span></div><div className="ls-v"><i className="fas fa-gem" />{top}</div></div>
        <div className="ls"><div className="ls-t">Ranked <span>Players</span></div><div className="ls-v"><i className="fas fa-users" />{board.length}</div></div>
      </div>
      <div className="land-cta">
        <button className="btn" onClick={() => document.getElementById('auth-trigger')?.click()}>
          <i className="fas fa-right-to-bracket" /> Log in to start earning
        </button>
      </div>
    </section>
  );
}

export default function Earn() {
  const { me, walls, shop, board, refreshData } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [wallUrl, setWallUrl] = useState('');
  const [wallTitle, setWallTitle] = useState('');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const openWall = (w) => {
    if (w.name?.toLowerCase() === '01gh rewards' || /internal:daily/i.test(w.url || '')) {
      setShowDaily(true);
      return;
    }
    if (!/^https?:\/\//i.test(w.url)) return alert('No link set');
    setWallTitle(w.name);
    setWallUrl(w.url);
  };

  if (!me) {
    return (
      <>
        <Landing board={board} walls={walls} shop={shop} />
        <button id="auth-trigger" style={{ display: 'none' }} onClick={() => setShowAuth(true)} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  const hold = Number(me.holdBalance) || 0;
  const rate = Number(me.inactivityRate ?? me.reversalRate) || 0;
  const days = Number(me.joinDays ?? me.daysInactive) || 0;
  const toCover = Number(me.rateToCover) || 0;
  const canOut = !!me.canCashout;

  return (
    <>
      <div className="sec-title"><i className="fas fa-bolt" style={{ color: 'var(--orange)' }} /> Ways to earn</div>
      <div className="cols2">
        {walls.map(w => {
          const locked = w.locked || !w.canAccess;
          return (
            <button key={w.id} className={`wall${locked ? ' locked' : ''}`} onClick={() => !locked && openWall(w)}>
              <img className="logo" src={w.logo || 'https://www.google.com/s2/favicons?domain=google.com&sz=128'} alt="" />
              <div>
                <div className="nm">{w.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {locked ? `Unlocks at ${(w.minDiamonds || 0).toLocaleString()} diamonds` : 'Tap to open'}
                </div>
              </div>
              <span className="go"><i className={`fas ${locked ? 'fa-lock' : 'fa-arrow-up-right-from-square'}`} /></span>
            </button>
          );
        })}
      </div>

      {showDaily && <DailyModal onClose={() => setShowDaily(false)} />}
      {wallUrl && (
        <div className="overlay on" id="wallOv">
          <div className="wall-frame">
            <div className="wall-frame-h">
              <strong>{wallTitle}</strong>
              <button className="x" onClick={() => setWallUrl('')}><i className="fas fa-xmark" /></button>
            </div>
            <iframe id="wallFrame" title="Offerwall" src={wallUrl} allow="clipboard-write; payment" />
          </div>
        </div>
      )}
    </>
  );
}
