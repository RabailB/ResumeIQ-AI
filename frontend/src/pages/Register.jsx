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
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      const res = await client.post('/auth/register', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-centered-page">
      <div className="auth-blob ab-1" />
      <div className="auth-blob ab-2" />
      <div className="auth-blob ab-3" />

      <div className="auth-box fade-in-up">
        <div className="auth-box-header">
          <Link to="/" className="auth-back-link">← Back to home</Link>
          <div className="auth-box-logo">🧠</div>
          <h1 className="auth-box-title">Create your account ✨</h1>
          <p className="auth-box-sub">Start analyzing your resume for free today</p>
        </div>

        {error && (
          <div className="alert alert-error" id="register-error-msg" style={{ marginBottom: 20 }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} id="register-form" noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="register-name">Full Name</label>
            <input id="register-name" name="name" type="text" className="input-field"
              placeholder="Jane Doe" value={form.name} onChange={handleChange}
              autoComplete="name" required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="register-email">Email Address</label>
            <input id="register-email" name="email" type="email" className="input-field"
              placeholder="you@example.com" value={form.email} onChange={handleChange}
              autoComplete="email" required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="register-password">Password</label>
            <input id="register-password" name="password" type="password" className="input-field"
              placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
              autoComplete="new-password" required />
          </div>
          <button type="submit" className="btn btn-primary auth-submit-btn"
            disabled={loading} id="register-submit-btn">
            {loading ? <><div className="spinner" /><span>Creating account…</span></> : <span>Create Free Account 🚀</span>}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12, fontWeight: 600 }}>
          By signing up, you agree to our Terms &amp; Privacy Policy.
        </p>
        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" id="register-to-login-link">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
