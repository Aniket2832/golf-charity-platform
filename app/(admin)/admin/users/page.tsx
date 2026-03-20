'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    const { data } = await supabase.from('users').select('*, subscriptions(*), charities(name)').order('created_at', { ascending: false })
    if (data) setUsers(data)
    setLoading(false)
  }

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    const { error } = await supabase.from('users').update({ is_admin: !isAdmin }).eq('id', userId)
    if (error) { toast.error('Failed to update user'); return }
    toast.success('User updated!')
    loadUsers()
  }

  const toggleSubscription = async (userId: string, status: string) => {
    const newStatus = status === 'active' ? 'cancelled' : 'active'
    const { error } = await supabase.from('subscriptions').update({ status: newStatus }).eq('user_id', userId)
    if (error) { toast.error('Failed to update subscription'); return }
    toast.success('Subscription updated!')
    loadUsers()
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Users</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>{users.length} total users</p>
      </div>

      <div style={{position: 'relative'}}>
        <Search size={20} color="#6b7280" style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)'}} />
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '12px 16px 12px 48px', color: 'white', fontSize: '14px', outline: 'none'}}
        />
      </div>

      <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', overflow: 'hidden'}}>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #1f2937'}}>
                {['User', 'Subscription', 'Charity', 'Admin', 'Actions'].map(h => (
                  <th key={h} style={{textAlign: 'left', color: '#9ca3af', fontSize: '13px', fontWeight: '500', padding: '16px 24px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} style={{borderBottom: '1px solid #1f2937'}}>
                  <td style={{padding: '16px 24px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '14px', flexShrink: 0}}>
                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p style={{color: 'white', fontWeight: '500', fontSize: '14px'}}>{user.full_name}</p>
                        <p style={{color: '#6b7280', fontSize: '12px'}}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{padding: '16px 24px'}}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: user.subscriptions?.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                      color: user.subscriptions?.status === 'active' ? '#22c55e' : '#ef4444'
                    }}>
                      {user.subscriptions?.status || 'none'}
                    </span>
                  </td>
                  <td style={{padding: '16px 24px'}}>
                    <p style={{color: '#d1d5db', fontSize: '14px'}}>{user.charities?.name || 'None'}</p>
                  </td>
                  <td style={{padding: '16px 24px'}}>
                    {user.is_admin ? <CheckCircle size={20} color="#22c55e" /> : <XCircle size={20} color="#4b5563" />}
                  </td>
                  <td style={{padding: '16px 24px'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button onClick={() => toggleSubscription(user.id, user.subscriptions?.status)}
                        style={{fontSize: '12px', backgroundColor: '#1f2937', color: 'white', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>
                        {user.subscriptions?.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => toggleAdmin(user.id, user.is_admin)}
                        style={{fontSize: '12px', backgroundColor: '#1f2937', color: 'white', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}