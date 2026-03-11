import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import ListingForm from '../components/ListingForm'
import { toast } from '../components/Toast'

export default function EditListingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getListing(id)
      .then(({ listing }) => {
        if (listing.user_id !== user?.id) {
          navigate('/', { replace: true })
          return
        }
        setListing(listing)
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, user, navigate])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      await api.updateListing(id, data)
      toast.success('Listing updated!')
      navigate(`/listings/${id}`)
    } catch (e) {
      toast.error(e.message)
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!listing) return null

  const initialValues = {
    ...listing,
    tags: listing.tags?.join(', ') || '',
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <Link to={`/listings/${id}`} style={{ color: 'var(--terra)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          ← Back to Listing
        </Link>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>
          Edit Experience
        </h1>
        <p style={{ color: 'var(--ink-soft)' }}>Update the details of your listing.</p>
      </div>

      <div className="card" style={{ padding: '36px 40px' }}>
        <ListingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}
