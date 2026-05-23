import React from 'react'
import './JobCards.css'

function getMatchColor(pct) {
  if (pct >= 75) return { bar: '#10b981', glow: 'rgba(16,185,129,0.3)', badge: 'badge-green' }
  if (pct >= 50) return { bar: '#00d4ff', glow: 'rgba(0,212,255,0.25)', badge: 'badge-cyan' }
  if (pct >= 30) return { bar: '#f59e0b', glow: 'rgba(245,158,11,0.25)', badge: 'badge-amber' }
  return { bar: '#ef4444', glow: 'rgba(239,68,68,0.2)', badge: 'badge-red' }
}

function JobCard({ job, rank }) {
  const pct = job.match_percentage ?? 0
  const conf = job.confidence ?? 0
  const { bar, glow, badge } = getMatchColor(pct)

  return (
    <div className="job-card glass fade-in">
      <div className="job-card-header">
        <div className="job-rank">#{rank}</div>
        <div className="job-info">
          <h3 className="job-role">{job.role || 'Unknown Role'}</h3>
          <div className="job-badges">
            <span className={`badge ${badge}`}>{pct}% Match</span>
            <span className="badge badge-purple">
              {(conf * 100).toFixed(0)}% Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Match bar */}
      <div className="job-match-section">
        <div className="job-match-label">
          <span>Match Score</span>
          <span style={{ color: bar, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${bar}99, ${bar})`,
              boxShadow: `0 0 10px ${glow}`,
            }}
          />
        </div>
      </div>

      {/* Matched skills */}
      {job.matched_skills?.length > 0 && (
        <div className="job-skills-section">
          <div className="job-skills-label">
            <span className="dot-green" />
            Matched Skills
          </div>
          <div className="job-skills-wrap">
            {job.matched_skills.map((s, i) => (
              <span key={i} className="skill-chip skill-chip-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Required skills */}
      {job.required_skills?.length > 0 && (
        <div className="job-skills-section">
          <div className="job-skills-label">
            <span className="dot-muted" />
            Required Skills
          </div>
          <div className="job-skills-wrap">
            {job.required_skills.map((s, i) => {
              const matched = job.matched_skills?.includes(s)
              return (
                <span key={i} className={`skill-chip ${matched ? 'skill-chip-green' : 'skill-chip-muted'}`}>
                  {matched && '✓ '}{s}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobCards({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">💼</span>
        <h3>No Job Recommendations Yet</h3>
        <p>Analyze your resume to get personalized job role matches.</p>
      </div>
    )
  }

  const top = recommendations.slice(0, 3)

  return (
    <div className="job-cards-wrapper">
      <div className="job-cards-header">
        <h3 className="job-cards-title">Top Job Matches</h3>
        <span className="badge badge-purple">{top.length} Roles Found</span>
      </div>
      <div className="job-cards-grid">
        {top.map((job, idx) => (
          <JobCard key={idx} job={job} rank={idx + 1} />
        ))}
      </div>
    </div>
  )
}
