import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import './History.css'

function ScoreBadge({ score }) {
  if (score == null) return <span className="badge" style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>—</span>
  if (score >= 70) return <span className="badge badge-green">{score}</span>
  if (score >= 50) return <span className="badge badge-cyan">{score}</span>
  if (score >= 30) return <span className="badge badge-amber">{score}</span>
  return <span className="badge badge-red">{score}</span>
}

function ResumeHistoryCard({ resume, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!confirm(`Delete "${resume.filename}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await client.delete(`/resume/${resume.id}`)
      onDelete(resume.id)
    } catch (err) {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const uploadDate = resume.upload_date
    ? new Date(resume.upload_date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date'

  const statusConfig = {
    analyzed: { label: '✅ Analyzed', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    pending: { label: '⏳ Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    failed: { label: '❌ Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  }
  const status = statusConfig[resume.status] || statusConfig['analyzed']

  return (
    <div className="history-card glass" id={`history-card-${resume.id}`}>
      <div className="history-card-top">
        <div className="history-file-icon">
          {resume.filename?.endsWith('.pdf') ? '📕' : '📘'}
        </div>
        <div className="history-card-info">
          <h3 className="history-filename" title={resume.filename}>{resume.filename}</h3>
          <span className="history-date">📅 {uploadDate}</span>
        </div>
        <ScoreBadge score={resume.ats_score} />
      </div>

      <div className="history-card-meta">
        {resume.job_role && (
          <span className="badge badge-purple">💼 {resume.job_role}</span>
        )}
        <span
          className="status-chip"
          style={{ color: status.color, background: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <div className="history-card-actions">
        <Link
          to={`/result/${resume.id}`}
          className="btn-primary btn-sm"
          id={`view-result-${resume.id}`}
        >
          View Details
        </Link>
        <button
          className="btn-danger btn-sm"
          onClick={handleDelete}
          disabled={deleting}
          id={`delete-resume-${resume.id}`}
        >
          {deleting ? <div className="spinner" style={{ width: 14, height: 14 }} /> : '🗑'}
          Delete
        </button>
      </div>
    </div>
  )
}

export default function History() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await client.get('/resume/list')
        setResumes(res.data || [])
      } catch (err) {
        setError('Failed to load history. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleDelete = (id) => {
    setResumes((prev) => prev.filter((r) => r.id !== id))
  }

  const filtered = resumes.filter((r) =>
    r.filename?.toLowerCase().includes(search.toLowerCase()) ||
    r.job_role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-wrapper">
      <div className="container history-container">
        {/* Header */}
        <div className="history-header fade-in">
          <div>
            <h1 className="history-title">Resume History</h1>
            <p className="history-subtitle">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} analyzed
            </p>
          </div>
          <Link to="/dashboard" className="btn-primary btn-sm" id="new-analysis-btn">
            + New Analysis
          </Link>
        </div>

        {/* Search */}
        {resumes.length > 0 && (
          <div className="history-search fade-in">
            <input
              type="text"
              className="input-field"
              placeholder="🔍  Search by filename or job role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="history-search-input"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error fade-in" id="history-error-msg">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="history-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && (
          <div className="empty-state fade-in" id="history-empty-state">
            <div className="history-empty-illustration">
              <span style={{ fontSize: 80 }}>📭</span>
              <div className="empty-orb" />
            </div>
            <h3>No resumes analyzed yet</h3>
            <p>Upload your first resume to get started with AI-powered analysis and job recommendations.</p>
            <Link to="/dashboard" className="btn-primary" id="empty-go-to-dashboard-btn">
              <span>Upload Your First Resume</span>
            </Link>
          </div>
        )}

        {/* No search results */}
        {!loading && resumes.length > 0 && filtered.length === 0 && (
          <div className="empty-state fade-in">
            <span className="empty-state-icon">🔎</span>
            <h3>No matches found</h3>
            <p>Try a different search term.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="history-grid fade-in">
            {filtered.map((r) => (
              <ResumeHistoryCard key={r.id} resume={r} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
