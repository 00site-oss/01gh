import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function DailyModal({ onClose }) {
  const { me, setUser } = useApp();
  const [st, setSt] = useState(null);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!me) return;
    api('getDailyStatus', me.id).then(setSt).catch(() => {});
  }, [me]);

  const claim = async () => {
    if (!st?.canClaim) return;
    const r = await api('claimDaily', me.id);
    if (r?.success) {
      if (r.user) setUser(r.user);
      setSt(r.status);
      setMsg(`+${r.diamonds} diamonds`);
    }
  };

  const redeem = async () => {
    if (!code.trim()) return;
    const r = await api('redeemBonusCode', me.id, code.trim());
    if (r?.success) {
      setUser({ ...me, diamonds: r.newBalance });
      setCode('');
      setMsg(`+${r.diamonds} diamonds`);
    } else setMsg(r?.error || 'Invalid');
  };

  return (
    <div className="overlay on" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-h">
          <h3>01GH Rewards</h3>
          <button className="x" onClick={onClose}><i className="fas fa-xmark" /></button>
        </div>
        <div className="modal-b">
          {st ? (
            <>
              <div className="dm-box">
                <div className="dm-sub"><span className="tag pending">Daily reward</span><span className="tag">Level {st.level}</span></div>
                <button className="btn block" style={{ marginTop: 16 }} onClick={claim} disabled={!st.canClaim}>
                  {st.canClaim ? `Claim ${st.reward}` : 'Not ready'}
                </button>
                {msg && <div className="dm-msg">{msg}</div>}
              </div>
              <div className="dm-box">
                <div className="dm-sub"><span className="tag approved">Promo code</span></div>
                <div className="dm-promo">
                  <input className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter a promo code" />
                  <button className="btn green" onClick={redeem}>Redeem</button>
                </div>
              </div>
            </>
          ) : <div className="skel" />}
        </div>
      </div>
    </div>
  );
}
