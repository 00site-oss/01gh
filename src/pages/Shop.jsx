import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function Shop() {
  const { me, shop, refreshData, setUser } = useApp();
  const [pick, setPick] = useState(null);
  const [info, setInfo] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => { refreshData(); }, [refreshData]);

  if (!me) return <div className="card gate"><i className="fas fa-lock" /><h3>Rewards are for members</h3><p className="muted">Log in to continue.</p></div>;

  const bal = Number(me.diamonds) || 0;
  const rate = Number(me.inactivityRate ?? me.reversalRate) || 0;
  const canOut = !!me.canCashout;
  const toCover = Number(me.rateToCover) || 0;

  const items = [...shop].sort((a, b) => (bal >= b.cost) - (bal >= a.cost) || a.cost - b.cost);

  const confirm = async () => {
    if (!pick || !info.trim()) return setErr('Required');
    const payload = pick.type === 'crypto' ? { walletAddress: info } : { email: info };
    const r = await api('requestCashout', me.id, pick.id, payload);
    if (r?.success) {
      if (r.user) setUser(r.user);
      setPick(null);
      alert('Request sent!');
    } else setErr(r?.error || 'Failed');
  };

  return (
    <>
      {!canOut && (
        <div className="policy">
          <i className="fas fa-lock" /> Cashouts locked — inactivity rate is <strong>{rate}%</strong>. Cover down to 2.5% (still need ~{toCover}%).
        </div>
      )}
      <div className="shop-head">
        <div>
          <div className="muted" style={{ fontWeight: 600 }}>Your available balance</div>
          <div className="shop-bal"><i className="fas fa-gem" />{bal.toLocaleString()}</div>
        </div>
        <p className="muted">Rewards you can afford come first.{canOut ? '' : ' Cashout stays locked until rate ≤ 2.5%.'}</p>
      </div>
      <div className="shop-grid">
        {items.map(it => {
          const can = bal >= it.cost;
          const pct = Math.min(100, Math.round(bal / it.cost * 100));
          return (
            <div key={it.id} className={`card reward${can ? ' ready' : ''}`}>
              <div className="reward-top">
                <img className="logo" src={it.logo || 'https://www.google.com/s2/favicons?domain=google.com&sz=128'} alt="" />
                <div><b>{it.title}</b><div className="muted" style={{ fontSize: 13 }}>{it.subtitle || ''}</div></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <span className="price">${it.amount}</span>
                <span className="cost"><i className="fas fa-gem" />{it.cost.toLocaleString()}</span>
              </div>
              <div className="bar"><div style={{ width: `${pct}%`, background: can ? 'var(--green)' : undefined }} /></div>
              <div className="prog">{can ? 'Ready to redeem' : `${(it.cost - bal).toLocaleString()} more diamonds to go`}</div>
              <button className={`btn block${can && canOut ? ' green' : ''}`} disabled={!can || !canOut} onClick={() => setPick(it)}>
                {!canOut ? 'Cashout locked' : can ? 'Redeem' : 'Not enough diamonds'}
              </button>
            </div>
          );
        })}
      </div>

      {pick && (
        <div className="overlay on" onClick={() => setPick(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-h"><h3>Redeem reward</h3><button className="x" onClick={() => setPick(null)}><i className="fas fa-xmark" /></button></div>
            <div className="modal-b">
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <img className="logo" style={{ width: 64, height: 64, margin: '0 auto 10px', display: 'block' }} src={pick.logo || ''} alt="" />
                <h3 style={{ fontSize: 20 }}>{pick.title}</h3>
                <div style={{ font: '800 38px var(--display)', color: 'var(--green)' }}>${pick.amount}</div>
              </div>
              <div className="field">
                <label className="l">{pick.type === 'crypto' ? 'Wallet address' : 'Delivery email'}</label>
                <input className="input" value={info} onChange={e => setInfo(e.target.value)} placeholder={pick.type === 'crypto' ? 'Wallet' : 'you@example.com'} />
              </div>
              <div className="err">{err}</div>
              <div className="row-flex">
                <button className="btn light" style={{ flex: 1 }} onClick={() => setPick(null)}>Cancel</button>
                <button className="btn green" style={{ flex: 2 }} onClick={confirm}>Confirm redeem</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
