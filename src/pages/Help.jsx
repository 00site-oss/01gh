export default function Help() {
  const steps = [
    ['fa-right-to-bracket', 'var(--yellow)', 'Log in', 'Use the account your administrator created for you.'],
    ['fa-bolt', 'var(--orange)', 'Earn', 'Open an offerwall and finish surveys or offers. Diamonds land in your balance automatically.'],
    ['fa-calendar-day', 'var(--green)', 'Claim your daily reward', 'Open 01GH Rewards on the Earn page and claim free diamonds once every 24 hours.'],
    ['fa-arrow-up', 'var(--blue)', 'Level up', 'Every 1,000 points is a new level. Reach level 10 for the blue verified tick, automatically.'],
    ['fa-bag-shopping', 'var(--green)', 'Redeem', 'Pick a reward in Rewards. An admin reviews your request. Crypto rewards carry a 5% fee.'],
    ['fa-gift', 'var(--yellow)', 'Use a promo code', 'Got a code? Open 01GH Rewards on the Earn page and enter it in the promo code box for free diamonds.'],
    ['fa-clock', 'var(--muted)', 'Inactivity rate & cashouts', 'Rate = daily% × days since you joined (daily starts at 2.5%). Every 500 pts earned lowers the total by 1%. Convert 500 available diamonds to cut the daily rate by 1%. Cashouts stay locked until total rate is 2.5% or lower.']
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
