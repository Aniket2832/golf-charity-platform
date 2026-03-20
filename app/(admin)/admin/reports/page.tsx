'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Heart, Target, Award, TrendingUp } from 'lucide-react'

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    const [users, activeSubs, cancelledSubs, charities, draws, publishedDraws, entries, paidEntries, verifications] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'cancelled'),
      supabase.from('charities').select('id', { count: 'exact' }),
      supabase.from('draws').select('id', { count: 'exact' }),
      supabase.from('draws').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('draw_entries').select('prize_amount, matched_count'),
      supabase.from('draw_entries').select('prize_amount').eq('payout_status', 'paid'),
      supabase.from('winner_verifications').select('status')
    ])
    const totalPrize = entries.data?.reduce((s, e) => s + (e.prize_amount || 0), 0) || 0
    const paidPrize = paidEntries.data?.reduce((s, e) => s + (e.prize_amount || 0), 0) || 0
    const activeCount = activeSubs.count || 0
    const monthlyRevenue = activeCount * 9.99
    const charityContribution = monthlyRevenue * 0.1
    const matchCounts = { 3: 0, 4: 0, 5: 0 }
    entries.data?.forEach(e => { if (e.matched_count in matchCounts) matchCounts[e.matched_count as keyof typeof matchCounts]++ })
    setStats({
      totalUsers: users.count || 0, activeSubscribers: activeCount, cancelledSubscribers: cancelledSubs.count || 0,
      totalCharities: charities.count || 0, totalDraws: draws.count || 0, publishedDraws: publishedDraws.count || 0,
      totalPrizePool: totalPrize, paidPrize, monthlyRevenue, charityContribution, matchCounts,
      pendingVerifications: verifications.data?.filter(v => v.status === 'pending').length || 0,
      approvedVerifications: verifications.data?.filter(v => v.status === 'approved').length || 0
    })
    setLoading(false)
  }

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  const cardStyle = {backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', marginBottom: '16px'}
  const statBox = {backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px'}

  return (
    <div style={{maxWidth: '900px'}}>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Reports & Analytics</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Platform performance overview</p>
      </div>

      {/* Revenue */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <TrendingUp size={20} color="#22c55e" /> Revenue Overview
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
          {[
            { label: 'Monthly Revenue', value: `£${stats.monthlyRevenue.toFixed(2)}`, sub: `${stats.activeSubscribers} active subscribers`, color: '#22c55e' },
            { label: 'Charity Contributions', value: `£${stats.charityContribution.toFixed(2)}`, sub: '10% minimum of revenue', color: '#f472b6' },
            { label: 'Total Prize Pool', value: `£${stats.totalPrizePool.toFixed(2)}`, sub: `£${stats.paidPrize.toFixed(2)} paid out`, color: '#eab308' },
          ].map((s, i) => (
            <div key={i} style={statBox}>
              <p style={{color: '#9ca3af', fontSize: '13px'}}>{s.label}</p>
              <p style={{fontSize: '24px', fontWeight: 'bold', color: s.color, marginTop: '4px'}}>{s.value}</p>
              <p style={{color: '#6b7280', fontSize: '12px', marginTop: '4px'}}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Users size={20} color="#60a5fa" /> User Statistics
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px'}}>
          {[
            { label: 'Total Users', value: stats.totalUsers, color: 'white' },
            { label: 'Active Subscribers', value: stats.activeSubscribers, color: '#22c55e' },
            { label: 'Cancelled', value: stats.cancelledSubscribers, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={statBox}>
              <p style={{color: '#9ca3af', fontSize: '13px'}}>{s.label}</p>
              <p style={{fontSize: '24px', fontWeight: 'bold', color: s.color, marginTop: '4px'}}>{s.value}</p>
            </div>
          ))}
        </div>
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9ca3af', marginBottom: '6px'}}>
            <span>Subscription rate</span>
            <span>{stats.totalUsers > 0 ? Math.round((stats.activeSubscribers / stats.totalUsers) * 100) : 0}%</span>
          </div>
          <div style={{width: '100%', backgroundColor: '#1f2937', borderRadius: '999px', height: '8px'}}>
            <div style={{
              height: '8px', borderRadius: '999px', backgroundColor: '#22c55e',
              width: `${stats.totalUsers > 0 ? (stats.activeSubscribers / stats.totalUsers) * 100 : 0}%`
            }} />
          </div>
        </div>
      </div>

      {/* Draws */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Target size={20} color="#a78bfa" /> Draw Statistics
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
          {[
            { label: 'Total Draws', value: stats.totalDraws, color: 'white' },
            { label: 'Published', value: stats.publishedDraws, color: '#22c55e' },
            { label: '5-Match Winners', value: stats.matchCounts[5], color: '#eab308' },
            { label: 'Total Winners', value: stats.matchCounts[3] + stats.matchCounts[4] + stats.matchCounts[5], color: '#60a5fa' },
          ].map((s, i) => (
            <div key={i} style={{...statBox, textAlign: 'center'}}>
              <p style={{fontSize: '24px', fontWeight: 'bold', color: s.color}}>{s.value}</p>
              <p style={{color: '#9ca3af', fontSize: '12px', marginTop: '4px'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verifications */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Award size={20} color="#eab308" /> Winner Verifications
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
          <div style={{backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: '#eab308'}}>{stats.pendingVerifications}</p>
            <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>Pending Review</p>
          </div>
          <div style={{backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: '#22c55e'}}>{stats.approvedVerifications}</p>
            <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>Approved</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}