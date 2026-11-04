export default function Help() {
  const steps = [
    ['fa-right-to-bracket', 'var(--yellow)', 'Log in', 'Use the account your administrator created for you.'],
    ['fa-bolt', 'var(--orange)', 'Earn', 'Open an offerwall and finish surveys or offers. Diamonds land in your balance automatically.'],
    ['fa-calendar-day', 'var(--green)', 'Daily reward', 'Silver rank and above can claim free diamonds once every 24 hours from 01GH Rewards.'],
    ['fa-trophy', 'var(--orange)', 'Ranks', 'Silver at 55 pts, Gold at 75, Platinum at 85. Gold and Platinum can send points to other users.'],
    ['fa-paper-plane', 'var(--blue)', 'Send points', 'Gold+ users can send diamonds to others. A 3% fee is charged to the sender.'],
    ['fa-bag-shopping', 'var(--green)', 'Redeem', 'Pick a reward in Rewards. An admin reviews your request. For crypto, scan the QR and the admin pastes the tx hash.'],
    ['fa-gift', 'var(--yellow)', 'Use a promo code', 'Got a code? Open 01GH Rewards on the Earn page and enter it for free diamonds.'],
    ['fa-clock', 'var(--muted)', 'Inactivity recovery', 'Inactive days create a debt (10 pts per day). Check-ins and tasks pay it down. You can also cover it with diamonds (100% fee per day). Rank progress starts after debt is cleared.']
  ];

  return (
    <div className="grid">
      {steps.map((st, i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--raised)', border: '1px solid var(--line)', color: st[1], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={`fas ${st[0]}`} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 3 }}>{st[2]}</h3>
            <p className="muted">{st[3]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
