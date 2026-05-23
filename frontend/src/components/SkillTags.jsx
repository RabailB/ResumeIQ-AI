import React from 'react'
import './SkillTags.css'

const TAG_COLORS = [
  { bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.25)', color: '#00d4ff' },
  { bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)', color: '#a78bfa' },
  { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', color: '#10b981' },
  { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b' },
  { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.25)', color: '#f472b6' },
]

export default function SkillTags({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <h3>No Skills Detected</h3>
        <p>Run analysis to extract your technical skills from the resume.</p>
      </div>
    )
  }

  return (
    <div className="skill-tags-wrapper">
      <div className="skill-count-badge">
        <span className="badge badge-cyan">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {skills.length} Skills Detected
        </span>
      </div>
      <div className="skill-tags-grid">
        {skills.map((skill, idx) => {
          const colorStyle = TAG_COLORS[idx % TAG_COLORS.length]
          return (
            <div
              key={`${skill}-${idx}`}
              className="skill-tag"
              style={{
                '--tag-bg': colorStyle.bg,
                '--tag-border': colorStyle.border,
                '--tag-color': colorStyle.color,
              }}
            >
              <span className="skill-tag-dot" />
              {skill}
            </div>
          )
        })}
      </div>
    </div>
  )
}
