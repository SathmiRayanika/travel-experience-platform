import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ListingCard from '../components/ListingCard'
import { CATEGORIES } from '../utils/listing'

const LIMIT = 12

export default function HomePage() {
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchListings = useCallback(async (params = {}, append = false) => {
    try {
      const data = await api.getListings({ category, search, limit: LIMIT, ...params })
      if (append) {
        setListings(prev => [...prev, ...data.listings])
      } else {
        setListings(data.listings)
      }
      setTotal(data.total)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [category, search])

  useEffect(() => {
    setLoading(true)
    fetchListings({ offset: 0 })
  }, [category, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const loadMore = () => {
    setLoadingMore(true)
    fetchListings({ offset: listings.length }, true)
  }

  const hasMore = listings.length < total

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, var(--ink) 0%, #2C1810 60%, #3D1F0A 100%)',
        padding: '80px 24px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,87,26,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: -60, left: '20%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,103,65,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(196,87,26,0.2)',
            border: '1px solid rgba(196,87,26,0.4)',
            padding: '6px 18px', borderRadius: 100,
            marginBottom: 24, fontSize: '0.82rem',
            color: 'var(--terra-light)', letterSpacing: '0.05em', fontWeight: 500,
          }}>
            ✦ DISCOVER LOCAL EXPERIENCES
          </div>

          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontWeight: 300,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Travel experiences<br />
            <em style={{ color: 'var(--terra-light)', fontStyle: 'italic', fontWeight: 300 }}>
              worth remembering
            </em>
          </h1>

          <p style={{
            color: 'rgba(245, 239, 224, 0.7)',
            fontSize: '1.1rem', fontWeight: 300,
            marginBottom: 40, lineHeight: 1.7,
          }}>
            Discover unique local experiences hosted by people who call these places home.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: 10, maxWidth: 540, margin: '0 auto',
          }}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search experiences, places, or activities…"
              style={{
                flex: 1, padding: '14px 20px',
                borderRadius: 100, border: 'none',
                fontSize: '0.95rem', outline: 'none',
                background: 'rgba(255,255,255,0.97)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 100, padding: '14px 24px' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category filters */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--sand-dark)',
        padding: '0 24px',
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', gap: 4, padding: '14px 0',
          whiteSpace: 'nowrap',
        }}>
          <button
            className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 100 }}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 100 }}
              onClick={() => setCategory(category === cat ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 60px' }}>
        {(search || category) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <p style={{ color: 'var(--ink-soft)' }}>
              {total} result{total !== 1 ? 's' : ''}
              {search && <> for "<strong>{search}</strong>"</>}
              {category && <> in <strong>{category}</strong></>}
            </p>
            <button className="btn btn-sm btn-outline"
              onClick={() => { setSearch(''); setSearchInput(''); setCategory('') }}>
              Clear filters
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#D63031' }}>
            <p style={{ fontSize: '1.1rem' }}>⚠️ {error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '2rem', marginBottom: 12 }}>🗺️</p>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, marginBottom: 8 }}>No experiences found</h3>
            <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>Try a different search or category.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setSearchInput(''); setCategory('') }}>
              Browse All
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {listings.map((listing, i) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  style={{ animationDelay: `${(i % 12) * 0.04}s` }}
                />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading…' : `Load More (${total - listings.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
