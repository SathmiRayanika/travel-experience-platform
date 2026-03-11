import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import ListingForm from '../components/ListingForm'
import { toast } from '../components/Toast'

export default function CreateListingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      const { listing } = await api.createListing(data)
      toast.success('Experience published!')
      navigate(`/listings/${listing.id}`)
    } catch (e) {
      toast.error(e.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <Link to="/dashboard" style={{ color: 'var(--terra)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>
          Share a New Experience
        </h1>
        <p style={{ color: 'var(--ink-soft)' }}>
          Fill in the details below to publish your experience for travelers to discover.
        </p>
      </div>

      <div className="card" style={{ padding: '36px 40px' }}>
        <ListingForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Publish Experience"
        />
      </div>
    </div>
  )
}
