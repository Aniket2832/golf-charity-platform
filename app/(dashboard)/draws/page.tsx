'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Target, Clock } from 'lucide-react'

export default function DrawsPage() {
  const [draws, setDraws] = useState<any[]>([])
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [drawsData, scoresData] = await Promise.all([
      supabase.from('draws').select('*, prize_pool_config(*)').eq('status', 'published').order('created_at', { ascending: false }),
      supabase.from('scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false })
    ])
    if (drawsData.data) setDraws(drawsData.data)
    if (scoresData.data) setScores(scoresData.data)
    setLoading(false)
  }

  const getMatchCount = (drawNumbers: number[], userScores: any[]) => {
    return drawNumbers.filter(n => userScores.map(s => s.score).includes(n)).length
  }

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Draws</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Monthly prize draws based on your Stableford scores</p>
      </div>

      {/* How it works */}
      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px'}}>How Draws Work</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
          {[
            { match: '5 Match', prize: '40% of pool', color: '#eab308', bg: 'rgba(234,179,8,0.1)', rollover: true },
            { match: '4 Match', prize: '35% of pool', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', rollover: false },
            { match: '3 Match', prize: '25% of pool', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', rollover: false },
          ].map((tier, i) => (
            <div key={i} style={{backgroundColor: tier.bg, borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
              <p style={{color: tier.color, fontWeight: 'bold', fontSize: '18px'}}>{tier.match}</p>
              <p style={{color: 'white', fontSize: '13px', marginTop: '4px'}}>{tier.prize}</p>
              {tier.rollover && <p style={{color: '#eab308', fontSize: '11px', marginTop: '4px'}}>Jackpot rolls over!</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Your scores */}
      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '12px'}}>Your Current Scores</h2>
        {scores.length === 0 ? (
          <p style={{color: '#6b7280', fontSize: '14px'}}>No scores entered yet. Go to My Scores to add them.</p>
        ) : (
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
            {scores.map(score => (
              <div key={score.id} style={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '8px 16px'}}>
                <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '18px'}}>{score.score}</span>
                <span style={{color: '#6b7280', fontSize: '12px', marginLeft: '4px'}}>pts</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draws list */}
      {draws.length === 0 ? (
        <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
          <Clock size={48} color="#374151" style={{margin: '0 auto 12px'}} />
          <p style={{color: 'white', fontWeight: '600'}}>No draws published yet</p>
          <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>Check back at the end of the month</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {draws.map(draw => {
            const matchCount = getMatchCount(draw.numbers, scores)
            const isWinner = matchCount >= 3
            return (
              <div key={draw.id} style={{
                backgroundColor: '#111827',
                border: `1px solid ${isWinner ? '#22c55e' : '#1f2937'}`,
                borderRadius: '16px', padding: '24px'
              }}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                  <div>
                    <h3 style={{color: 'white', fontWeight: '600', fontSize: '18px'}}>Draw — {draw.month}</h3>
                    <p style={{color: '#9ca3af', fontSize: '13px', textTransform: 'capitalize'}}>{draw.draw_type} draw</p>
                  </div>
                  {isWinner && (
                    <div style={{backgroundColor: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '6px 12px'}}>
                      <p style={{color: '#22c55e', fontSize: '13px', fontWeight: '600'}}>{matchCount} Match Winner!</p>
                    </div>
                  )}
                </div>

                <div style={{marginBottom: '16px'}}>
                  <p style={{color: '#9ca3af', fontSize: '13px', marginBottom: '8px'}}>Winning numbers:</p>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {draw.numbers.map((num: number, i: number) => {
                      const isMatch = scores.map((s: any) => s.score).includes(num)
                      return (
                        <div key={i} style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '14px',
                          backgroundColor: isMatch ? '#22c55e' : '#1f2937',
                          color: isMatch ? 'black' : '#9ca3af'
                        }}>
                          {num}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {draw.prize_pool_config && (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                    {[
                      { label: '5 Match', amount: draw.prize_pool_config.tier_5_amount, color: '#eab308' },
                      { label: '4 Match', amount: draw.prize_pool_config.tier_4_amount, color: '#60a5fa' },
                      { label: '3 Match', amount: draw.prize_pool_config.tier_3_amount, color: '#22c55e' },
                    ].map((tier, i) => (
                      <div key={i} style={{backgroundColor: '#1f2937', borderRadius: '12px', padding: '12px', textAlign: 'center'}}>
                        <p style={{color: tier.color, fontWeight: 'bold'}}>£{tier.amount || 0}</p>
                        <p style={{color: '#6b7280', fontSize: '12px'}}>{tier.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}