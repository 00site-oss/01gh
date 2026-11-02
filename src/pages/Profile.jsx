import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

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
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{me.level || 1}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Level</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{rate}%</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Rate</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ font: '700 20px Space Grotesk,system-ui' }}>{days}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Days</div>
          </div>
        </div>
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
