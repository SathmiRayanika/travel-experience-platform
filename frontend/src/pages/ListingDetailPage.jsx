import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { getCategoryEmoji, getCoverGradient, formatPrice, formatDuration } from '../utils/listing'
import { toast } from '../components/Toast'

export default function ListingDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.getListing(id)
      .then(({ listing }) => setListing(listing))
      .catch(() => setListing(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this experience? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.deleteListing(id)
      toast.success('Listing deleted')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  if (!listing) return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, marginBottom: 12 }}>Experience not found</h2>
      <Link to="/" className="btn btn-primary">Browse Experiences</Link>
    </div>
  )

  const isOwner = user?.id === listing.user_id
  const hostInitials = listing.host_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--ink-soft)' }}>
        <Link to="/" style={{ color: 'var(--terra)' }}>Experiences</Link>
        <span>/</span>
        <span>{listing.location}, {listing.country}</span>
      </div>

      {/* Hero cover */}
      <div style={{
        height: 320, borderRadius: 20,
        background: getCoverGradient(listing.category),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 36, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: '7rem', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))' }}>
          {getCategoryEmoji(listing.category)}
        </div>
        <div style={{
          position: 'absolute', top: 20, left: 20,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
          padding: '6px 16px', borderRadius: 100, fontSize: '0.82rem', fontWeight: 600,
        }}>
          {listing.category}
        </div>
        {isOwner && (
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
            <Link
              to={`/listings/${listing.id}/edit`}
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', borderRadius: 100 }}
            >
              ✏️ Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', borderRadius: 100, color: '#D63031' }}
            >
              🗑️ {deleting ? '…' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }}>
        {/* Main content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--terra)" strokeWidth="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span style={{ color: 'var(--terra)', fontWeight: 500, fontSize: '0.9rem' }}>
              {listing.location}, {listing.country}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Fraunces, serif', fontWeight: 400,
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            lineHeight: 1.2, marginBottom: 24,
          }}>
            {listing.title}
          </h1>

          <p style={{
            color: 'var(--ink-soft)', lineHeight: 1.8,
            fontSize: '1.025rem', marginBottom: 32,
          }}>
            {listing.description}
          </p>

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {listing.tags.map(tag => (
                <span key={tag} className="badge badge-tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* Host */}
          <div style={{
            background: 'var(--mist)', borderRadius: 14,
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.1rem' }}>
              {hostInitials}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Hosted by {listing.host_name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                Local experience provider
              </div>
            </div>
          </div>
        </div>

        {/* Booking card */}
        <div style={{
          background: 'white', borderRadius: 18,
          border: '1.5px solid var(--sand-dark)',
          padding: '28px',
          boxShadow: 'var(--shadow)',
          position: 'sticky', top: 88,
        }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontSize: '2rem',
            fontWeight: 400, marginBottom: 4, color: 'var(--terra)',
          }}>
            {formatPrice(listing.price_usd)}
            <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', fontFamily: 'DM Sans', fontWeight: 400 }}>
              {' '}/ person
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0 24px' }}>
            {[
              ['Duration', formatDuration(listing.duration_hours)],
              ['Group size', `Up to ${listing.max_guests} guests`],
              ['Location', `${listing.location}, ${listing.country}`],
              ['Category', listing.category],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--sand-dark)', marginBottom: 20 }} />

          {user ? (
            <button className="btn btn-primary btn-lg" style={{ width: '100%', borderRadius: 12 }}>
              Request Booking
            </button>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg" style={{ width: '100%', borderRadius: 12, display: 'flex' }}>
              Sign up to Book
            </Link>
          )}
          <p style={{ fontSize: '0.78rem', color: '#B0A090', textAlign: 'center', marginTop: 12 }}>
            No payment charged yet
          </p>
        </div>
      </div>
    </div>
  )
}
