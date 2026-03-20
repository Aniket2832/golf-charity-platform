'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', image_url: '', featured: false })
  const supabase = createClient()

  useEffect(() => { loadCharities() }, [])

  const loadCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false })
    if (data) setCharities(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      const { error } = await supabase.from('charities').update(form).eq('id', editing.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('Charity updated!')
    } else {
      const { error } = await supabase.from('charities').insert(form)
      if (error) { toast.error('Failed to add'); return }
      toast.success('Charity added!')
    }
    setForm({ name: '', description: '', image_url: '', featured: false })
    setShowForm(false); setEditing(null)
    loadCharities()
  }

  const handleEdit = (charity: any) => {
    setEditing(charity)
    setForm({ name: charity.name, description: charity.description || '', image_url: charity.image_url || '', featured: charity.featured || false })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this charity?')) return
    const { error } = await supabase.from('charities').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Deleted!')
    loadCharities()
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    await supabase.from('charities').update({ featured: !featured }).eq('id', id)
    loadCharities()
  }

  const inputStyle = {width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none'}

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Charities</h1>
          <p style={{color: '#9ca3af', marginTop: '4px'}}>{charities.length} charities listed</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', image_url: '', featured: false }) }}
          style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ef4444', color: 'white', fontWeight: '600', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer'}}>
          <Plus size={16} /> Add Charity
        </button>
      </div>

      {showForm && (
        <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
          <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px'}}>{editing ? 'Edit Charity' : 'Add New Charity'}</h2>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Charity Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} placeholder="e.g. Cancer Research UK" />
            </div>
            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                style={{...inputStyle, resize: 'vertical'}} placeholder="Brief description..." />
            </div>
            <div>
              <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Image URL</label>
              <input type="url" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} style={inputStyle} placeholder="https://..." />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} style={{accentColor: '#ef4444'}} />
              <label htmlFor="featured" style={{color: '#d1d5db', fontSize: '14px'}}>Feature on homepage</label>
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button type="submit" style={{backgroundColor: '#ef4444', color: 'white', fontWeight: '600', padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer'}}>
                {editing ? 'Update' : 'Add Charity'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }}
                style={{backgroundColor: '#1f2937', color: 'white', fontWeight: '600', padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer'}}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {charities.map(charity => (
          <div key={charity.id} style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              {charity.image_url && (
                <img src={charity.image_url} alt={charity.name} style={{width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0}} />
              )}
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                  <p style={{color: 'white', fontWeight: '600'}}>{charity.name}</p>
                  {charity.featured && (
                    <span style={{backgroundColor: 'rgba(234,179,8,0.2)', color: '#eab308', fontSize: '11px', padding: '2px 8px', borderRadius: '999px'}}>Featured</span>
                  )}
                </div>
                <p style={{color: '#9ca3af', fontSize: '13px'}}>{charity.description}</p>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0}}>
                <button onClick={() => toggleFeatured(charity.id, charity.featured)}
                  style={{background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: charity.featured ? '#eab308' : '#4b5563'}}>
                  <Star size={18} />
                </button>
                <button onClick={() => handleEdit(charity)}
                  style={{background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#60a5fa'}}>
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(charity.id)}
                  style={{background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444'}}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}