import { Link } from 'react-router-dom'
import { getCategoryEmoji, getCoverGradient, formatPrice, formatDuration } from '../utils/listing'

export default function ListingCard({ listing, style }) {
  const initials = listing.host_name
    ? listing.host_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <Link to={`/listings/${listing.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="card fade-in" style={style}>
        {/* Image / gradient cover */}
        <div style={{
          height: 200,
          background: getCoverGradient(listing.category),
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            fontSize: '4rem',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
            transform: 'scale(1)',
            transition: 'transform 0.3s ease',
          }}>
            {getCategoryEmoji(listing.category)}
          </div>
          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            padding: '4px 12px',
            borderRadius: 100,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--ink)',
          }}>
            {listing.category}
          </div>
          {/* Price badge */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'var(--terra)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: 100,
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            {formatPrice(listing.price_usd)}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--terra)" strokeWidth="2.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              <span style={{ fontSize: '0.78rem', color: 'var(--terra)', fontWeight: 500 }}>
                {listing.location}, {listing.country}
              </span>
            </div>
            <h3 style={{
              fontSize: '1.05rem', fontWeight: 400,
              color: 'var(--ink)', lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {listing.title}
            </h3>
          </div>

          <p style={{
            fontSize: '0.845rem', color: '#6B5B45',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            {listing.description}
          </p>

          {/* Meta row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 14, borderTop: '1px solid var(--sand)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="avatar" style={{ width: 30, height: 30, fontSize: '0.7rem' }}>
                {initials}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', fontWeight: 500 }}>
                {listing.host_name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B5B45', fontSize: '0.82rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatDuration(listing.duration_hours)}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
