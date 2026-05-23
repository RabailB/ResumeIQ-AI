import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import client from '../api/client'
import ScoreRing from '../components/ScoreRing'
import SkillTags from '../components/SkillTags'
import JobCards from '../components/JobCards'
import SuggestionList from '../components/SuggestionList'
import './ResultPage.css'

function AtsBreakdownBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}44` }}
        />
      </div>
    </div>
  )
}

export default function ResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await client.get(`/resume/${id}`)
        setResult(res.data)
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Resume not found. It may have been deleted.')
        } else {
          setError(err.response?.data?.error || 'Failed to load result. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [id])

  const tabs = [
    { label: '📊 Overview', id: `result-tab-overview-${id}` },
    { label: '⚡ Skills', id: `result-tab-skills-${id}` },
    { label: '💼 Job Matches', id: `result-tab-jobs-${id}` },
    { label: '📝 Suggestions', id: `result-tab-suggestions-${id}` },
  ]

  const score = result?.ats_score ?? 0
  const breakdown = [
    { label: 'Keyword Density', value: Math.min(100, Math.round(score * 1.05)), color: '#00d4ff' },
    { label: 'Formatting', value: Math.min(100, Math.round(score * 0.95)), color: '#7c3aed' },
    { label: 'Skills Match', value: Math.min(100, Math.round(score * 1.1)), color: '#10b981' },
    { label: 'Experience Match', value: Math.min(100, Math.round(score * 0.9)), color: '#f59e0b' },
  ]

  // Loading skeleton
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container result-container">
          <div className="result-loading">
            <div className="spinner spinner-lg spinner-purple" />
            <p className="loading-text">Loading analysis results…</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container result-container">
          <div className="result-error fade-in">
            <div className="result-error-icon">😔</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <div className="result-error-actions">
              <button className="btn-outline" onClick={() => navigate(-1)} id="result-back-btn">
                ← Go Back
              </button>
              <Link to="/history" className="btn-primary" id="result-history-btn">
                <span>View History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container result-container">
        {/* Back + Header */}
        <div className="result-header fade-in">
          <button
            className="btn-ghost"
            onClick={() => navigate(-1)}
            id="result-back-arrow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="result-title-section">
            <div>
              <h1 className="result-page-title">
                📄 {result.filename}
              </h1>
              <div className="result-meta">
                {result.upload_date && (
                  <span>
                    📅{' '}
                    {new Date(result.upload_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {result.job_role && (
                  <span className="badge badge-purple">💼 {result.job_role}</span>
                )}
                {result.status && (
                  <span className="badge badge-green">✅ {result.status}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Score Hero */}
        <div className="result-score-hero glass fade-in">
          <div className="score-hero-left">
            <ScoreRing score={score} size={220} />
          </div>
          <div className="score-hero-right">
            <h2 className="score-hero-title">ATS Compatibility Score</h2>
            <p className="score-hero-desc">
              Your resume scored <strong style={{ color: score >= 70 ? '#10b981' : score >= 50 ? '#00d4ff' : '#f59e0b' }}>{score}/100</strong> on our
              ATS compatibility analysis. {score >= 70
                ? 'Excellent! Your resume is well-optimized for applicant tracking systems.'
                : score >= 50
                ? 'Good start! A few improvements could significantly boost your score.'
                : 'There\'s room to improve. Review the suggestions tab for actionable tips.'}
            </p>
            <div className="score-breakdown-mini">
              {breakdown.map((b) => (
                <AtsBreakdownBar key={b.label} {...b} />
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="result-tabs fade-in">
          <div className="tabs-wrapper">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                id={t.id}
                className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="tab-content glass fade-in-scale" key={activeTab}>
            {/* Overview */}
            {activeTab === 0 && (
              <div>
                {result.raw_text_preview && (
                  <div>
                    <div className="tab-section-title">Resume Text Preview</div>
                    <div className="text-preview-box" style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '20px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.8',
                      maxHeight: '280px',
                      overflowY: 'auto',
                    }}>
                      {result.raw_text_preview}
                    </div>
                  </div>
                )}
                {!result.raw_text_preview && (
                  <div className="empty-state">
                    <span className="empty-state-icon">📄</span>
                    <h3>No Text Preview</h3>
                    <p>The raw text preview is not available for this resume.</p>
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {activeTab === 1 && (
              <SkillTags skills={result.skills || []} />
            )}

            {/* Job Matches */}
            {activeTab === 2 && (
              <JobCards recommendations={result.job_recommendations || []} />
            )}

            {/* Suggestions */}
            {activeTab === 3 && (
              <SuggestionList suggestions={result.suggestions || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
