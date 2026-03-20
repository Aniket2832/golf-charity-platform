'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { UserPlus, Trophy, Heart, Check } from 'lucide-react'

export default function SignupPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', charity_id: '' })
  const [charities, setCharities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.from('charities').select('id, name').then(({ data }) => {
      if (data) setCharities(data)
    })
  }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })
    if (error) { toast.error(error.message); setLoading(false); return }
    if (form.charity_id && data.user) {
      await supabase.from('users').update({ charity_id: form.charity_id }).eq('id', data.user.id)
    }
    // Send welcome email
if (data.user) {
  fetch('/api/email/welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: data.user.id })
  })
}

toast.success('Account created! Choose your plan.')
router.push('/pricing')
  }

  const inputStyle = {
    width: '100%', backgroundColor: '#111827',
    border: '1px solid #1f2937', borderRadius: '12px',
    padding: '14px 16px', color: 'white', fontSize: '15px', outline: 'none'
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', display: 'flex'}}>
      {/* Left panel — form */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px'}}>
        <div style={{width: '100%', maxWidth: '420px'}}>
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

          <h1 style={{fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Create your account</h1>
          <p style={{color: '#9ca3af', marginBottom: '32px'}}>Join thousands of golfers making a difference</p>

          {/* Steps indicator */}
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px'}}>
            {[1, 2].map((s) => (
              <div key={s} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: step >= s ? '#22c55e' : '#1f2937',
                  color: step >= s ? 'black' : '#6b7280',
                  fontWeight: '600', fontSize: '13px'
                }}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span style={{color: step >= s ? '#22c55e' : '#6b7280', fontSize: '13px', fontWeight: '500'}}>
                  {s === 1 ? 'Your details' : 'Choose charity'}
                </span>
                {s < 2 && <div style={{width: '32px', height: '1px', backgroundColor: '#1f2937', margin: '0 4px'}} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSignup} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {step === 1 ? (
              <>
                <div>
                  <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px', fontWeight: '500'}}>Full Name</label>
                  <input
                    type="text" required value={form.full_name}
                    onChange={e => setForm({...form, full_name: e.target.value})}
                    placeholder="John Smith" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#22c55e'}
                    onBlur={e => e.target.style.borderColor = '#1f2937'}
                  />
                </div>
                <div>
                  <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px', fontWeight: '500'}}>Email address</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="john@example.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#22c55e'}
                    onBlur={e => e.target.style.borderColor = '#1f2937'}
                  />
                </div>
                <div>
                  <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px', fontWeight: '500'}}>Password</label>
                  <input
                    type="password" required minLength={8}
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="Minimum 8 characters" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#22c55e'}
                    onBlur={e => e.target.style.borderColor = '#1f2937'}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!form.full_name || !form.email || !form.password) {
                      toast.error('Please fill in all fields')
                      return
                    }
                    if (form.password.length < 8) {
                      toast.error('Password must be at least 8 characters')
                      return
                    }
                    setStep(2)
                  }}
                  style={{
                    backgroundColor: '#22c55e', color: 'black', fontWeight: '700',
                    padding: '14px', borderRadius: '12px', border: 'none',
                    cursor: 'pointer', fontSize: '16px', marginTop: '8px'
                  }}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div>
                  <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '12px', fontWeight: '500'}}>
                    Choose a charity to support (optional)
                  </label>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {charities.map(c => (
                      <div
                        key={c.id}
                        onClick={() => setForm({...form, charity_id: form.charity_id === c.id ? '' : c.id})}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                          border: form.charity_id === c.id ? '1px solid #22c55e' : '1px solid #1f2937',
                          backgroundColor: form.charity_id === c.id ? 'rgba(34,197,94,0.05)' : '#111827'
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div style={{width: '32px', height: '32px', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Heart size={16} color="#22c55e" />
                          </div>
                          <span style={{color: 'white', fontSize: '14px', fontWeight: '500'}}>{c.name}</span>
                        </div>
                        {form.charity_id === c.id && (
                          <div style={{width: '22px', height: '22px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Check size={12} color="black" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                  <button
                    type="button" onClick={() => setStep(1)}
                    style={{flex: 1, backgroundColor: '#1f2937', color: 'white', fontWeight: '600', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px'}}
                  >
                    Back
                  </button>
                  <button
                    type="submit" disabled={loading}
                    style={{
                      flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      backgroundColor: loading ? '#166534' : '#22c55e',
                      color: 'black', fontWeight: '700', padding: '14px',
                      borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px'
                    }}
                  >
                    {loading ? (
                      <div style={{width: '20px', height: '20px', border: '2px solid black', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                    ) : (
                      <><UserPlus size={18} /> Create Account</>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <p style={{textAlign: 'center', color: '#6b7280', marginTop: '24px', fontSize: '14px'}}>
            Already have an account?{' '}
            <Link href="/login" style={{color: '#22c55e', fontWeight: '600', textDecoration: 'none'}}>
              Sign in
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
          <div style={{
            width: '80px', height: '80px', backgroundColor: 'rgba(34,197,94,0.15)',
            borderRadius: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px'
          }}>
            <Trophy size={40} color="#22c55e" />
          </div>

          <h2 style={{fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '16px'}}>
            What you get with GolfCharity
          </h2>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '32px'}}>
            {[
              { text: 'Participate in monthly prize draws', color: '#22c55e' },
              { text: 'Track your last 5 Stableford scores', color: '#22c55e' },
              { text: 'Support your chosen charity automatically', color: '#22c55e' },
              { text: 'Win up to 40% of the monthly prize pool', color: '#22c55e' },
              { text: 'Cancel or change your plan anytime', color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{width: '22px', height: '22px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Check size={12} color={item.color} />
                </div>
                <span style={{color: '#d1d5db', fontSize: '14px'}}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Prize tiers preview */}
          <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px'}}>
            <p style={{color: '#9ca3af', fontSize: '13px', marginBottom: '12px'}}>Monthly prize tiers</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {[
                { match: '5 Numbers', prize: '40% of pool', color: '#eab308', tag: 'JACKPOT' },
                { match: '4 Numbers', prize: '35% of pool', color: '#60a5fa', tag: 'SECOND' },
                { match: '3 Numbers', prize: '25% of pool', color: '#22c55e', tag: 'THIRD' },
              ].map((tier, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#1f2937', borderRadius: '10px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontSize: '11px', fontWeight: 'bold', color: 'black', backgroundColor: tier.color, padding: '2px 6px', borderRadius: '4px'}}>{tier.tag}</span>
                    <span style={{color: 'white', fontSize: '13px'}}>{tier.match}</span>
                  </div>
                  <span style={{color: tier.color, fontWeight: '600', fontSize: '13px'}}>{tier.prize}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}