import { useState } from 'react'

const CATEGORIES = ['Adventure', 'Cultural', 'Food & Drink', 'Water Activities', 'Wildlife', 'Wellness', 'Art & History', 'Nightlife']

const defaultForm = {
  title: '', description: '', location: '', country: '',
  category: '', duration_hours: '', price_usd: '', max_guests: '10', tags: '',
}

export default function ListingForm({ initialValues = {}, onSubmit, submitLabel = 'Publish Listing', loading }) {
  const [form, setForm] = useState({ ...defaultForm, ...initialValues })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!form.title.trim() || form.title.trim().length < 5) err.title = 'Title must be at least 5 characters'
    if (!form.description.trim() || form.description.trim().length < 20) err.description = 'Description must be at least 20 characters'
    if (!form.location.trim()) err.location = 'Location is required'
    if (!form.country.trim()) err.country = 'Country is required'
    if (!form.category) err.category = 'Please select a category'
    if (!form.duration_hours || isNaN(form.duration_hours) || +form.duration_hours <= 0) err.duration_hours = 'Enter a valid duration'
    if (!form.price_usd || isNaN(form.price_usd) || +form.price_usd < 0) err.price_usd = 'Enter a valid price'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) { setErrors(err); return }
    setErrors({})

    const tags = form.tags
      ? form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 8)
      : []

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      country: form.country.trim(),
      duration_hours: parseFloat(form.duration_hours),
      price_usd: parseFloat(form.price_usd),
      max_guests: parseInt(form.max_guests) || 10,
      tags,
    })
  }

  const inputStyle = (field) => ({
    ...{}, // base handled by CSS class
    borderColor: errors[field] ? '#D63031' : undefined,
  })

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      <div className="form-group">
        <label className="form-label">Experience Title *</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Sunrise Hike to Mount Batur Volcano"
          value={form.title}
          onChange={set('title')}
          maxLength={100}
          style={inputStyle('title')}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
        <span style={{ fontSize: '0.78rem', color: '#B0A090' }}>{form.title.length}/100</span>
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea
          className="form-input"
          placeholder="Describe the experience — what will guests do, see, and feel? What makes it special?"
          value={form.description}
          onChange={set('description')}
          rows={5}
          maxLength={2000}
          style={{ resize: 'vertical', ...inputStyle('description') }}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
        <span style={{ fontSize: '0.78rem', color: '#B0A090' }}>{form.description.length}/2000</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">City / Location *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ubud"
            value={form.location}
            onChange={set('location')}
            style={inputStyle('location')}
          />
          {errors.location && <span className="form-error">{errors.location}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Country *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Indonesia"
            value={form.country}
            onChange={set('country')}
            style={inputStyle('country')}
          />
          {errors.country && <span className="form-error">{errors.country}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category *</label>
        <select
          className="form-input"
          value={form.category}
          onChange={set('category')}
          style={inputStyle('category')}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Duration (hours) *</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 3"
            value={form.duration_hours}
            onChange={set('duration_hours')}
            min="0.5" max="72" step="0.5"
            style={inputStyle('duration_hours')}
          />
          {errors.duration_hours && <span className="form-error">{errors.duration_hours}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Price (USD) *</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 45"
            value={form.price_usd}
            onChange={set('price_usd')}
            min="0" step="1"
            style={inputStyle('price_usd')}
          />
          {errors.price_usd && <span className="form-error">{errors.price_usd}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Max Guests</label>
          <input
            type="number"
            className="form-input"
            placeholder="10"
            value={form.max_guests}
            onChange={set('max_guests')}
            min="1" max="100"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tags <span style={{ fontWeight: 400, color: '#B0A090' }}>(optional, comma-separated)</span></label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. hiking, volcano, sunrise, bali"
          value={form.tags}
          onChange={set('tags')}
        />
        <span style={{ fontSize: '0.78rem', color: '#B0A090' }}>Up to 8 tags help travelers discover your experience</span>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
        style={{ alignSelf: 'flex-start', marginTop: 8 }}
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
