import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import client from '../api/client'
import UploadZone from '../components/UploadZone'
import ScoreRing from '../components/ScoreRing'
import SkillTags from '../components/SkillTags'
import JobCards from '../components/JobCards'
import SuggestionList from '../components/SuggestionList'
import './Dashboard.css'

const ANALYZING_MESSAGES = [
  'Parsing resume content…',
  'Extracting skills and keywords…',
  'Calculating ATS compatibility score…',
  'Matching job roles…',
  'Generating improvement suggestions…',
  'Finalizing your results…',
]

function AnalyzingLoader({ message }) {
  return (
    <div className="analyzing-loader glass fade-in">
      <div className="analyzing-anim">
        <div className="brain-pulse">🧠</div>
        <div className="pulse-ring ring-1" />
        <div className="pulse-ring ring-2" />
        <div className="pulse-ring ring-3" />
      </div>
      <div className="analyzing-text">
        <h3>Analyzing Your Resume</h3>
        <p className="loading-text">{message}</p>
      </div>
      <div className="analyzing-steps">
        {ANALYZING_MESSAGES.map((m, i) => (
          <div key={i} className={`step-pill ${m === message ? 'active' : ''}`}>
            {m === message ? <div className="spinner" /> : <span className="step-dot" />}
            <span>{m}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AtsBreakdownBar({ label, value, max = 100, color }) {
  return (
    <div className="ats-bar-row">
      <div className="ats-bar-label">
        <span>{label}</span>
        <span style={{ color }} className="ats-bar-val">{value}%</span>
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

function ResultTabs({ result }) {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: '📊 Overview', id: 'tab-overview' },
    { label: '⚡ Skills', id: 'tab-skills' },
    { label: '💼 Job Matches', id: 'tab-jobs' },
    { label: '📝 Suggestions', id: 'tab-suggestions' },
  ]

  // Simulated breakdown bars from ATS score
  const score = result.ats_score ?? 0
  const breakdown = [
    { label: 'Keyword Density', value: Math.min(100, Math.round(score * 1.05)), color: '#00d4ff' },
    { label: 'Formatting', value: Math.min(100, Math.round(score * 0.95)), color: '#7c3aed' },
    { label: 'Skills Match', value: Math.min(100, Math.round(score * 1.1)), color: '#10b981' },
    { label: 'Experience Match', value: Math.min(100, Math.round(score * 0.9)), color: '#f59e0b' },
  ]

  return (
    <div className="result-tabs-wrapper fade-in">
      {/* Tabs */}
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

      {/* Tab content */}
      <div className="tab-content glass fade-in-scale" key={activeTab}>
        {/* Overview */}
        {activeTab === 0 && (
          <div className="overview-layout">
            <div className="overview-score-col">
              <div className="overview-score-title">ATS Score</div>
              <ScoreRing score={score} size={200} />
              {result.job_role && (
                <div className="detected-role">
                  <span className="detected-role-label">Detected Role</span>
                  <span className="badge badge-purple">{result.job_role}</span>
                </div>
              )}
            </div>
            <div className="overview-bars-col">
              <div className="overview-bars-title">Score Breakdown</div>
              <div className="ats-bars">
                {breakdown.map((b) => (
                  <AtsBreakdownBar key={b.label} {...b} />
                ))}
              </div>
              {result.raw_text_preview && (
                <div className="text-preview">
                  <div className="text-preview-label">Resume Preview</div>
                  <div className="text-preview-box">
                    {result.raw_text_preview.substring(0, 300)}
                    {result.raw_text_preview.length > 300 && <span className="preview-fade">…</span>}
                  </div>
                </div>
              )}
            </div>
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
  )
}

function RecentCard({ resume }) {
  const score = resume.ats_score ?? 0
  const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#00d4ff' : '#f59e0b'

  return (
    <Link to={`/result/${resume.id}`} className="recent-card glass" id={`recent-card-${resume.id}`}>
      <div className="recent-card-header">
        <span className="recent-card-icon">📄</span>
        <div className="recent-card-info">
          <span className="recent-card-name">{resume.filename}</span>
          <span className="recent-card-date">
            {new Date(resume.upload_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div
          className="recent-score-badge"
          style={{ color: scoreColor, borderColor: `${scoreColor}40`, background: `${scoreColor}15` }}
        >
          {score}
        </div>
      </div>
      {resume.job_role && (
        <div className="recent-card-role">
          <span className="badge badge-purple">{resume.job_role}</span>
        </div>
      )}
      <div className="recent-card-cta">View Details →</div>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeMsg, setAnalyzeMsg] = useState(ANALYZING_MESSAGES[0])
  const [analyzeError, setAnalyzeError] = useState('')
  const [recentResumes, setRecentResumes] = useState([])
  const [recentLoading, setRecentLoading] = useState(true)

  // Cycle through analysis messages
  useEffect(() => {
    if (!analyzing) return
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % ANALYZING_MESSAGES.length
      setAnalyzeMsg(ANALYZING_MESSAGES[i])
    }, 1800)
    return () => clearInterval(interval)
  }, [analyzing])

  // Load recent resumes on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await client.get('/resume/list')
        setRecentResumes(res.data || [])
      } catch (_) {}
      finally {
        setRecentLoading(false)
      }
    }
    fetchRecent()
  }, [result]) // re-fetch when a new analysis completes

  const handleUploadSuccess = useCallback(async (resumeId) => {
    setAnalyzing(true)
    setAnalyzeError('')
    setResult(null)
    setAnalyzeMsg(ANALYZING_MESSAGES[0])

    try {
      const res = await client.post(`/analyze/${resumeId}`)
      setResult(res.data)
    } catch (err) {
      setAnalyzeError(
        err.response?.data?.error || err.response?.data?.message || 'Analysis failed. Please try again.'
      )
    } finally {
      setAnalyzing(false)
    }
  }, [])

  return (
    <div className="page-wrapper">
      <div className="container dashboard-container">
        {/* Header */}
        <div className="dashboard-header fade-in">
          <div>
            <h1 className="dashboard-greeting">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}</span>! 👋
            </h1>
            <p className="dashboard-subtitle">
              Upload your resume to get an instant AI-powered analysis with ATS score and job recommendations.
            </p>
          </div>
          <Link to="/history" className="btn-outline btn-sm" id="dashboard-history-link">
            📋 View History
          </Link>
        </div>

        {/* Upload Section */}
        {!analyzing && !result && (
          <div className="upload-section glass fade-in">
            <div className="upload-section-header">
              <h2 className="upload-section-title">
                <span>📤</span> Upload Your Resume
              </h2>
              <p className="upload-section-sub">PDF or DOCX · Max 10MB · Results in under 5 seconds</p>
            </div>
            <UploadZone onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Analyzing state */}
        {analyzing && <AnalyzingLoader message={analyzeMsg} />}

        {/* Analyze error */}
        {analyzeError && !analyzing && (
          <div className="alert alert-error fade-in" id="analyze-error-msg">
            <span>⚠️</span>
            <span>{analyzeError}</span>
            <button
              className="btn-ghost btn-sm"
              style={{ marginLeft: 'auto' }}
              onClick={() => { setAnalyzeError(''); setResult(null) }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {result && !analyzing && (
          <div className="results-section fade-in">
            <div className="results-header">
              <div>
                <h2 className="results-title">✅ Analysis Complete</h2>
                <p className="results-sub">
                  {result.filename} — Analyzed just now
                </p>
              </div>
              <button
                className="btn-outline btn-sm"
                onClick={() => setResult(null)}
                id="analyze-again-btn"
              >
                Analyze Another
              </button>
            </div>
            <ResultTabs result={result} />
          </div>
        )}

        {/* Recent Analyses */}
        {!result && (
          <div className="recent-section">
            <div className="recent-header">
              <h2 className="recent-title">📋 Recent Analyses</h2>
              {recentResumes.length > 0 && (
                <Link to="/history" className="btn-ghost btn-sm" id="view-all-history-link">
                  View All →
                </Link>
              )}
            </div>

            {recentLoading ? (
              <div className="recent-loading">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />
                ))}
              </div>
            ) : recentResumes.length === 0 ? (
              <div className="empty-state" id="empty-history-msg">
                <span className="empty-state-icon">📭</span>
                <h3>No Analyses Yet</h3>
                <p>Upload your first resume above to get started!</p>
              </div>
            ) : (
              <div className="recent-grid">
                {recentResumes.slice(0, 6).map((r) => (
                  <RecentCard key={r.id} resume={r} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
