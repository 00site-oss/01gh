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
      <div className="card">
        <div className="prof-head">
          <div className="avatar">{me.username.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{me.username}</h2>
            {me.isAdmin ? <span className="tag pending">Administrator</span> : <span className="tag">Member</span>}
          </div>
        </div>
        <div className="stat-grid">
          <div className="stat"><b>{(me.diamonds || 0).toLocaleString()}</b><span>Available</span></div>
          <div className="stat"><b>{hold.toLocaleString()}</b><span>On hold</span></div>
          <div className="stat"><b>{(me.totalEarned || 0).toLocaleString()}</b><span>Earned total</span></div>
          <div className="stat"><b>{me.level || 1}</b><span>Level</span></div>
        </div>
        <div className="stat-grid" style={{ marginTop: 10 }}>
          <div className="stat"><b>{rate}%</b><span>Inactivity rate</span></div>
          <div className="stat"><b>{days}</b><span>Days since join</span></div>
          <div className="stat"><b>{coverage}%</b><span>Daily covered</span></div>
          <div className="stat"><b>{canOut ? 'Yes' : `${toCover}%`}</b><span>{canOut ? 'Cashout OK' : 'Still to cover'}</span></div>
        </div>
        <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
          Rate starts at 2.5% × days since join. Earn 500 pts = −1% total. Convert 500 available diamonds = −1% daily. Cashouts unlock when total rate ≤ 2.5%.
        </p>
      </div>

      <h2 className="sec-title">Account</h2>
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
