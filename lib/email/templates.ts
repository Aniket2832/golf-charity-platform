export const drawPublishedEmail = (userName: string, drawMonth: string, numbers: number[]) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monthly Draw Results</title>
</head>
<body style="margin:0;padding:0;background:#030712;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    
    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:white;font-weight:bold;font-size:24px;">Golf</span>
      <span style="color:#22c55e;font-weight:bold;font-size:24px;">Charity</span>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:16px;">🎰</div>
      <h1 style="color:white;font-size:28px;margin:0 0 8px;">Draw Results Are In!</h1>
      <p style="color:#9ca3af;margin:0;">Hi ${userName}, the ${drawMonth} draw has been published!</p>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#9ca3af;font-size:14px;margin:0 0 16px;text-align:center;">Winning Numbers</p>
      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
        ${numbers.map(n => `
          <div style="width:48px;height:48px;background:#22c55e;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:black;font-weight:bold;font-size:18px;margin:4px;">
            ${n}
          </div>
        `).join('')}
      </div>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:white;margin:0 0 16px;">Prize Tiers</h3>
      <div style="display:flex;gap:12px;">
        <div style="flex:1;background:#1f2937;border-radius:12px;padding:12px;text-align:center;">
          <p style="color:#eab308;font-weight:bold;margin:0;">5 Match</p>
          <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">40% of pool</p>
        </div>
        <div style="flex:1;background:#1f2937;border-radius:12px;padding:12px;text-align:center;">
          <p style="color:#60a5fa;font-weight:bold;margin:0;">4 Match</p>
          <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">35% of pool</p>
        </div>
        <div style="flex:1;background:#1f2937;border-radius:12px;padding:12px;text-align:center;">
          <p style="color:#22c55e;font-weight:bold;margin:0;">3 Match</p>
          <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">25% of pool</p>
        </div>
      </div>
    </div>

    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/draws" 
        style="background:#22c55e;color:black;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;display:inline-block;">
        Check Your Results
      </a>
    </div>

    <p style="color:#4b5563;font-size:12px;text-align:center;margin-top:32px;">
      Golf Charity Platform — Play Golf. Win Prizes. Change Lives.
    </p>
  </div>
</body>
</html>
`

export const winnerEmail = (userName: string, matchCount: number, prizeAmount: number, drawMonth: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You Won!</title>
</head>
<body style="margin:0;padding:0;background:#030712;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:white;font-weight:bold;font-size:24px;">Golf</span>
      <span style="color:#22c55e;font-weight:bold;font-size:24px;">Charity</span>
    </div>

    <div style="background:linear-gradient(135deg,#065f46,#111827);border:2px solid #22c55e;border-radius:16px;padding:40px;text-align:center;margin-bottom:24px;">
      <div style="font-size:64px;margin-bottom:16px;">🏆</div>
      <h1 style="color:white;font-size:32px;margin:0 0 8px;">Congratulations ${userName}!</h1>
      <p style="color:#22c55e;font-size:18px;margin:0 0 24px;">You won the ${drawMonth} draw!</p>
      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:20px;display:inline-block;">
        <p style="color:#9ca3af;font-size:14px;margin:0 0 4px;">${matchCount}-Number Match Prize</p>
        <p style="color:white;font-size:48px;font-weight:bold;margin:0;">£${prizeAmount.toFixed(2)}</p>
      </div>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:white;margin:0 0 12px;">How to claim your prize</h3>
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
        <div style="width:24px;height:24px;background:rgba(34,197,94,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#22c55e;font-weight:bold;font-size:12px;flex-shrink:0;">1</div>
        <p style="color:#d1d5db;margin:0;font-size:14px;">Log in to your Golf Charity account</p>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
        <div style="width:24px;height:24px;background:rgba(34,197,94,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#22c55e;font-weight:bold;font-size:12px;flex-shrink:0;">2</div>
        <p style="color:#d1d5db;margin:0;font-size:14px;">Go to My Winnings section</p>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="width:24px;height:24px;background:rgba(34,197,94,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#22c55e;font-weight:bold;font-size:12px;flex-shrink:0;">3</div>
        <p style="color:#d1d5db;margin:0;font-size:14px;">Upload your score proof to verify and claim payment</p>
      </div>
    </div>

    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/winnings"
        style="background:#22c55e;color:black;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;display:inline-block;">
        Claim Your Prize
      </a>
    </div>

    <p style="color:#4b5563;font-size:12px;text-align:center;margin-top:32px;">
      Golf Charity Platform — Play Golf. Win Prizes. Change Lives.
    </p>
  </div>
</body>
</html>
`

export const welcomeEmail = (userName: string, charityName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Golf Charity Platform</title>
</head>
<body style="margin:0;padding:0;background:#030712;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:white;font-weight:bold;font-size:24px;">Golf</span>
      <span style="color:#22c55e;font-weight:bold;font-size:24px;">Charity</span>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:40px;text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:16px;">⛳</div>
      <h1 style="color:white;font-size:28px;margin:0 0 8px;">Welcome ${userName}!</h1>
      <p style="color:#9ca3af;margin:0;font-size:16px;">You are now part of the Golf Charity community</p>
    </div>

    <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:white;margin:0 0 16px;">What happens next?</h3>
      ${[
        { icon: '🏌️', title: 'Enter your scores', desc: 'Add your latest Stableford scores to participate in monthly draws' },
        { icon: '🎰', title: 'Win prizes', desc: 'Match draw numbers to win up to 40% of the monthly prize pool' },
        { icon: '❤️', title: 'Support ' + charityName, desc: 'Min 10% of your subscription goes directly to your chosen charity' },
      ].map(item => `
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;">
          <div style="font-size:24px;flex-shrink:0;">${item.icon}</div>
          <div>
            <p style="color:white;font-weight:bold;margin:0 0 4px;">${item.title}</p>
            <p style="color:#9ca3af;font-size:14px;margin:0;">${item.desc}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
        style="background:#22c55e;color:black;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;display:inline-block;">
        Go to Dashboard
      </a>
    </div>

    <p style="color:#4b5563;font-size:12px;text-align:center;margin-top:32px;">
      Golf Charity Platform — Play Golf. Win Prizes. Change Lives.
    </p>
  </div>
</body>
</html>
`