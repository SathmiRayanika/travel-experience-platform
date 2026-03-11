import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { getCategoryEmoji, formatPrice, formatDuration } from '../utils/listing'
import { toast } from '../components/Toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMyListings()
      .then(({ listings }) => setListings(listings))
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience? This cannot be undone.')) return
    try {
      await api.deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
      toast.success('Listing deleted')
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, marginBottom: 6 }}>
            My Experiences
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>
            Welcome back, {user?.name?.split(' ')[0]}! Manage your listings here.
          </p>
        </div>
        <Link to="/listings/new" className="btn btn-primary">
          + New Experience
        </Link>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16, marginBottom: 40,
      }}>
        {[
          { label: 'Total Listings', value: listings.length },
          { label: 'Countries', value: new Set(listings.map(l => l.country)).size },
          { label: 'Categories', value: new Set(listings.map(l => l.category)).size },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 14,
            padding: '20px 24px',
            border: '1.5px solid var(--sand-dark)',
          }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--terra)' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Listings */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : listings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          background: 'white', borderRadius: 20,
          border: '2px dashed var(--sand-dark)',
        }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 14 }}>🗺️</p>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, marginBottom: 8, fontSize: '1.4rem' }}>
            No experiences yet
          </h3>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
            Share your first local experience with travelers around the world.
          </p>
          <Link to="/listings/new" className="btn btn-primary btn-lg">
            Create First Listing
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {listings.map(listing => (
            <div key={listing.id} style={{
              background: 'white', borderRadius: 16,
              border: '1.5px solid var(--sand-dark)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              transition: 'var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Emoji thumbnail */}
              <div style={{
                width: 64, height: 64, borderRadius: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                background: 'var(--mist)',
              }}>
                {getCategoryEmoji(listing.category)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 400,
                  fontSize: '1.05rem', marginBottom: 4,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {listing.title}
                </h3>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                  <span>📍 {listing.location}, {listing.country}</span>
                  <span>🕐 {formatDuration(listing.duration_hours)}</span>
                  <span>💰 {formatPrice(listing.price_usd)}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link
                  to={`/listings/${listing.id}`}
                  className="btn btn-sm btn-outline"
                >
                  View
                </Link>
                <Link
                  to={`/listings/${listing.id}/edit`}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="btn btn-sm"
                  style={{ color: '#D63031', background: '#FFF0F0', border: '1.5px solid #FFBDBD' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
