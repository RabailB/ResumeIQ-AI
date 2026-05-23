import React, { useState } from 'react'
import './SuggestionList.css'

const PRIORITY_CONFIG = {
  high: { icon: '🔴', label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', order: 0 },
  medium: { icon: '🟡', label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', order: 1 },
  low: { icon: '🟢', label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', order: 2 },
}

const CATEGORY_COLORS = {
  structure: 'badge-cyan',
  content: 'badge-purple',
  keywords: 'badge-amber',
  formatting: 'badge-green',
}

function SuggestionItem({ suggestion, index }) {
  const [expanded, setExpanded] = useState(false)
  const priority = PRIORITY_CONFIG[suggestion.priority?.toLowerCase()] || PRIORITY_CONFIG.medium
  const categoryClass = CATEGORY_COLORS[suggestion.category?.toLowerCase()] || 'badge-cyan'

  return (
    <div
      className="suggestion-item fade-in"
      style={{ animationDelay: `${index * 0.06}s`, '--priority-color': priority.color }}
    >
      <div
        className="suggestion-header"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
        aria-expanded={expanded}
        id={`suggestion-${index}`}
      >
        <div className="suggestion-left">
          <span className="priority-icon">{priority.icon}</span>
          <div className="suggestion-text-group">
            <p className="suggestion-message">{suggestion.message}</p>
            <div className="suggestion-meta">
              <span className={`badge ${categoryClass}`}>{suggestion.category || 'General'}</span>
              <span
                className="priority-tag"
                style={{ color: priority.color, background: priority.bg, border: `1px solid ${priority.border}` }}
              >
                {priority.label} Priority
              </span>
            </div>
          </div>
        </div>
        <div className={`chevron ${expanded ? 'expanded' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {expanded && suggestion.tip && (
        <div className="suggestion-tip fade-in-scale">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <span className="tip-label">Pro Tip</span>
            <p className="tip-text">{suggestion.tip}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SuggestionList({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">📝</span>
        <h3>No Suggestions Available</h3>
        <p>Analyze your resume to receive improvement suggestions.</p>
      </div>
    )
  }

  const sorted = [...suggestions].sort((a, b) => {
    const aOrder = PRIORITY_CONFIG[a.priority?.toLowerCase()]?.order ?? 99
    const bOrder = PRIORITY_CONFIG[b.priority?.toLowerCase()]?.order ?? 99
    return aOrder - bOrder
  })

  const highCount = sorted.filter(s => s.priority?.toLowerCase() === 'high').length
  const medCount = sorted.filter(s => s.priority?.toLowerCase() === 'medium').length
  const lowCount = sorted.filter(s => s.priority?.toLowerCase() === 'low').length

  return (
    <div className="suggestion-list-wrapper">
      <div className="suggestion-stats">
        <div className="suggestion-stat-item">
          <span className="badge badge-red">🔴 {highCount} High</span>
        </div>
        <div className="suggestion-stat-item">
          <span className="badge badge-amber">🟡 {medCount} Medium</span>
        </div>
        <div className="suggestion-stat-item">
          <span className="badge badge-green">🟢 {lowCount} Low</span>
        </div>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '13px' }}>
          {suggestions.length} total
        </span>
      </div>

      <div className="suggestion-accordion">
        {sorted.map((s, i) => (
          <SuggestionItem key={i} suggestion={s} index={i} />
        ))}
      </div>
    </div>
  )
}
