'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Heart, Target, Award, BarChart3, LogOut, Menu, X, Shield } from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/charities', icon: Heart, label: 'Charities' },
  { href: '/admin/draws', icon: Target, label: 'Draws' },
  { href: '/admin/winners', icon: Award, label: 'Winners' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', display: 'flex'}}>
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
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Shield size={20} color="#ef4444" />
            <div>
              <p style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}>Admin Panel</p>
              <p style={{color: '#ef4444', fontSize: '11px'}}>Golf Charity Platform</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer'}}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{padding: '16px', flex: 1}}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px', marginBottom: '4px',
                  backgroundColor: isActive ? 'rgba(239,68,68,0.15)' : 'transparent',
                  color: isActive ? '#ef4444' : '#9ca3af',
                  border: isActive ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
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

        {/* Bottom */}
        <div style={{padding: '16px', borderTop: '1px solid #1f2937'}}>
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px', marginBottom: '4px',
            color: '#9ca3af', textDecoration: 'none'
          }}>
            <LayoutDashboard size={20} />
            User Dashboard
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px', width: '100%',
            background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px'
          }}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40}} />
      )}

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '240px'}}>
        <header style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #1f2937', backgroundColor: '#111827'}}>
          <button onClick={() => setMobileOpen(true)} style={{background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer'}}>
            <Menu size={24} />
          </button>
          <span style={{color: 'white', fontWeight: 'bold'}}>Admin Panel</span>
        </header>
        <main style={{flex: 1, padding: '24px', overflowY: 'auto'}}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) { .lg-sidebar { transform: translateX(0) !important; } }
      `}</style>
    </div>
  )
}