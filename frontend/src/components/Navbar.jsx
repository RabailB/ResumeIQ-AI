import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import client from '../api/client'
import './Navbar.css'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout')
    } catch (_) {}
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">🧠</span>
          <span className="navbar-logo-text">
            Resume<span className="gradient-text">IQ</span> AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-center">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'nav-link-active' : ''}`}>
                History
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </div>
              <button className="btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" id="nav-login-btn">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm" id="nav-register-btn">
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu fade-in-scale">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link">🏠 Dashboard</Link>
              <Link to="/history" className="mobile-nav-link">📋 History</Link>
              <div className="mobile-divider" />
              <button className="mobile-nav-link danger" onClick={handleLogout}>⬅️ Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link">Sign In</Link>
              <Link to="/register" className="mobile-nav-link highlight">Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
