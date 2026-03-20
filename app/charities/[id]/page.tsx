'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Calendar, MapPin, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CharityProfilePage() {
  const [charity, setCharity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [supporters, setSupporters] = useState(0)
  const supabase = createClient()
  const params = useParams()

  useEffect(() => { loadCharity() }, [])

  const loadCharity = async () => {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) setCharity(data)

    // Count supporters
    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('charity_id', params.id)

    setSupporters(count || 0)
    setLoading(false)
  }

  if (loading) return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!charity) return (
    <div style={{minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{color: 'white', fontSize: '20px', fontWeight: 'bold'}}>Charity not found</p>
        <Link href="/charities" style={{color: '#22c55e', marginTop: '12px', display: 'inline-block'}}>
          Back to charities
        </Link>
      </div>
    </div>
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

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px'}}>
        {/* Back button */}
        <Link href="/charities" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: '#9ca3af', textDecoration: 'none', marginBottom: '32px',
          fontSize: '14px'
        }}>
          <ArrowLeft size={16} />
          Back to all charities
        </Link>

        {/* Hero image */}
        {charity.image_url && (
          <div style={{height: '300px', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px'}}>
            <img
              src={charity.image_url}
              alt={charity.name}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </div>
        )}

        {/* Header */}
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
              <h1 style={{fontSize: '40px', fontWeight: 'bold', color: 'white'}}>{charity.name}</h1>
              {charity.featured && (
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(234,179,8,0.2)', color: '#eab308', fontSize: '12px', padding: '4px 10px', borderRadius: '999px'}}>
                  <Star size={12} />
                  Featured Charity
                </div>
              )}
            </div>
            <p style={{color: '#9ca3af', fontSize: '16px'}}>{supporters} members currently supporting</p>
          </div>

          <Link href="/signup" style={{
            backgroundColor: '#22c55e', color: 'black', fontWeight: '700',
            padding: '14px 28px', borderRadius: '14px', textDecoration: 'none',
            fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
            flexShrink: 0
          }}>
            <Heart size={18} />
            Support this Charity
          </Link>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
          {/* Left column */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {/* About */}
            <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '28px'}}>
              <h2 style={{color: 'white', fontWeight: '600', fontSize: '20px', marginBottom: '16px'}}>About {charity.name}</h2>
              <p style={{color: '#d1d5db', lineHeight: '1.8', fontSize: '15px'}}>{charity.description}</p>
            </div>

            {/* Events */}
            {charity.events && charity.events.length > 0 && (
              <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '28px'}}>
                <h2 style={{color: 'white', fontWeight: '600', fontSize: '20px', marginBottom: '20px'}}>
                  Upcoming Golf Events
                </h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {charity.events.map((event: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: '#1f2937', borderRadius: '12px',
                      padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px'
                    }}>
                      <div style={{
                        width: '48px', height: '48px', backgroundColor: 'rgba(34,197,94,0.1)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0
                      }}>
                        <Calendar size={22} color="#22c55e" />
                      </div>
                      <div style={{flex: 1}}>
                        <p style={{color: 'white', fontWeight: '600', fontSize: '15px', marginBottom: '6px'}}>{event.title}</p>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                            <Calendar size={13} color="#6b7280" />
                            <span style={{color: '#9ca3af', fontSize: '13px'}}>{event.date}</span>
                          </div>
                          {event.location && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                              <MapPin size={13} color="#6b7280" />
                              <span style={{color: '#9ca3af', fontSize: '13px'}}>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {/* Support card */}
            <div style={{backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center'}}>
              <div style={{width: '56px', height: '56px', backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
                <Heart size={28} color="#22c55e" />
              </div>
              <p style={{color: 'white', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px'}}>{supporters}</p>
              <p style={{color: '#9ca3af', fontSize: '14px', marginBottom: '20px'}}>Active supporters</p>
              <Link href="/signup" style={{
                display: 'block', backgroundColor: '#22c55e', color: 'black',
                fontWeight: '700', padding: '12px', borderRadius: '12px',
                textDecoration: 'none', fontSize: '14px'
              }}>
                Become a supporter
              </Link>
            </div>

            {/* How it works card */}
            <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
              <h3 style={{color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '15px'}}>How your support works</h3>
              {[
                { step: '1', text: 'Subscribe to Golf Charity Platform' },
                { step: '2', text: 'Select this charity as your cause' },
                { step: '3', text: 'Min 10% of your subscription donated' },
                { step: '4', text: 'Play draws and win prizes too!' },
              ].map((item, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px'}}>
                  <div style={{
                    width: '22px', height: '22px', backgroundColor: 'rgba(34,197,94,0.2)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, fontSize: '11px',
                    color: '#22c55e', fontWeight: 'bold'
                  }}>
                    {item.step}
                  </div>
                  <p style={{color: '#d1d5db', fontSize: '13px', lineHeight: '1.5'}}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Contribution info */}
            <div style={{backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px'}}>
              <h3 style={{color: 'white', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>Your contribution</h3>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span style={{color: '#9ca3af', fontSize: '13px'}}>Monthly plan</span>
                <span style={{color: '#22c55e', fontWeight: '600', fontSize: '13px'}}>Min £1.00/mo</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                <span style={{color: '#9ca3af', fontSize: '13px'}}>Yearly plan</span>
                <span style={{color: '#22c55e', fontWeight: '600', fontSize: '13px'}}>Min £10.00/yr</span>
              </div>
              <p style={{color: '#6b7280', fontSize: '12px', lineHeight: '1.5'}}>
                You can increase your contribution percentage at any time from your dashboard settings.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}