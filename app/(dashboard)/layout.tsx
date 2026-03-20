'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Trophy, Heart, Target, Award, Settings, LogOut, Menu, X
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/scores', icon: Trophy, label: 'My Scores' },
  { href: '/charity', icon: Heart, label: 'My Charity' },
  { href: '/draws', icon: Target, label: 'Draws' },
  { href: '/winnings', icon: Award, label: 'Winnings' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', display: 'flex'}}>

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: '240px', backgroundColor: '#111827',
        borderRight: '1px solid #1f2937',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s ease',
        display: 'flex', flexDirection: 'column'
      }}
      className="lg-sidebar"
      >
        {/* Logo */}
        <div style={{padding: '24px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <div>
              <span style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>Golf</span>
              <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '18px'}}>Charity</span>
            </div>
            <p style={{color: '#22c55e', fontSize: '12px'}}>Platform</p>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer'}}>
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div style={{padding: '16px', borderBottom: '1px solid #1f2937'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#22c55e', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'black', fontWeight: 'bold', flexShrink: 0
            }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{overflow: 'hidden'}}>
              <p style={{color: 'white', fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {user?.email || 'Loading...'}
              </p>
              <p style={{color: '#22c55e', fontSize: '11px'}}>Active Member</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{padding: '16px', flex: 1}}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px', marginBottom: '4px',
                  backgroundColor: isActive ? '#22c55e' : 'transparent',
                  color: isActive ? 'black' : '#9ca3af',
                  fontWeight: isActive ? '600' : '400',
                  textDecoration: 'none', transition: 'all 0.15s'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{padding: '16px', borderTop: '1px solid #1f2937'}}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px', width: '100%',
              background: 'none', border: 'none', color: '#9ca3af',
              cursor: 'pointer', fontSize: '14px'
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40}}
        />
      )}

      {/* Main content */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '240px'}}>
        {/* Mobile header */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '16px', borderBottom: '1px solid #1f2937',
          backgroundColor: '#111827'
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer'}}
          >
            <Menu size={24} />
          </button>
          <span style={{color: 'white', fontWeight: 'bold'}}>Golf Charity Platform</span>
        </header>

        <main style={{flex: 1, padding: '24px', overflowY: 'auto'}}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  )
}