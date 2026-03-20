'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Award, CheckCircle, XCircle, Eye, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminWinnersPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const supabase = createClient()

  useEffect(() => { loadEntries() }, [])

  const loadEntries = async () => {
    const { data } = await supabase.from('draw_entries').select('*, draws(*), users(*), winner_verifications(*)').order('created_at', { ascending: false })
    if (data) setEntries(data)
    setLoading(false)
  }

  const handleVerify = async (verificationId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('winner_verifications').update({ status, reviewed_at: new Date().toISOString() }).eq('id', verificationId)
    if (error) { toast.error('Failed to update'); return }
    toast.success(status === 'approved' ? 'Winner approved!' : 'Submission rejected.')
    loadEntries()
  }

  const handleMarkPaid = async (entryId: string) => {
    const { error } = await supabase.from('draw_entries').update({ payout_status: 'paid' }).eq('id', entryId)
    if (error) { toast.error('Failed to update'); return }
    toast.success('Marked as paid!')
    loadEntries()
  }

  const filtered = entries.filter(e => {
    if (filter === 'all') return true
    if (filter === 'pending') return e.winner_verifications?.status === 'pending' || !e.winner_verifications
    return e.winner_verifications?.status === filter
  })

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Winners Management</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Verify winner submissions and manage payouts</p>
      </div>

      <div style={{display: 'flex', gap: '8px'}}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
              textTransform: 'capitalize', border: 'none', cursor: 'pointer',
              backgroundColor: filter === f ? '#ef4444' : '#1f2937',
              color: filter === f ? 'white' : '#9ca3af'
            }}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
          <Award size={48} color="#374151" style={{margin: '0 auto 12px'}} />
          <p style={{color: 'white', fontWeight: '600'}}>No winners found</p>
          <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>Winners appear here after draws are published</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {filtered.map(entry => (
            <div key={entry.id} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
              <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '14px'}}>
                    {entry.users?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p style={{color: 'white', fontWeight: '600'}}>{entry.users?.full_name}</p>
                    <p style={{color: '#6b7280', fontSize: '12px'}}>{entry.users?.email}</p>
                    <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>
                      Draw: {entry.draws?.month} — <span style={{color: '#22c55e', fontWeight: '600'}}>{entry.matched_count}-Number Match</span>
                    </p>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#22c55e'}}>£{entry.prize_amount?.toFixed(2)}</p>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                    backgroundColor: entry.payout_status === 'paid' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                    color: entry.payout_status === 'paid' ? '#22c55e' : '#eab308'
                  }}>
                    {entry.payout_status}
                  </span>
                </div>
              </div>

              <div style={{borderTop: '1px solid #1f2937', paddingTop: '16px'}}>
                {entry.winner_verifications ? (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      {entry.winner_verifications.status === 'approved' && <CheckCircle size={20} color="#22c55e" />}
                      {entry.winner_verifications.status === 'rejected' && <XCircle size={20} color="#ef4444" />}
                      {entry.winner_verifications.status === 'pending' && <Clock size={20} color="#eab308" />}
                      <span style={{
                        fontSize: '14px', fontWeight: '500', textTransform: 'capitalize',
                        color: entry.winner_verifications.status === 'approved' ? '#22c55e' :
                               entry.winner_verifications.status === 'rejected' ? '#ef4444' : '#eab308'
                      }}>
                        {entry.winner_verifications.status}
                      </span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      {entry.winner_verifications.proof_url && (
                        <a href={entry.winner_verifications.proof_url} target="_blank" rel="noopener noreferrer"
                          style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#60a5fa', fontSize: '14px', textDecoration: 'none'}}>
                          <Eye size={16} /> View Proof
                        </a>
                      )}
                      {entry.winner_verifications.status === 'pending' && (
                        <>
                          <button onClick={() => handleVerify(entry.winner_verifications.id, 'approved')}
                            style={{display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px'}}>
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button onClick={() => handleVerify(entry.winner_verifications.id, 'rejected')}
                            style={{display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#ef4444', color: 'white', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px'}}>
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                      {entry.winner_verifications.status === 'approved' && entry.payout_status === 'pending' && (
                        <button onClick={() => handleMarkPaid(entry.id)}
                          style={{backgroundColor: '#a78bfa', color: 'white', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px'}}>
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{color: '#6b7280', fontSize: '14px'}}>No proof submitted yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}