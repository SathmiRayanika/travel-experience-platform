import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(249, 246, 240, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--sand-dark)',
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--terra)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.35rem', fontWeight: 400, color: 'var(--ink)' }}>
            Wander
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <Link to="/listings/new" className="btn btn-primary btn-sm">
                + New Experience
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 14px 6px 6px',
                    borderRadius: 100,
                    background: menuOpen ? 'var(--sand)' : 'transparent',
                    border: '1.5px solid var(--sand-dark)',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                  }}
                >
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                    {initials}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'white', borderRadius: 12,
                    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--sand-dark)',
                    minWidth: 180, overflow: 'hidden', zIndex: 200,
                  }}>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '12px 18px', fontSize: '0.9rem',
                               color: 'var(--ink)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.target.style.background = 'var(--mist)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      📋 My Listings
                    </Link>
                    <div style={{ height: 1, background: 'var(--sand-dark)' }} />
                    <button onClick={handleLogout}
                      style={{ width: '100%', display: 'block', padding: '12px 18px',
                               fontSize: '0.9rem', color: '#C0392B', textAlign: 'left',
                               background: 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.target.style.background = '#FEF0EE'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      ↪ Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
            </>
          )}
        </div>
      </nav>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  )
}
