import React, { useEffect, useRef } from 'react'

const COLORS = {
  excellent: { stroke: '#10b981', glow: '#10b981', label: 'Excellent' },
  good: { stroke: '#00d4ff', glow: '#00d4ff', label: 'Good' },
  average: { stroke: '#f59e0b', glow: '#f59e0b', label: 'Average' },
  poor: { stroke: '#ef4444', glow: '#ef4444', label: 'Poor' },
}

function getColorKey(score) {
  if (score >= 70) return 'excellent'
  if (score >= 50) return 'good'
  if (score >= 30) return 'average'
  return 'poor'
}

export default function ScoreRing({ score = 0, size = 180 }) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const colorKey = getColorKey(clampedScore)
  const color = COLORS[colorKey]

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = size * 0.055
  const dashOffset = circumference - (clampedScore / 100) * circumference
  const fontSize = size * 0.22
  const labelSize = size * 0.082

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Glow layer */}
        <svg
          width={size}
          height={size}
          style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${size * 0.08}px ${color.glow}55)` }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Main ring */}
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontSize,
              fontWeight: 800,
              color: color.stroke,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {clampedScore}
          </span>
          <span
            style={{
              fontSize: labelSize * 0.75,
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* Grade label */}
      <div
        style={{
          padding: '4px 14px',
          borderRadius: '999px',
          background: `${color.stroke}15`,
          border: `1px solid ${color.stroke}30`,
          color: color.stroke,
          fontSize: labelSize,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {color.label}
      </div>
    </div>
  )
}
