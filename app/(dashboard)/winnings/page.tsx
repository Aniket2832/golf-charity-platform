'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Award, Upload, CheckCircle, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WinningsPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('draw_entries')
      .select('*, draws(*), winner_verifications(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
    setLoading(false)
  }

  const handleProofUpload = async (entryId: string, file: File) => {
    setUploading(entryId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const filePath = `${user.id}/${entryId}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('winner-proofs').upload(filePath, file)
    if (uploadError) { toast.error('Failed to upload proof'); setUploading(null); return }
    const { data: { publicUrl } } = supabase.storage.from('winner-proofs').getPublicUrl(filePath)
    const { error } = await supabase.from('winner_verifications').upsert({ draw_entry_id: entryId, proof_url: publicUrl, status: 'pending' }, { onConflict: 'draw_entry_id' })
    if (error) { toast.error('Failed to submit proof'); setUploading(null); return }
    toast.success('Proof submitted! Awaiting admin review.')
    setUploading(null)
    loadData()
  }

  const totalWon = entries.filter(e => e.winner_verifications?.status === 'approved').reduce((sum, e) => sum + (e.prize_amount || 0), 0)

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>My Winnings</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Track your prize wins and verification status</p>
      </div>

      {/* Total won */}
      <div style={{backgroundColor: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '16px', padding: '24px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{width: '56px', height: '56px', backgroundColor: 'rgba(234,179,8,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Award size={28} color="#eab308" />
          </div>
          <div>
            <p style={{color: '#9ca3af', fontSize: '13px'}}>Total Won</p>
            <p style={{fontSize: '40px', fontWeight: 'bold', color: 'white'}}>£{totalWon.toFixed(2)}</p>
            <p style={{color: '#9ca3af', fontSize: '13px', marginTop: '4px'}}>{entries.length} prize(s) total</p>
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
          <Award size={48} color="#374151" style={{margin: '0 auto 12px'}} />
          <p style={{color: 'white', fontWeight: '600'}}>No winnings yet</p>
          <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>Keep entering scores to participate in draws!</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {entries.map(entry => (
            <div key={entry.id} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
              <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px'}}>
                <div>
                  <h3 style={{color: 'white', fontWeight: '600'}}>Draw — {entry.draws?.month}</h3>
                  <p style={{color: '#9ca3af', fontSize: '13px'}}>{entry.matched_count}-Number Match</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{fontSize: '28px', fontWeight: 'bold', color: '#22c55e'}}>£{entry.prize_amount?.toFixed(2) || '0.00'}</p>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                    backgroundColor: entry.payout_status === 'paid' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                    color: entry.payout_status === 'paid' ? '#22c55e' : '#eab308'
                  }}>
                    {entry.payout_status}
                  </span>
                </div>
              </div>

              {entry.winner_verifications ? (
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1f2937', borderRadius: '12px', padding: '12px'}}>
                  {entry.winner_verifications.status === 'approved' && <CheckCircle size={20} color="#22c55e" />}
                  {entry.winner_verifications.status === 'rejected' && <XCircle size={20} color="#ef4444" />}
                  {entry.winner_verifications.status === 'pending' && <Clock size={20} color="#eab308" />}
                  <span style={{
                    color: entry.winner_verifications.status === 'approved' ? '#22c55e' :
                           entry.winner_verifications.status === 'rejected' ? '#ef4444' : '#eab308',
                    fontSize: '14px', fontWeight: '500', textTransform: 'capitalize'
                  }}>
                    {entry.winner_verifications.status === 'pending' ? 'Pending Review' :
                     entry.winner_verifications.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              ) : (
                <div>
                  <p style={{color: '#9ca3af', fontSize: '13px', marginBottom: '8px'}}>Upload proof of your score to claim your prize</p>
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    backgroundColor: '#22c55e', color: 'black', fontWeight: '600',
                    padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px'
                  }}>
                    {uploading === entry.id ? (
                      <div style={{width: '16px', height: '16px', border: '2px solid black', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                    ) : (
                      <Upload size={16} />
                    )}
                    {uploading === entry.id ? 'Uploading...' : 'Upload Proof'}
                    <input type="file" accept="image/*,.pdf" style={{display: 'none'}}
                      onChange={e => { if (e.target.files?.[0]) handleProofUpload(entry.id, e.target.files[0]) }}
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}