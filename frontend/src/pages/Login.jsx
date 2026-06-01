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
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const res = await client.post('/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-centered-page">
      {/* Decorative blobs */}
      <div className="auth-blob ab-1" />
      <div className="auth-blob ab-2" />
      <div className="auth-blob ab-3" />

      <div className="auth-box fade-in-up">
        {/* Header */}
        <div className="auth-box-header">
          <Link to="/" className="auth-back-link">← Back to home</Link>
          <div className="auth-box-logo">🧠</div>
          <h1 className="auth-box-title">Welcome back!</h1>
          <p className="auth-box-sub">Sign in to your ResumeIQ AI account</p>
        </div>

        {error && (
          <div className="alert alert-error" id="login-error-msg" style={{ marginBottom: 20 }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} id="login-form" noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email Address</label>
            <input id="login-email" name="email" type="email" className="input-field"
              placeholder="you@example.com" value={form.email} onChange={handleChange}
              autoComplete="email" required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Password</label>
            <input id="login-password" name="password" type="password" className="input-field"
              placeholder="••••••••" value={form.password} onChange={handleChange}
              autoComplete="current-password" required />
          </div>
          <button type="submit" className="btn btn-primary auth-submit-btn"
            disabled={loading} id="login-submit-btn">
            {loading ? <><div className="spinner" /><span>Signing in…</span></> : <span>Sign In →</span>}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" id="login-to-register-link">Create one free</Link>
        </div>
      </div>
    </div>
  )
}
