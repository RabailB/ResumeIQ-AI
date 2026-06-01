import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import './AuthPages.css'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await client.post('/auth/register', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-blob auth-blob-1" />
        <div className="auth-left-blob auth-blob-2" />
        <div className="auth-brand">
          <span className="auth-brand-icon">🧠</span>
          <h2 className="auth-brand-title">ResumeIQ AI</h2>
          <p className="auth-brand-sub">Join thousands of job seekers using AI to land their dream job faster.</p>
        </div>
        <div className="auth-features-list">
          {[
            'Free to use — no credit card needed',
            'Instant ATS score in under 5 seconds',
            'AI-powered job recommendations',
            'Detailed improvement suggestions',
          ].map((f) => (
            <div key={f} className="auth-feature-item">
              <div className="auth-feature-check">✓</div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-box fade-in-up">
          <div className="auth-form-header">
            <Link to="/" style={{ display: 'inline-block', marginBottom: 20, fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
              ← Back to home
            </Link>
            <h1 className="auth-form-title">Create your account ✨</h1>
            <p className="auth-form-sub">Start analyzing your resume for free today</p>
          </div>

          {error && (
            <div className="alert alert-error fade-in" id="register-error-msg" style={{ marginBottom: 20 }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} id="register-form" noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                className="input-field"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                className="input-field"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              id="register-submit-btn"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)', padding: '14px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Creating account…</span>
                </>
              ) : (
                <span>Create Free Account 🚀</span>
              )}
            </button>
          </form>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" id="register-to-login-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
