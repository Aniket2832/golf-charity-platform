'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ScoresPage() {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ score: '', played_at: '' })
  const supabase = createClient()

  useEffect(() => { loadScores() }, [])

  const loadScores = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false })
    if (data) setScores(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const scoreNum = parseInt(form.score)
    if (scoreNum < 1 || scoreNum > 45) { toast.error('Score must be between 1 and 45'); return }
    if (!form.played_at) { toast.error('Please select a date'); return }
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('scores').insert({ user_id: user.id, score: scoreNum, played_at: form.played_at })
    if (error) { toast.error('Failed to save score'); setSubmitting(false); return }
    toast.success('Score added!')
    setForm({ score: '', played_at: '' })
    loadScores()
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('scores').delete().eq('id', id)
    if (error) { toast.error('Failed to delete score'); return }
    toast.success('Score deleted')
    loadScores()
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>My Scores</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Enter your Stableford scores (1-45). Only your latest 5 are kept.</p>
      </div>

      {/* Add score form */}
      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Plus size={20} color="#22c55e" /> Add New Score
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Stableford Score</label>
              <input
                type="number" min="1" max="45" required
                value={form.score}
                onChange={e => setForm({...form, score: e.target.value})}
                placeholder="e.g. 36"
                style={{width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none'}}
              />
            </div>
            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Date Played</label>
              <input
                type="date" required
                value={form.played_at}
                onChange={e => setForm({...form, played_at: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                style={{width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none'}}
              />
            </div>
          </div>
          <button
            type="submit" disabled={submitting}
            style={{width: '100%', backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px'}}
          >
            {submitting ? 'Saving...' : 'Add Score'}
          </button>
        </form>
      </div>

      {/* Scores list */}
      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Trophy size={20} color="#eab308" /> Your Last 5 Scores
        </h2>

        {loading ? (
          <div style={{display: 'flex', justifyContent: 'center', padding: '32px'}}>
            <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
          </div>
        ) : scores.length === 0 ? (
          <div style={{textAlign: 'center', padding: '32px'}}>
            <Trophy size={48} color="#374151" style={{margin: '0 auto 12px'}} />
            <p style={{color: '#6b7280'}}>No scores yet. Add your first score above!</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {scores.map((score, i) => (
              <div key={score.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{width: '40px', height: '40px', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{color: '#22c55e', fontWeight: 'bold'}}>{i + 1}</span>
                  </div>
                  <div>
                    <p style={{color: 'white', fontWeight: '600', fontSize: '18px'}}>{score.score} pts</p>
                    <p style={{color: '#9ca3af', fontSize: '13px'}}>
                      {new Date(score.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(score.id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '8px'}}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {scores.length > 0 && (
          <div style={{marginTop: '16px', backgroundColor: '#1f2937', borderRadius: '12px', padding: '12px', textAlign: 'center'}}>
            <p style={{color: '#9ca3af', fontSize: '14px'}}>
              Average score: <span style={{color: '#22c55e', fontWeight: '600'}}>
                {Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length)} pts
              </span>
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}