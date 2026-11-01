export default function Privacy() {
  return (
    <div className="card legal">
      <p className="updated">Last updated: 26 October 2025</p>
      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account data</strong>: username, password (stored securely), diamond balance, total earned, level, verified status, mute status, referral count.</li>
        <li><strong>Cashout data</strong>: reward requested, amount, diamond cost, delivery email or cryptocurrency wallet address, status, timestamps.</li>
        <li><strong>Usage data</strong>: chat messages, activity events shown in the live ticker, offerwall interactions.</li>
        <li><strong>Technical data</strong>: session token (localStorage), IP address and browser information (standard server logs), web-app execution URL (stored locally in your browser only).</li>
        <li><strong>Postback data</strong> received from offerwall networks: user_id, amount, transaction_id, offerwall name.</li>
      </ul>
      <h2>2. How We Use Information</h2>
      <ul>
        <li>To operate the Service, credit diamonds, process and review cashouts, display leaderboards and chat.</li>
        <li>To prevent fraud and enforce the Terms of Service.</li>
        <li>To communicate with you about your account or cashouts.</li>
      </ul>
      <h2>3. Sharing of Information</h2>
      <ul>
        <li><strong>Offerwall networks</strong>: We send postbacks containing the data listed above so they can confirm completed offers.</li>
        <li><strong>Payment / reward fulfillment</strong>: Delivery details (email or wallet) are used solely to send approved rewards.</li>
        <li>We do not sell your personal data. We may disclose information if required by law or to protect our rights and users.</li>
      </ul>
      <h2>4. Data Retention</h2>
      <p>We retain your account and transaction data for as long as your account is active. When you delete your account, we permanently remove your personal data from our sheets as described below. Chat messages and activity records that cannot be fully unlinked may be retained in anonymised form or deleted during routine pruning.</p>
      <h2>5. Security</h2>
      <p>We use reasonable technical and organizational measures to protect data. No method of transmission or storage is 100% secure.</p>
      <h2>6. Your Rights</h2>
      <p>You have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Access / Export</strong> – You can download a complete copy of the data we hold about you (profile, cashouts, offers completed, balance history, chat messages) from your Profile page at any time.</li>
        <li><strong>Deletion</strong> – You can permanently delete your account and all associated data from our Google Sheets. After deletion, your information is removed from the Users sheet and all related records are purged from the Records sheet.</li>
        <li><strong>Correction</strong> – Contact the administrator if any of your stored information is inaccurate.</li>
      </ul>
      <p>Some anonymised or aggregated data may remain in system logs for fraud prevention, but it will no longer be linked to your identity.</p>
      <h2>7. Cookies & Local Storage</h2>
      <p>We use localStorage for session persistence (<code>gpt_token_v2</code>) and the web-app URL. No third-party advertising cookies are used by the core platform. Third-party offerwalls may set their own cookies when you visit them.</p>
      <h2>8. Children</h2>
      <p>The Service is not directed at anyone under 18. We do not knowingly collect data from children.</p>
      <h2>9. Changes</h2>
      <p>We may update this Privacy Policy. The “Last updated” date will be revised accordingly.</p>
      <h2>10. Contact</h2>
      <p>For privacy-related requests, contact the site administrator via the platform.</p>
    </div>
  );
}
