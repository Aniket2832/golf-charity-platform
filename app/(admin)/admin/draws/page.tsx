'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Target, Play, Eye, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [drawType, setDrawType] = useState<'random' | 'weighted'>('random')
  const [simulation, setSimulation] = useState<number[] | null>(null)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [rolloverAmount, setRolloverAmount] = useState(0)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [drawsData, subsData, rolloverData] = await Promise.all([
      supabase.from('draws').select('*, prize_pool_config(*)').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.rpc('get_jackpot_rollover')
    ])
    if (drawsData.data) setDraws(drawsData.data)
    setSubscriberCount(subsData.count || 0)
    setRolloverAmount(rolloverData.data || 0)
    setLoading(false)
  }

  const generateNumbers = async (type: 'random' | 'weighted') => {
    if (type === 'random') {
      const nums = new Set<number>()
      while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1)
      return [...nums]
    } else {
      const { data: scores } = await supabase.from('scores').select('score')
      const freq: Record<number, number> = {}
      scores?.forEach(s => { freq[s.score] = (freq[s.score] || 0) + 1 })
      const weighted: number[] = []
      for (let i = 1; i <= 45; i++) {
        const weight = Math.max(1, 10 - (freq[i] || 0))
        for (let j = 0; j < weight; j++) weighted.push(i)
      }
      const nums = new Set<number>()
      while (nums.size < 5) nums.add(weighted[Math.floor(Math.random() * weighted.length)])
      return [...nums]
    }
  }

  const handleSimulate = async () => {
    setRunning(true)
    const nums = await generateNumbers(drawType)
    setSimulation(nums)
    setRunning(false)
    toast.success('Simulation complete!')
  }

  const handleRunDraw = async () => {
    if (!confirm('Are you sure you want to run this draw?')) return
    setRunning(true)
    const month = new Date().toISOString().slice(0, 7)
    const numbers = await generateNumbers(drawType)

    const totalPool = subscriberCount * 9.99
    const tier5 = (totalPool * 0.4) + rolloverAmount
    const tier4 = totalPool * 0.35
    const tier3 = totalPool * 0.25

    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({
        month,
        draw_type: drawType,
        numbers,
        status: 'draft',
        rolled_jackpot_amt: rolloverAmount
      })
      .select().single()

    if (drawError) { toast.error('Failed to create draw'); setRunning(false); return }

    await supabase.from('prize_pool_config').insert({
      draw_id: draw.id,
      tier_5_amount: parseFloat(tier5.toFixed(2)),
      tier_4_amount: parseFloat(tier4.toFixed(2)),
      tier_3_amount: parseFloat(tier3.toFixed(2)),
      subscriber_count: subscriberCount
    })

    const { data: users } = await supabase.from('subscriptions').select('user_id').eq('status', 'active')
    if (users) {
      for (const user of users) {
        const { data: scores } = await supabase.from('scores').select('score').eq('user_id', user.user_id)
        if (!scores || scores.length === 0) continue
        const userScores = scores.map(s => s.score)
        const matched = numbers.filter(n => userScores.includes(n)).length
        if (matched >= 3) {
          const prizeAmount = matched === 5 ? tier5 : matched === 4 ? tier4 : tier3
          await supabase.from('draw_entries').insert({
            draw_id: draw.id, user_id: user.user_id,
            matched_count: matched, prize_amount: parseFloat(prizeAmount.toFixed(2)), payout_status: 'pending'
          })
        }
      }
    }
    toast.success('Draw created! Review and publish when ready.')
    setRunning(false)
    loadData()
  }

  const handlePublish = async (drawId: string) => {
  const { error } = await supabase.from('draws').update({ status: 'published' }).eq('id', drawId)
  if (error) { toast.error('Failed to publish'); return }

  // Send emails to all subscribers
  toast.loading('Sending notifications to all subscribers...')
  try {
    const res = await fetch('/api/email/draw-published', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drawId })
    })
    const data = await res.json()
    toast.dismiss()
    toast.success(`Draw published! ${data.emailsSent} subscribers notified.`)
  } catch (error) {
    toast.dismiss()
    toast.success('Draw published!')
  }
  loadData()
}

  const prizePool = subscriberCount * 9.99
  const jackpot = (prizePool * 0.4) + rolloverAmount

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Draw Management</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Run and manage monthly prize draws</p>
      </div>

      {/* Draw engine */}
      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '20px'}}>Run New Draw</h2>

        {/* Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px'}}>
          <div style={{backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
            <p style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>{subscriberCount}</p>
            <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>Active Subscribers</p>
          </div>
          <div style={{backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
            <p style={{fontSize: '24px', fontWeight: 'bold', color: '#22c55e'}}>£{prizePool.toFixed(2)}</p>
            <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>Total Prize Pool</p>
          </div>
          <div style={{backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
            <p style={{fontSize: '24px', fontWeight: 'bold', color: '#eab308'}}>£{jackpot.toFixed(2)}</p>
            <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>Jackpot (5 Match)</p>
            {rolloverAmount > 0 && (
              <p style={{color: '#eab308', fontSize: '11px', marginTop: '2px'}}>
                Includes £{rolloverAmount.toFixed(2)} rollover!
              </p>
            )}
          </div>
        </div>

        {/* Rollover banner */}
        {rolloverAmount > 0 && (
          <div style={{
            backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
            borderRadius: '12px', padding: '12px 16px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{fontSize: '20px'}}>🎰</span>
            <div>
              <p style={{color: '#eab308', fontWeight: '600', fontSize: '14px'}}>
                Jackpot Rollover Active!
              </p>
              <p style={{color: '#9ca3af', fontSize: '13px'}}>
                £{rolloverAmount.toFixed(2)} carried forward from last month — jackpot is now £{jackpot.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Draw type */}
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px'}}>Draw Type</label>
          <div style={{display: 'flex', gap: '8px'}}>
            {(['random', 'weighted'] as const).map(type => (
              <button key={type} onClick={() => setDrawType(type)}
                style={{
                  padding: '8px 16px', borderRadius: '12px', fontSize: '14px',
                  fontWeight: '600', border: 'none', cursor: 'pointer',
                  textTransform: 'capitalize',
                  backgroundColor: drawType === type ? '#a78bfa' : '#1f2937',
                  color: drawType === type ? 'white' : '#9ca3af'
                }}>
                {type === 'random' ? 'Random' : 'Weighted (by score frequency)'}
              </button>
            ))}
          </div>
        </div>

        {/* Simulation result */}
        {simulation && (
          <div style={{backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px', marginBottom: '16px'}}>
            <p style={{color: '#9ca3af', fontSize: '13px', marginBottom: '8px'}}>Simulated numbers:</p>
            <div style={{display: 'flex', gap: '8px'}}>
              {simulation.map((num, i) => (
                <div key={i} style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#a78bfa', fontWeight: 'bold', fontSize: '14px'
                }}>
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{display: 'flex', gap: '12px'}}>
          <button onClick={handleSimulate} disabled={running}
            style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1f2937', color: 'white', fontWeight: '600', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer'}}>
            <Eye size={16} /> Simulate
          </button>
          <button onClick={handleRunDraw} disabled={running}
            style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ef4444', color: 'white', fontWeight: '600', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer'}}>
            <Play size={16} /> {running ? 'Running...' : 'Run Draw'}
          </button>
        </div>
      </div>

      {/* Draws list */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        {draws.length === 0 ? (
          <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
            <Target size={48} color="#374151" style={{margin: '0 auto 12px'}} />
            <p style={{color: 'white', fontWeight: '600'}}>No draws yet</p>
            <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>Run your first draw above</p>
          </div>
        ) : draws.map(draw => (
          <div key={draw.id} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
              <div>
                <h3 style={{color: 'white', fontWeight: '600', fontSize: '18px'}}>
                  Draw — {draw.month}
                  {draw.rolled_jackpot_amt > 0 && (
                    <span style={{marginLeft: '8px', backgroundColor: 'rgba(234,179,8,0.2)', color: '#eab308', fontSize: '11px', padding: '3px 8px', borderRadius: '999px', fontWeight: '500'}}>
                      Rollover included
                    </span>
                  )}
                </h3>
                <p style={{color: '#9ca3af', fontSize: '13px', textTransform: 'capitalize'}}>{draw.draw_type} draw</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                  backgroundColor: draw.status === 'published' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                  color: draw.status === 'published' ? '#22c55e' : '#eab308'
                }}>
                  {draw.status}
                </span>
                {draw.status === 'draft' && (
                  <button onClick={() => handlePublish(draw.id)}
                    style={{display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '6px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px'}}>
                    <Check size={14} /> Publish
                  </button>
                )}
              </div>
            </div>

            <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
              {draw.numbers?.map((num: number, i: number) => (
                <div key={i} style={{
                  width: '40px', height: '40px', backgroundColor: '#1f2937',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px'
                }}>
                  {num}
                </div>
              ))}
            </div>

            {draw.prize_pool_config && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                {[
                  { label: '5 Match Jackpot', value: draw.prize_pool_config.tier_5_amount, color: '#eab308' },
                  { label: '4 Match', value: draw.prize_pool_config.tier_4_amount, color: '#60a5fa' },
                  { label: '3 Match', value: draw.prize_pool_config.tier_3_amount, color: '#22c55e' },
                ].map((tier, i) => (
                  <div key={i} style={{backgroundColor: '#1f2937', borderRadius: '12px', padding: '12px', textAlign: 'center'}}>
                    <p style={{color: tier.color, fontWeight: 'bold'}}>£{tier.value}</p>
                    <p style={{color: '#6b7280', fontSize: '12px'}}>{tier.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}