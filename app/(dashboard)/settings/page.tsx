'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Lock, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [form, setForm] = useState({ full_name: '' })
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [userData, subData] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
    ])
    if (userData.data) { setUser(userData.data); setForm({ full_name: userData.data.full_name }) }
    if (subData.data) setSubscription(subData.data)
    setLoading(false)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('users').update({ full_name: form.full_name }).eq('id', user.id)
    if (error) { toast.error('Failed to update profile') } else { toast.success('Profile updated!') }
    setSavingProfile(false)
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return }
    if (passwordForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword })
    if (error) { toast.error('Failed to update password') } else { toast.success('Password updated!'); setPasswordForm({ newPassword: '', confirmPassword: '' }) }
    setSavingPassword(false)
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', user.id)
    if (error) { toast.error('Failed to cancel subscription') } else { toast.success('Subscription cancelled'); loadData() }
  }

  const inputStyle = {width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none'}
  const cardStyle = {backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', marginBottom: '16px'}

  if (loading) return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
    </div>
  )

  return (
    <div style={{maxWidth: '600px'}}>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>Settings</h1>
        <p style={{color: '#9ca3af', marginTop: '4px'}}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <User size={20} color="#22c55e" /> Profile
        </h2>
        <form onSubmit={handleSaveProfile} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <div>
            <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Full Name</label>
            <input type="text" required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Email</label>
            <input type="email" value={user?.email || ''} disabled style={{...inputStyle, color: '#6b7280', cursor: 'not-allowed'}} />
            <p style={{color: '#4b5563', fontSize: '12px', marginTop: '4px'}}>Email cannot be changed</p>
          </div>
          <button type="submit" disabled={savingProfile}
            style={{backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', width: 'fit-content'}}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Lock size={20} color="#60a5fa" /> Change Password
        </h2>
        <form onSubmit={handleSavePassword} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <div>
            <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>New Password</label>
            <input type="password" required minLength={8} value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} placeholder="Minimum 8 characters" style={inputStyle} />
          </div>
          <div>
            <label style={{display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px'}}>Confirm Password</label>
            <input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} placeholder="Repeat new password" style={inputStyle} />
          </div>
          <button type="submit" disabled={savingPassword}
            style={{backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', width: 'fit-content'}}>
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div style={cardStyle}>
        <h2 style={{color: 'white', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <CreditCard size={20} color="#a78bfa" /> Subscription
        </h2>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1f2937', borderRadius: '12px', padding: '16px', marginBottom: '16px'}}>
          <div>
            <p style={{color: 'white', fontWeight: '500', textTransform: 'capitalize'}}>{subscription?.plan || 'N/A'} Plan</p>
            <p style={{color: '#9ca3af', fontSize: '13px', textTransform: 'capitalize'}}>Status: {subscription?.status || 'N/A'}</p>
            {subscription?.period_end && (
              <p style={{color: '#6b7280', fontSize: '12px', marginTop: '4px'}}>
                Renews: {new Date(subscription.period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          <span style={{
            padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
            backgroundColor: subscription?.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
            color: subscription?.status === 'active' ? '#22c55e' : '#ef4444'
          }}>
            {subscription?.status || 'Inactive'}
          </span>
        </div>
        {subscription?.status === 'active' ? (
          <button onClick={handleCancelSubscription}
            style={{color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'transparent', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px'}}>
            Cancel Subscription
          </button>
        ) : (
          <a href="/pricing" style={{display: 'inline-block', backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '10px 24px', borderRadius: '12px', fontSize: '14px'}}>
            Reactivate Subscription
          </a>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}