'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LogIn, Trophy, Heart, Target } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }
    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', display: 'flex'}}>
      {/* Left panel */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px'}}>
        <div style={{width: '100%', maxWidth: '400px'}}>
          {/* Logo */}
          <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', textDecoration: 'none'}}>
            <div style={{width: '36px', height: '36px', backgroundColor: '#22c55e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Trophy size={20} color="black" />
            </div>
            <div>
              <span style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>Golf</span>
              <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '18px'}}>Charity</span>
            </div>
          </Link>

          <h1 style={{fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Welcome back</h1>
          <p style={{color: '#9ca3af', marginBottom: '32px'}}>Sign in to continue your journey</p>

          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px', fontWeight: '500'}}>Email address</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@example.com"
                style={{
                  width: '100%', backgroundColor: '#111827',
                  border: '1px solid #1f2937', borderRadius: '12px',
                  padding: '14px 16px', color: 'white', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#22c55e'}
                onBlur={e => e.target.style.borderColor = '#1f2937'}
              />
            </div>

            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px', fontWeight: '500'}}>Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                style={{
                  width: '100%', backgroundColor: '#111827',
                  border: '1px solid #1f2937', borderRadius: '12px',
                  padding: '14px 16px', color: 'white', fontSize: '15px',
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#22c55e'}
                onBlur={e => e.target.style.borderColor = '#1f2937'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                backgroundColor: loading ? '#166534' : '#22c55e',
                color: 'black', fontWeight: '700', padding: '14px',
                borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px', marginTop: '8px', transition: 'background-color 0.2s'
              }}
            >
              {loading ? (
                <div style={{width: '20px', height: '20px', border: '2px solid black', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p style={{textAlign: 'center', color: '#6b7280', marginTop: '24px', fontSize: '14px'}}>
            No account yet?{' '}
            <Link href="/signup" style={{color: '#22c55e', fontWeight: '600', textDecoration: 'none'}}>
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, backgroundColor: '#0a1628',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', borderLeft: '1px solid #1f2937'
      }}>
        <div style={{maxWidth: '400px', textAlign: 'center'}}>
          <h2 style={{fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px', lineHeight: '1.2'}}>
            Play Golf.<br />
            <span style={{color: '#22c55e'}}>Win Prizes.</span><br />
            Change Lives.
          </h2>
          <p style={{color: '#9ca3af', marginBottom: '48px', lineHeight: '1.7'}}>
            Join thousands of golfers competing in monthly draws while supporting charities that matter.
          </p>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {[
              { icon: Trophy, title: 'Monthly Prize Draws', desc: 'Win up to 40% of the prize pool with a 5-number match', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
              { icon: Target, title: 'Stableford Scoring', desc: 'Enter your last 5 scores and let them work for you', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
              { icon: Heart, title: 'Charity Impact', desc: 'Minimum 10% of every subscription goes to your chosen charity', color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                backgroundColor: '#111827', border: '1px solid #1f2937',
                borderRadius: '16px', padding: '16px', textAlign: 'left'
              }}>
                <div style={{width: '44px', height: '44px', backgroundColor: item.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <item.icon size={22} color={item.color} />
                </div>
                <div>
                  <p style={{color: 'white', fontWeight: '600', fontSize: '14px'}}>{item.title}</p>
                  <p style={{color: '#9ca3af', fontSize: '12px', marginTop: '2px'}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}