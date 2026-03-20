'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Search, Star } from 'lucide-react'
import Link from 'next/link'

export default function CharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => { loadCharities() }, [])

  const loadCharities = async () => {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .order('featured', { ascending: false })
    if (data) setCharities(data)
    setLoading(false)
  }

  const filtered = charities.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', color: 'white'}}>
      {/* Navbar */}
      <nav style={{padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937'}}>
        <Link href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>Golf</span>
          <span style={{color: '#22c55e', fontWeight: 'bold', fontSize: '20px'}}>Charity</span>
        </Link>
        <div style={{display: 'flex', gap: '16px'}}>
          <Link href="/login" style={{color: '#9ca3af', fontSize: '14px', textDecoration: 'none'}}>Sign In</Link>
          <Link href="/signup" style={{backgroundColor: '#22c55e', color: 'black', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', textDecoration: 'none'}}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{textAlign: 'center', padding: '60px 24px 40px'}}>
        <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
          <Heart size={32} color="#22c55e" />
        </div>
        <h1 style={{fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '16px'}}>
          Charities We Support
        </h1>
        <p style={{color: '#9ca3af', fontSize: '18px', maxWidth: '500px', margin: '0 auto 32px'}}>
          Every subscription contributes to these amazing causes. Choose the one closest to your heart.
        </p>

        {/* Search */}
        <div style={{position: 'relative', maxWidth: '400px', margin: '0 auto'}}>
          <Search size={18} color="#6b7280" style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)'}} />
          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', backgroundColor: '#111827',
              border: '1px solid #1f2937', borderRadius: '12px',
              padding: '12px 16px 12px 44px', color: 'white',
              fontSize: '14px', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Charities grid */}
      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px'}}>
        {loading ? (
          <div style={{display: 'flex', justifyContent: 'center', padding: '60px'}}>
            <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
            {filtered.map(charity => (
              <Link
                key={charity.id}
                href={`/charities/${charity.id}`}
                style={{textDecoration: 'none'}}
              >
                <div style={{
                  backgroundColor: '#111827', border: '1px solid #1f2937',
                  borderRadius: '20px', overflow: 'hidden',
                  transition: 'border-color 0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#22c55e')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1f2937')}
                >
                  {/* Image */}
                  {charity.image_url && (
                    <div style={{height: '200px', overflow: 'hidden'}}>
                      <img
                        src={charity.image_url}
                        alt={charity.name}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                    </div>
                  )}

                  <div style={{padding: '24px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                      <h3 style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>{charity.name}</h3>
                      {charity.featured && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(234,179,8,0.2)', color: '#eab308', fontSize: '11px', padding: '3px 8px', borderRadius: '999px'}}>
                          <Star size={10} />
                          Featured
                        </div>
                      )}
                    </div>
                    <p style={{color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px'}}>
                      {charity.description}
                    </p>

                    {/* Events */}
                    {charity.events && charity.events.length > 0 && (
                      <div style={{borderTop: '1px solid #1f2937', paddingTop: '16px'}}>
                        <p style={{color: '#6b7280', fontSize: '12px', marginBottom: '8px'}}>Upcoming events</p>
                        {charity.events.slice(0, 2).map((event: any, i: number) => (
                          <div key={i} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
                            <div style={{width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', flexShrink: 0}} />
                            <span style={{color: '#d1d5db', fontSize: '13px'}}>{event.title}</span>
                            <span style={{color: '#6b7280', fontSize: '12px', marginLeft: 'auto'}}>{event.date}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{
                      marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: '#22c55e', fontSize: '14px', fontWeight: '500'
                    }}>
                      <Heart size={14} />
                      View full profile
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}