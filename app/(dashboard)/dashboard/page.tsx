'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Heart, Target, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [charity, setCharity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [userData, subData, scoresData] = await Promise.all([
      supabase.from('users').select('*, charities(*)').eq('id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
      supabase.from('scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false }).limit(5)
    ])
    if (userData.data) { setUser(userData.data); setCharity(userData.data.charities) }
    if (subData.data) setSubscription(subData.data)
    if (scoresData.data) setScores(scoresData.data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
        <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
      </div>
    )
  }

  const renewalDate = subscription?.period_end
    ? new Date(subscription.period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A'

  const statCards = [
    { label: 'Subscription', value: subscription?.status || 'Inactive', sub: `Renews ${renewalDate}`, icon: Calendar, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Scores Entered', value: `${scores.length} / 5`, sub: 'Stableford format', icon: Trophy, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { label: 'Charity', value: charity?.name || 'Not selected', sub: `${user?.charity_pct || 10}% contribution`, icon: Heart, color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
    { label: 'Next Draw', value: 'Monthly Draw', sub: 'End of month', icon: Target, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  ]

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>
          Welcome back, {user?.full_name || 'Golfer'} 👋
        </h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Here is your platform overview</p>
      </div>

      {/* Stats cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
        {statCards.map((card, i) => (
          <div key={i} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{width: '40px', height: '40px', backgroundColor: card.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <card.icon size={20} color={card.color} />
              </div>
              <span style={{color: '#9ca3af', fontSize: '13px'}}>{card.label}</span>
            </div>
            <p style={{color: 'white', fontWeight: '600', fontSize: '15px', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{card.value}</p>
            <p style={{color: '#6b7280', fontSize: '12px', marginTop: '4px'}}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent scores */}
      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
          <h2 style={{color: 'white', fontWeight: '600', fontSize: '18px'}}>Recent Scores</h2>
          <a href="/scores" style={{color: '#22c55e', fontSize: '14px'}}>View all</a>
        </div>
        {scores.length === 0 ? (
          <div style={{textAlign: 'center', padding: '32px'}}>
            <Trophy size={48} color="#374151" style={{margin: '0 auto 12px'}} />
            <p style={{color: '#6b7280'}}>No scores entered yet</p>
            <a href="/scores" style={{
              display: 'inline-block', marginTop: '12px', backgroundColor: '#22c55e',
              color: 'black', fontWeight: '600', padding: '8px 16px', borderRadius: '12px', fontSize: '14px'
            }}>
              Enter your first score
            </a>
          </div>
        ) : (
          <div>
            {scores.map((score, i) => (
              <div key={score.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: i < scores.length - 1 ? '1px solid #1f2937' : 'none'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '32px', height: '32px', backgroundColor: '#1f2937', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px'}}>
                    {i + 1}
                  </div>
                  <div>
                    <p style={{color: 'white', fontSize: '14px'}}>
                      {new Date(score.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{color: '#6b7280', fontSize: '12px'}}>Stableford</p>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <span style={{fontSize: '24px', fontWeight: 'bold', color: '#22c55e'}}>{score.score}</span>
                  <p style={{color: '#6b7280', fontSize: '12px'}}>points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charity banner */}
      {charity && (
        <div style={{backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '24px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{width: '48px', height: '48px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Heart size={24} color="#22c55e" />
            </div>
            <div>
              <p style={{color: 'white', fontWeight: '600'}}>Supporting {charity.name}</p>
              <p style={{color: '#9ca3af', fontSize: '14px'}}>{user?.charity_pct || 10}% of your subscription goes directly to this charity</p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}