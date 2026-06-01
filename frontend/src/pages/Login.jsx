import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import './AuthPages.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await client.post('/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.')
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
          <p className="auth-brand-sub">Your AI-powered career companion for landing your dream job.</p>
        </div>
        <div className="auth-features-list">
          {[
            'Instant ATS compatibility score',
            'AI skill extraction & gap analysis',
            'Personalized job recommendations',
            'Actionable improvement tips',
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
            <h1 className="auth-form-title">Welcome back! 👋</h1>
            <p className="auth-form-sub">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert alert-error fade-in" id="login-error-msg" style={{ marginBottom: 20 }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} id="login-form" noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
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
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              id="login-submit-btn"
              style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)', padding: '14px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          <div className="auth-switch" style={{ marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" id="login-to-register-link">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
