'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Heart, Target, Award, TrendingUp } from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, totalCharities: 0, totalDraws: 0, pendingWinners: 0, totalPrizePool: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    const [users, activeSubs, charities, draws, pendingWinners, entries] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('charities').select('id', { count: 'exact' }),
      supabase.from('draws').select('id', { count: 'exact' }),
      supabase.from('winner_verifications').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('draw_entries').select('prize_amount')
    ])
    const totalPrize = entries.data?.reduce((sum, e) => sum + (e.prize_amount || 0), 0) || 0
    setStats({ totalUsers: users.count || 0, activeSubscribers: activeSubs.count || 0, totalCharities: charities.count || 0, totalDraws: draws.count || 0, pendingWinners: pendingWinners.count || 0, totalPrizePool: totalPrize })
    setLoading(false)
  }

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: TrendingUp, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Charities', value: stats.totalCharities, icon: Heart, color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
    { label: 'Total Draws', value: stats.totalDraws, icon: Target, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { label: 'Pending Winners', value: stats.pendingWinners, icon: Award, color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
    { label: 'Total Prize Pool', value: `£${stats.totalPrizePool.toFixed(2)}`, icon: TrendingUp, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  ]

  const quickActions = [
    { label: 'Manage Users', href: '/admin/users', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
    { label: 'Run Draw', href: '/admin/draws', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
    { label: 'Verify Winners', href: '/admin/winners', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
    { label: 'Add Charity', href: '/admin/charities', color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)' },
  ]

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Admin Overview</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Platform statistics and quick actions</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
        {statCards.map((card, i) => (
          <div key={i} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{width: '40px', height: '40px', backgroundColor: card.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <card.icon size={20} color={card.color} />
              </div>
              <span style={{color: '#9ca3af', fontSize: '13px'}}>{card.label}</span>
            </div>
            <p style={{fontSize: '28px', fontWeight: 'bold', color: card.color}}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px'}}>Quick Actions</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
          {quickActions.map((action, i) => (
            <a key={i} href={action.href} style={{
              backgroundColor: action.bg, border: `1px solid ${action.border}`,
              borderRadius: '12px', padding: '16px', textAlign: 'center',
              color: action.color, fontWeight: '600', fontSize: '14px', textDecoration: 'none'
            }}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}