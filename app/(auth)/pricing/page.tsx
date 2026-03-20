'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Trophy, Zap, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please login first'); router.push('/login'); return }

    const periodEnd = new Date()
    if (plan === 'monthly') { periodEnd.setMonth(periodEnd.getMonth() + 1) }
    else { periodEnd.setFullYear(periodEnd.getFullYear() + 1) }

    const { error } = await supabase.from('subscriptions').upsert({
      user_id: user.id, plan, status: 'active',
      period_end: periodEnd.toISOString()
    }, { onConflict: 'user_id' })

    if (error) { toast.error('Something went wrong. Please try again.'); setLoading(null); return }
    toast.success('Subscription activated! Welcome aboard!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', color: 'white'}}>
      {/* Navbar */}
      <nav style={{padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937'}}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'}}>
          <div style={{width: '32px', height: '32px', backgroundColor: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Trophy size={18} color="black" />
          </div>
          <span style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>Golf</span>
          <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '18px'}}>Charity</span>
        </Link>
        <Link href="/login" style={{color: '#9ca3af', fontSize: '14px', textDecoration: 'none'}}>
          Already a member? Sign in
        </Link>
      </nav>

      {/* Header */}
      <div style={{textAlign: 'center', padding: '60px 24px 40px'}}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '999px', padding: '6px 16px', marginBottom: '24px'
        }}>
          <Zap size={14} color="#22c55e" />
          <span style={{color: '#22c55e', fontSize: '13px', fontWeight: '500'}}>Simple, transparent pricing</span>
        </div>
        <h1 style={{fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '16px'}}>
          Choose your plan
        </h1>
        <p style={{color: '#9ca3af', fontSize: '18px', maxWidth: '500px', margin: '0 auto'}}>
          Join thousands of golfers winning prizes and supporting charities every month
        </p>
      </div>

      {/* Plans */}
      <div style={{display: 'flex', gap: '24px', justifyContent: 'center', padding: '0 24px 60px', flexWrap: 'wrap', alignItems: 'stretch'}}>

        {/* Monthly */}
        <div style={{
          backgroundColor: '#111827', border: '1px solid #1f2937',
          borderRadius: '24px', padding: '40px', width: '340px',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{marginBottom: '32px'}}>
            <p style={{color: '#9ca3af', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>MONTHLY</p>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px'}}>
              <span style={{fontSize: '48px', fontWeight: 'bold', color: 'white'}}>£9.99</span>
              <span style={{color: '#9ca3af', fontSize: '16px'}}>/month</span>
            </div>
            <p style={{color: '#6b7280', fontSize: '14px'}}>Billed monthly. Cancel anytime.</p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1}}>
            {[
              'Enter monthly prize draws',
              'Track your Stableford scores',
              'Support your chosen charity',
              '10% minimum charity contribution',
              'Cancel anytime',
            ].map((f, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{width: '20px', height: '20px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Check size={11} color="#22c55e" />
                </div>
                <span style={{color: '#d1d5db', fontSize: '14px'}}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={loading !== null}
            style={{
              width: '100%', backgroundColor: '#1f2937',
              border: '1px solid #374151', color: 'white',
              fontWeight: '700', padding: '16px', borderRadius: '14px',
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              fontSize: '16px', opacity: loading !== null ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading === 'monthly' ? (
              <div style={{width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
            ) : 'Get Monthly Plan'}
          </button>
        </div>

        {/* Yearly */}
        <div style={{
          backgroundColor: '#111827', border: '2px solid #22c55e',
          borderRadius: '24px', padding: '40px', width: '340px',
          display: 'flex', flexDirection: 'column', position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#22c55e', color: 'black', fontSize: '13px',
            fontWeight: 'bold', padding: '6px 20px', borderRadius: '999px',
            whiteSpace: 'nowrap'
          }}>
            BEST VALUE — SAVE £19.89
          </div>

          <div style={{marginBottom: '32px'}}>
            <p style={{color: '#22c55e', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>YEARLY</p>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px'}}>
              <span style={{fontSize: '48px', fontWeight: 'bold', color: 'white'}}>£99.99</span>
              <span style={{color: '#9ca3af', fontSize: '16px'}}>/year</span>
            </div>
            <p style={{color: '#22c55e', fontSize: '14px', fontWeight: '500'}}>That is just £8.33/month</p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1}}>
            {[
              'Everything in Monthly',
              '2 months completely free',
              'Priority draw entry',
              'Exclusive yearly member badge',
              'Higher charity impact',
            ].map((f, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{width: '20px', height: '20px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Check size={11} color="#22c55e" />
                </div>
                <span style={{color: '#d1d5db', fontSize: '14px'}}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={loading !== null}
            style={{
              width: '100%', backgroundColor: '#22c55e',
              color: 'black', fontWeight: '700', padding: '16px',
              borderRadius: '14px', border: 'none',
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              fontSize: '16px', opacity: loading !== null ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading === 'yearly' ? (
              <div style={{width: '20px', height: '20px', border: '2px solid black', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
            ) : 'Get Yearly Plan'}
          </button>
        </div>
      </div>

      {/* Bottom trust section */}
      <div style={{borderTop: '1px solid #1f2937', padding: '40px 24px', textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap'}}>
          {[
            { icon: Check, text: 'Cancel anytime' },
            { icon: Heart, text: 'Charity contribution included' },
            { icon: Trophy, text: 'Monthly prize draws' },
            { icon: Zap, text: 'Instant activation' },
          ].map((item, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <item.icon size={16} color="#22c55e" />
              <span style={{color: '#9ca3af', fontSize: '14px'}}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}