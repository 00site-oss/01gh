import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Leaders() {
  const { board, me, refreshData } = useApp();

  useEffect(() => { refreshData(); }, [refreshData]);

  if (!board.length) return <div className="empty"><i className="fas fa-crown" />No players yet.</div>;

  const pod = board.length >= 3 ? (
    <div className="podium">
      {[1, 0, 2].map(i => {
        const u = board[i];
        return (
          <div key={i} className={`pod ${i === 0 ? 'p1' : i === 1 ? 'p2' : 'p3'}`}>
            <div className="av">{u.username.charAt(0).toUpperCase()}</div>
            <div className="n">{u.username}</div>
            <div className="d"><i className="fas fa-gem" />{u.diamonds.toLocaleString()}</div>
            <span className="rkb">{i + 1}</span>
          </div>
        );
      })}
    </div>
  ) : null;

  const rest = board.length >= 3 ? board.slice(3) : board;
  const start = board.length >= 3 ? 4 : 1;

  return (
    <>
      {pod}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {rest.map((u, i) => (
          <div key={u.username} className={`lrow${me && me.username === u.username ? ' me' : ''}`}>
            <span className="rk">{i + start}</span>
            <strong>{u.username}{me && me.username === u.username && <span className="tag pending">you</span>}</strong>
            <span className="muted" style={{ fontSize: 13 }}>Level {u.level || 1}</span>
            <span className="d"><i className="fas fa-gem" />{u.diamonds.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </>
  );
}
