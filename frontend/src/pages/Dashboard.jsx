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
    <div className="analyzing-loader fade-in-up">
      <div className="analyzing-anim">
        <div className="brain-pulse">🧠</div>
        <div className="pulse-ring ring-1" />
        <div className="pulse-ring ring-2" />
        <div className="pulse-ring ring-3" />
      </div>
      <div className="analyzing-text">
        <h3>Analyzing Your Resume ✨</h3>
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

function AtsBreakdownBar({ label, value, color }) {
  const barColors = {
    '#EDB830': 'var(--yellow)',
    '#C97070': 'var(--rose)',
    '#7AAFC2': 'var(--blue)',
    '#6A9E7A': 'var(--green)',
  }
  const bg = barColors[color] || color
  return (
    <div className="ats-bar-row">
      <div className="ats-bar-label">
        <span>{label}</span>
        <span style={{ color: bg }} className="ats-bar-val">{value}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${value}%`, background: bg }} />
      </div>
    </div>
  )
}

function ResultTabs({ result }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = [
    { label: '📊 Overview', id: 'tab-overview' },
    { label: '⚡ Skills',   id: 'tab-skills' },
    { label: '💼 Jobs',     id: 'tab-jobs' },
    { label: '📝 Tips',     id: 'tab-suggestions' },
  ]
  const score = result.ats_score ?? 0
  const breakdown = [
    { label: 'Keyword Density',  value: Math.min(100, Math.round(score * 1.05)), color: '#EDB830' },
    { label: 'Formatting',       value: Math.min(100, Math.round(score * 0.95)), color: '#7AAFC2' },
    { label: 'Skills Match',     value: Math.min(100, Math.round(score * 1.1)),  color: '#6A9E7A' },
    { label: 'Experience Match', value: Math.min(100, Math.round(score * 0.9)),  color: '#C97070' },
  ]

  return (
    <div className="result-tabs-wrapper fade-in-up">
      <div className="tabs-wrapper">
        {tabs.map((t, i) => (
          <button key={t.id} id={t.id}
            className={`tab-btn ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content" key={activeTab}>
        {activeTab === 0 && (
          <div className="overview-layout">
            <div className="overview-score-col">
              <div className="overview-score-title">ATS Score</div>
              <ScoreRing score={score} size={190} />
              {result.job_role && (
                <div className="detected-role">
                  <span className="detected-role-label">Detected Role</span>
                  <span className="badge badge-yellow">{result.job_role}</span>
                </div>
              )}
            </div>
            <div className="overview-bars-col">
              <div className="overview-bars-title">Score Breakdown ✨</div>
              <div className="ats-bars">
                {breakdown.map(b => <AtsBreakdownBar key={b.label} {...b} />)}
              </div>
              {result.raw_text_preview && (
                <div className="text-preview">
                  <div className="text-preview-label">Resume Preview</div>
                  <div className="text-preview-box">
                    {result.raw_text_preview.substring(0, 300)}
                    {result.raw_text_preview.length > 300 && <span style={{ color: 'var(--text-muted)' }}>…</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 1 && <SkillTags skills={result.skills || []} />}
        {activeTab === 2 && <JobCards recommendations={result.job_recommendations || []} />}
        {activeTab === 3 && <SuggestionList suggestions={result.suggestions || []} />}
      </div>
    </div>
  )
}

function RecentCard({ resume }) {
  const score = resume.ats_score ?? 0
  const scoreColor = score >= 70 ? '#6A9E7A' : score >= 50 ? '#EDB830' : '#C97070'
  return (
    <Link to={`/result/${resume.id}`} className="recent-card" id={`recent-card-${resume.id}`}>
      <div className="recent-card-header">
        <span className="recent-card-icon">📄</span>
        <div className="recent-card-info">
          <span className="recent-card-name">{resume.filename}</span>
          <span className="recent-card-date">
            {new Date(resume.upload_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="recent-score-badge" style={{ color: scoreColor, borderColor: `${scoreColor}50`, background: `${scoreColor}15` }}>
          {score}
        </div>
      </div>
      {resume.job_role && (
        <div><span className="badge badge-yellow">{resume.job_role}</span></div>
      )}
      <div className="recent-card-cta">View Details →</div>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [result, setResult]           = useState(null)
  const [analyzing, setAnalyzing]     = useState(false)
  const [analyzeMsg, setAnalyzeMsg]   = useState(ANALYZING_MESSAGES[0])
  const [analyzeError, setAnalyzeError] = useState('')
  const [recentResumes, setRecentResumes] = useState([])
  const [recentLoading, setRecentLoading] = useState(true)

  useEffect(() => {
    if (!analyzing) return
    let i = 0
    const iv = setInterval(() => { i = (i + 1) % ANALYZING_MESSAGES.length; setAnalyzeMsg(ANALYZING_MESSAGES[i]) }, 1800)
    return () => clearInterval(iv)
  }, [analyzing])

  useEffect(() => {
    const fetch = async () => {
      try { const res = await client.get('/resume/list'); setRecentResumes(res.data || []) } catch (_) {}
      finally { setRecentLoading(false) }
    }
    fetch()
  }, [result])

  const handleUploadSuccess = useCallback(async (resumeId) => {
    setAnalyzing(true); setAnalyzeError(''); setResult(null); setAnalyzeMsg(ANALYZING_MESSAGES[0])
    try { const res = await client.post(`/analyze/${resumeId}`); setResult(res.data) }
    catch (err) { setAnalyzeError(err.response?.data?.error || err.response?.data?.message || 'Analysis failed. Please try again.') }
    finally { setAnalyzing(false) }
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="page-wrapper">
      <div className="container dashboard-container">

        {/* ===== WELCOME BANNER ===== */}
        <div className="dashboard-header fade-in-up">
          <span className="dh-deco dh-s1">★</span>
          <span className="dh-deco dh-s2">✦</span>
          <span className="dh-deco dh-s3">✶</span>
          <div className="dashboard-header-inner">
            <div>
              <h1 className="dashboard-greeting">
                Hey, <em>{firstName}</em>! 👋
              </h1>
              <p className="dashboard-subtitle">
                Upload your resume below and get your ATS score, skills, job matches &amp; tips — in seconds!
              </p>
            </div>
            <Link to="/history" className="btn-history" id="dashboard-history-link">
              📋 View History
            </Link>
          </div>
        </div>

        {/* ===== QUICK STATS ===== */}
        {!result && !analyzing && (
          <div className="quick-stats fade-in-up">
            <div className="qs-card">
              <div className="qs-icon qs-icon-yellow">🎯</div>
              <div>
                <div className="qs-value">{recentResumes.length}</div>
                <div className="qs-label">Resumes Analyzed</div>
              </div>
            </div>
            <div className="qs-card">
              <div className="qs-icon qs-icon-rose">⚡</div>
              <div>
                <div className="qs-value">&lt;5s</div>
                <div className="qs-label">Avg. Analysis Time</div>
              </div>
            </div>
            <div className="qs-card">
              <div className="qs-icon qs-icon-blue">🌟</div>
              <div>
                <div className="qs-value">Free</div>
                <div className="qs-label">Always Free to Use</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== UPLOAD ===== */}
        {!analyzing && !result && (
          <div className="upload-section fade-in-up">
            <div className="upload-section-header">
              <h2 className="upload-section-title">
                <span>📤</span> Upload Your Resume
              </h2>
              <p className="upload-section-sub">PDF or DOCX · Max 10MB · Results in under 5 seconds ✨</p>
            </div>
            <UploadZone onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* ===== ANALYZING ===== */}
        {analyzing && <AnalyzingLoader message={analyzeMsg} />}

        {/* ===== ERROR ===== */}
        {analyzeError && !analyzing && (
          <div className="alert alert-error fade-in-up" id="analyze-error-msg" style={{ marginBottom: 24 }}>
            <span>⚠️</span>
            <span>{analyzeError}</span>
            <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', fontWeight: 800, cursor: 'pointer', fontSize: 13 }}
              onClick={() => { setAnalyzeError(''); setResult(null) }}>
              Try Again
            </button>
          </div>
        )}

        {/* ===== RESULTS ===== */}
        {result && !analyzing && (
          <div className="results-section fade-in-up">
            <div className="results-header">
              <div>
                <h2 className="results-title">🎉 Analysis Complete!</h2>
                <p className="results-sub">{result.filename} — Just analyzed</p>
              </div>
              <button className="btn-analyze-again" onClick={() => setResult(null)} id="analyze-again-btn">
                Analyze Another →
              </button>
            </div>
            <ResultTabs result={result} />
          </div>
        )}

        {/* ===== RECENT ===== */}
        {!result && (
          <div className="recent-section">
            <div className="recent-header">
              <h2 className="recent-title">📋 Recent Analyses</h2>
              {recentResumes.length > 0 && (
                <Link to="/history" className="btn-view-all" id="view-all-history-link">
                  View All →
                </Link>
              )}
            </div>

            {recentLoading ? (
              <div className="recent-loading">
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)}
              </div>
            ) : recentResumes.length === 0 ? (
              <div className="empty-state" id="empty-history-msg">
                <span className="empty-state-icon">📭</span>
                <h3>No Analyses Yet</h3>
                <p>Upload your first resume above to get started!</p>
              </div>
            ) : (
              <div className="recent-grid">
                {recentResumes.slice(0, 6).map(r => <RecentCard key={r.id} resume={r} />)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
