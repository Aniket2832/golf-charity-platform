'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CharityPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [selectedCharity, setSelectedCharity] = useState<string>('')
  const [charityPct, setCharityPct] = useState<number>(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [charitiesData, userData] = await Promise.all([
      supabase.from('charities').select('*'),
      supabase.from('users').select('*, charities(*)').eq('id', user.id).single()
    ])
    if (charitiesData.data) setCharities(charitiesData.data)
    if (userData.data) { setUser(userData.data); setSelectedCharity(userData.data.charity_id || ''); setCharityPct(userData.data.charity_pct || 10) }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('users').update({ charity_id: selectedCharity || null, charity_pct: charityPct }).eq('id', user.id)
    if (error) { toast.error('Failed to save'); setSaving(false); return }
    toast.success('Charity preferences saved!')
    setSaving(false)
    loadData()
  }

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>My Charity</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Choose which charity receives a portion of your subscription</p>
      </div>

      {user?.charities && (
        <div style={{backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '24px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{width: '48px', height: '48px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Heart size={24} color="#22c55e" />
            </div>
            <div>
              <p style={{color: '#22c55e', fontSize: '13px', fontWeight: '500'}}>Currently supporting</p>
              <p style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>{user.charities.name}</p>
              <p style={{color: '#9ca3af', fontSize: '13px'}}>{charityPct}% of your subscription</p>
            </div>
          </div>
        </div>
      )}

      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '8px'}}>Contribution Percentage</h2>
        <p style={{color: '#9ca3af', fontSize: '13px', marginBottom: '16px'}}>Minimum 10%. You can increase this to give more.</p>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <input type="range" min="10" max="100" step="5" value={charityPct}
            onChange={e => setCharityPct(parseInt(e.target.value))}
            style={{flex: 1, accentColor: '#22c55e'}}
          />
          <div style={{width: '64px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '8px', textAlign: 'center'}}>
            <span style={{color: '#22c55e', fontWeight: 'bold'}}>{charityPct}%</span>
          </div>
        </div>
      </div>

      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px'}}>Choose a Charity</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {charities.map(charity => (
            <div key={charity.id} onClick={() => setSelectedCharity(charity.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                borderRadius: '12px', border: selectedCharity === charity.id ? '1px solid #22c55e' : '1px solid #374151',
                backgroundColor: selectedCharity === charity.id ? 'rgba(34,197,94,0.05)' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              {charity.image_url && (
                <img src={charity.image_url} alt={charity.name} style={{width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0}} />
              )}
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                  <p style={{color: 'white', fontWeight: '600'}}>{charity.name}</p>
                  {charity.featured && (
                    <span style={{backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e', fontSize: '11px', padding: '2px 8px', borderRadius: '999px'}}>Featured</span>
                  )}
                </div>
                <p style={{color: '#9ca3af', fontSize: '13px'}}>{charity.description}</p>
              </div>
              {selectedCharity === charity.id && (
                <div style={{width: '24px', height: '24px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Check size={14} color="black" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{width: '100%', backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px'}}
      >
        {saving ? 'Saving...' : 'Save Charity Preferences'}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}