'use client'
import Link from 'next/link'
import { Trophy, Heart, Target, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', color: 'white'}}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(3,7,18,0.9)',
        borderBottom: '1px solid #1f2937'
      }}>
        <div style={{maxWidth: '1100px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <span style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>Golf</span>
            <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '20px'}}>Charity</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <Link href="/login" style={{color: '#9ca3af', fontSize: '14px'}}>Sign In</Link>
            <Link href="/signup" style={{backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '8px 16px', borderRadius: '12px', fontSize: '14px'}}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', padding: '140px 24px 80px'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '999px', padding: '8px 16px', marginBottom: '32px'
          }}>
            <Heart size={16} color="#22c55e" />
            <span style={{color: '#22c55e', fontSize: '14px', fontWeight: '500'}}>Supporting charities across the UK</span>
          </div>
          <h1 style={{fontSize: '64px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '24px'}}>
            Play Golf.<br />
            <span style={{color: '#22c55e'}}>Win Prizes.</span><br />
            Change Lives.
          </h1>
          <p style={{color: '#9ca3af', fontSize: '20px', marginBottom: '40px', lineHeight: '1.7'}}>
            Enter your Stableford scores, participate in monthly prize draws,
            and support the charity closest to your heart.
          </p>
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/signup" style={{
              backgroundColor: '#22c55e', color: 'black', fontWeight: 'bold',
              padding: '16px 32px', borderRadius: '16px', fontSize: '18px'
            }}>
              Start Playing Today
            </Link>
            <Link href="/login" style={{
              backgroundColor: '#1f2937', color: 'white', fontWeight: 'bold',
              padding: '16px 32px', borderRadius: '16px', fontSize: '18px',
              border: '1px solid #374151'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{padding: '48px 24px', borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', backgroundColor: 'rgba(17,24,39,0.5)'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center'}}>
          {[
            { value: '£10K+', label: 'Prize Pool' },
            { value: '4', label: 'Charities Supported' },
            { value: 'Monthly', label: 'Prize Draws' },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{fontSize: '36px', fontWeight: 'bold', color: '#22c55e'}}>{stat.value}</p>
              <p style={{color: '#9ca3af', marginTop: '4px'}}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{padding: '80px 24px', textAlign: 'center'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '16px'}}>How It Works</h2>
          <p style={{color: '#9ca3af', fontSize: '18px', marginBottom: '48px'}}>Three simple steps to start winning and giving</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
            {[
              { step: '01', icon: Trophy, title: 'Subscribe', desc: 'Choose a monthly or yearly plan. A portion goes to your chosen charity automatically.', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
              { step: '02', icon: Target, title: 'Enter Scores', desc: 'Log your latest Stableford scores after each round. Only your best 5 count.', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
              { step: '03', icon: Heart, title: 'Win & Give', desc: 'Match numbers in the monthly draw to win prizes while supporting your charity.', color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: '#111827', border: '1px solid #1f2937',
                borderRadius: '16px', padding: '32px', textAlign: 'center'
              }}>
                <div style={{color: '#374151', fontWeight: 'bold', fontSize: '48px', marginBottom: '16px'}}>{item.step}</div>
                <div style={{
                  width: '56px', height: '56px', backgroundColor: item.bg,
                  borderRadius: '16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <item.icon size={28} color={item.color} />
                </div>
                <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '12px'}}>{item.title}</h3>
                <p style={{color: '#9ca3af', lineHeight: '1.6'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize tiers */}
      <section style={{padding: '80px 24px', backgroundColor: 'rgba(17,24,39,0.5)', textAlign: 'center'}}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '16px'}}>Prize Tiers</h2>
          <p style={{color: '#9ca3af', fontSize: '18px', marginBottom: '48px'}}>Match your scores to the monthly draw numbers</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
            {[
              { match: '5 Numbers', prize: '40% of pool', tag: 'JACKPOT', borderColor: '#eab308', tagBg: '#eab308', rollover: true },
              { match: '4 Numbers', prize: '35% of pool', tag: 'SECOND', borderColor: '#3b82f6', tagBg: '#3b82f6', rollover: false },
              { match: '3 Numbers', prize: '25% of pool', tag: 'THIRD', borderColor: '#22c55e', tagBg: '#22c55e', rollover: false },
            ].map((tier, i) => (
              <div key={i} style={{
                backgroundColor: '#111827', border: `2px solid ${tier.borderColor}`,
                borderRadius: '16px', padding: '32px', textAlign: 'center'
              }}>
                <span style={{backgroundColor: tier.tagBg, color: 'black', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '999px'}}>
                  {tier.tag}
                </span>
                <p style={{color: 'white', fontWeight: 'bold', fontSize: '24px', marginTop: '16px'}}>{tier.match}</p>
                <p style={{color: '#9ca3af', marginTop: '8px'}}>{tier.prize}</p>
                {tier.rollover && <p style={{color: '#eab308', fontSize: '12px', marginTop: '8px'}}>Rolls over if unclaimed!</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charities */}
      <section style={{padding: '80px 24px', textAlign: 'center'}}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '16px'}}>Charities We Support</h2>
          <p style={{color: '#9ca3af', fontSize: '18px', marginBottom: '48px'}}>Choose who benefits from your subscription</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
            {['Golf Foundation', 'Prostate Cancer UK', 'Macmillan Cancer Support', 'Alzheimers Society'].map((name, i) => (
              <div key={i} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', textAlign: 'center'}}>
                <div style={{
                  width: '48px', height: '48px', backgroundColor: 'rgba(34,197,94,0.2)',
                  borderRadius: '999px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 12px'
                }}>
                  <Heart size={24} color="#22c55e" />
                </div>
                <p style={{color: 'white', fontSize: '14px', fontWeight: '500'}}>{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{padding: '80px 24px', backgroundColor: 'rgba(17,24,39,0.5)', textAlign: 'center'}}>
        <div style={{maxWidth: '700px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '16px'}}>Simple Pricing</h2>
          <p style={{color: '#9ca3af', fontSize: '18px', marginBottom: '48px'}}>Cancel anytime. No hidden fees.</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
            <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '32px', textAlign: 'left'}}>
              <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px'}}>Monthly</h3>
              <div style={{display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px'}}>
                <span style={{fontSize: '40px', fontWeight: 'bold', color: 'white'}}>£9.99</span>
                <span style={{color: '#9ca3af'}}>/month</span>
              </div>
              {['Monthly draw entry', 'Score tracking', 'Charity contribution', 'Cancel anytime'].map((f, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                  <Check size={20} color="#22c55e" />
                  <span style={{color: '#d1d5db', fontSize: '14px'}}>{f}</span>
                </div>
              ))}
              <Link href="/signup" style={{
                display: 'block', width: '100%', backgroundColor: '#1f2937',
                color: 'white', fontWeight: '600', padding: '12px',
                borderRadius: '12px', textAlign: 'center', marginTop: '24px',
                border: '1px solid #374151'
              }}>
                Get Started
              </Link>
            </div>

            <div style={{backgroundColor: '#111827', border: '2px solid #22c55e', borderRadius: '16px', padding: '32px', textAlign: 'left', position: 'relative'}}>
              <span style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#22c55e', color: 'black', fontSize: '12px',
                fontWeight: 'bold', padding: '4px 16px', borderRadius: '999px'
              }}>
                Best Value
              </span>
              <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px'}}>Yearly</h3>
              <div style={{display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px'}}>
                <span style={{fontSize: '40px', fontWeight: 'bold', color: 'white'}}>£99.99</span>
                <span style={{color: '#9ca3af'}}>/year</span>
              </div>
              <p style={{color: '#22c55e', fontSize: '14px', marginBottom: '20px'}}>Save £19.89</p>
              {['Everything in Monthly', '2 months free', 'Priority entry', 'Member badge'].map((f, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                  <Check size={20} color="#22c55e" />
                  <span style={{color: '#d1d5db', fontSize: '14px'}}>{f}</span>
                </div>
              ))}
              <Link href="/signup" style={{
                display: 'block', width: '100%', backgroundColor: '#22c55e',
                color: 'black', fontWeight: '600', padding: '12px',
                borderRadius: '12px', textAlign: 'center', marginTop: '24px'
              }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding: '80px 24px', textAlign: 'center'}}>
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '16px'}}>Ready to make a difference?</h2>
          <p style={{color: '#9ca3af', fontSize: '18px', marginBottom: '32px'}}>
            Join today and start playing golf for a cause that matters.
          </p>
          <Link href="/signup" style={{
            display: 'inline-block', backgroundColor: '#22c55e', color: 'black',
            fontWeight: 'bold', padding: '16px 40px', borderRadius: '16px', fontSize: '18px'
          }}>
            Join Now — It is Free to Start
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop: '1px solid #1f2937', padding: '32px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <span style={{color: 'white', fontWeight: 'bold'}}>Golf</span>
            <span style={{color: '#22c55e', fontWeight: 'bold'}}>Charity</span>
            <span style={{color: '#6b7280', fontSize: '14px', marginLeft: '8px'}}>Platform</span>
          </div>
          <p style={{color: '#4b5563', fontSize: '14px'}}>Built for Digital Heroes trainee selection 2026</p>
        </div>
      </footer>
    </div>
  )
}