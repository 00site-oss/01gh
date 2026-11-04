import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

function RankCard() {
  const { me } = useApp();
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => api('getRankInfo', me.id).then(setInfo).catch(() => {});
  useEffect(() => { if (me) load(); }, [me]);

  if (!info) return <div className="skel" />;

  const doCheckin = async () => {
    setBusy(true);
    try {
      const r = await api('checkIn', me.id);
      if (r?.success) load();
      else alert(r?.error || 'Failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ font: '700 22px Space Grotesk,system-ui' }}>{info.rank}</div>
          <div className="muted" style={{ fontSize: 13 }}>
            {info.recovering
              ? `Recovery: ${info.debt} pts debt`
              : `${info.score} pts · ${info.toNext} to next`}
          </div>
        </div>
        <button className="btn sm" onClick={doCheckin} disabled={busy}>{busy ? '...' : 'Check in +5'}</button>
      </div>
      {info.recovering ? (
        <div className="bar"><div style={{ width: `${Math.min(100, ((info.rules.debtPerDay * 13 - info.debt) / (info.rules.debtPerDay * 13)) * 100)}%`, background: 'var(--yellow)' }} /></div>
      ) : (
        <div className="bar"><div style={{ width: `${Math.min(100, (info.score / info.nextRankAt) * 100)}%` }} /></div>
      )}
      {info.debt > 0 && (
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,176,32,.1)', border: '1px solid rgba(255,176,32,.3)', borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Cover inactivity</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            Debt: <strong>{info.debt} pts</strong> · Cost: <strong>{info.coverCost.toLocaleString()} diamonds</strong>
            <div className="muted" style={{ fontSize: 12 }}>{info.days} days × 100% fee</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input className="input" id="coverAmt" type="number" min="1" max={info.debt} placeholder={`Pts to cover`} style={{ maxWidth: 120 }} />
            <button className="btn sm" onClick={async () => {
              const pts = Number(document.getElementById('coverAmt').value) || info.debt;
              const cost = Math.ceil(pts * (1 + (info.days || 0)));
              if (!confirm(`Cover ${pts} pts for ${cost} diamonds?`)) return;
              const r = await api('coverInactivityDebt', me.id, pts);
              if (r?.success) load();
              else alert(r?.error || 'Failed');
            }}>Cover</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { me, setUser, clearUser, refreshData } = useApp();
  const [hist, setHist] = useState(null);

  useEffect(() => { refreshData(); }, [refreshData]);

  if (!me) return <div className="card gate"><i className="fas fa-lock" /><h3>Your profile</h3><p className="muted">Log in to continue.</p></div>;

  const hold = Number(me.holdBalance) || 0;
  const rate = Number(me.inactivityRate ?? me.reversalRate) || 0;
  const days = Number(me.joinDays ?? me.daysInactive) || 0;
  const toCover = Number(me.rateToCover) || 0;
  const coverage = Number(me.rateCoverage) || 0;
  const canOut = !!me.canCashout;

  const showHistory = async () => {
    const l = await api('getUserCashouts', me.id);
    setHist(l || []);
  };

  const exportData = async () => {
    const r = await api('exportUserData', me.id);
    if (r?.success) {
      const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `01GH-my-data-${me.username}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const deleteAccount = async () => {
    const password = prompt('Type your password to confirm permanent deletion:');
    if (!password) return;
    if (!confirm('This cannot be undone. Continue?')) return;
    const r = await api('deleteUserAccount', me.id, password);
    if (r?.success) {
      clearUser();
      alert('Account deleted');
    }
  };

  return (
    <>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg,#ff8a2e,#ff7a1a)',
            color: '#1c0f06', font: '700 24px Space Grotesk,system-ui',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>{me.username.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>{me.username}</h2>
            <span className="tag" style={{ marginTop: 4 }}>{me.isAdmin ? 'Admin' : 'Member'}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{(me.diamonds || 0).toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Available</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{hold.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>On hold</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{(me.totalEarned || 0).toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Earned</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{me.rank || 'None'}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Rank</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{days}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Days</div>
          </div>
        </div>
      </div>

      <h2 className="sec-title" style={{ marginTop: 24 }}>Rank</h2>
      <div className="card">
        <RankCard />
      </div>

      <h2 className="sec-title" style={{ marginTop: 24 }}>Send points</h2>
      <div className="card">
        <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
          Gold rank required. Sender pays a 3% fee.
        </p>
        {(me.rank !== 'Gold' && me.rank !== 'Platinum') ? (
          <p className="muted">You need Gold rank to send points.</p>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="input" id="sendTo" placeholder="Username" style={{ maxWidth: 160 }} />
            <input className="input" id="sendAmt" type="number" min="1" placeholder="Amount" style={{ maxWidth: 120 }} />
            <button className="btn sm" onClick={async () => {
              const to = document.getElementById('sendTo').value.trim();
              const amt = Number(document.getElementById('sendAmt').value);
              if (!to || !amt || amt <= 0) return alert('Enter username and amount');
              const fee = Math.ceil(amt * 0.03);
              const total = amt + fee;
              if ((me.diamonds || 0) < total) return alert(`Need ${total} (including ${fee} fee)`);
              if (!confirm(`Send ${amt} to ${to}? Fee: ${fee}. Total: ${total}`)) return;
              const r = await api('transferPoints', me.id, to, amt);
              if (r?.success) {
                alert(`Sent ${amt} to ${to}. Fee: ${fee}`);
                if (r.user) setUser(r.user);
                refreshData();
              } else alert(r?.error || 'Failed');
            }}>Send</button>
          </div>
        )}
      </div>

      <h2 className="sec-title" style={{ marginTop: 24 }}>Account</h2>
      <div className="card">
        <div className="act-row">
          <span className="ic"><i className="fas fa-clock-rotate-left" /></span>
          <div className="grow"><b>Cashout history</b><span>See the status of your reward requests.</span></div>
          <button className="btn sm light" onClick={showHistory}>View</button>
        </div>
        <div className="act-row">
          <span className="ic"><i className="fas fa-file-arrow-down" /></span>
          <div className="grow"><b>Download my data</b><span>Get a copy of everything we store about you.</span></div>
          <button className="btn sm light" onClick={exportData}>Download</button>
        </div>
        <div className="act-row">
          <span className="ic"><i className="fas fa-trash" style={{ color: 'var(--red)' }} /></span>
          <div className="grow"><b>Delete my account</b><span>Permanent. Your diamonds and history are removed.</span></div>
          <button className="btn sm red" onClick={deleteAccount}>Delete</button>
        </div>
      </div>

      {hist && (
        <div className="overlay on" onClick={() => setHist(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-h"><h3>Cashout history</h3><button className="x" onClick={() => setHist(null)}><i className="fas fa-xmark" /></button></div>
            <div className="modal-b">
              {hist.length ? hist.map(c => (
                <div key={c.id} className="list-row">
                  <div className="grow"><strong>{c.rewardTitle}</strong><div className="sub">{c.timestamp}</div></div>
                  <span className={`tag ${c.status}`}>{c.status}</span>
                </div>
              )) : <div className="empty">No cashouts yet</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
