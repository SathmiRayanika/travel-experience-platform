import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to Wander.')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 400, marginBottom: 8 }}>
            Start sharing your world
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>Create a free account and publish experiences</p>
        </div>

        <div className="card" style={{ padding: '36px' }}>
          {error && (
            <div style={{
              background: '#FFF0F0', border: '1px solid #FFBDBD',
              borderRadius: 8, padding: '12px 16px',
              color: '#D63031', fontSize: '0.9rem', marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text" className="form-input"
                placeholder="Sofia Reyes"
                value={form.name} onChange={set('name')}
                required autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email} onChange={set('email')}
                required autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input"
                placeholder="At least 6 characters"
                value={form.password} onChange={set('password')}
                required autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password" className="form-input"
                placeholder="••••••••"
                value={form.confirm} onChange={set('confirm')}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ width: '100%', borderRadius: 12, marginTop: 4 }}>
              {loading ? 'Creating account…' : 'Create Free Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--terra)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
