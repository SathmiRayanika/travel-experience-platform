import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
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
            Welcome back
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>Sign in to manage your experiences</p>
        </div>

        {/* Demo credentials */}
        <div style={{
          background: 'var(--terra-pale)', border: '1px solid rgba(196,87,26,0.2)',
          borderRadius: 10, padding: '12px 18px', marginBottom: 24,
          fontSize: '0.85rem', color: 'var(--ink-soft)',
        }}>
          <strong>Try demo account:</strong> sofia@demo.com / demo1234
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
                placeholder="••••••••"
                value={form.password} onChange={set('password')}
                required autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
              style={{ width: '100%', borderRadius: 12, marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--terra)', fontWeight: 500 }}>Join free</Link>
        </p>
      </div>
    </div>
  )
}
