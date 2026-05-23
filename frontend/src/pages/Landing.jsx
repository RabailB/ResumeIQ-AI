import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const FEATURES = [
  {
    icon: '🎯',
    title: 'ATS Score',
    desc: 'Get your resume\'s ATS compatibility score and understand exactly how applicant tracking systems rank you.',
    color: 'var(--accent-cyan)',
    glow: 'rgba(0,212,255,0.15)',
  },
  {
    icon: '🔍',
    title: 'Skill Extraction',
    desc: 'AI automatically identifies all your technical and soft skills, ensuring none of your expertise goes unnoticed.',
    color: 'var(--accent-purple)',
    glow: 'rgba(124,58,237,0.15)',
  },
  {
    icon: '💼',
    title: 'Job Recommendations',
    desc: 'Get matched to the right job roles based on your skills and experience with confidence percentages.',
    color: 'var(--accent-green)',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: '📝',
    title: 'Improvement Tips',
    desc: 'Receive actionable, priority-ranked suggestions to optimize your resume for maximum impact.',
    color: 'var(--accent-amber)',
    glow: 'rgba(245,158,11,0.15)',
  },
]

const STEPS = [
  { num: '01', title: 'Upload Resume', desc: 'Drag & drop your PDF or DOCX resume file into our secure uploader.', icon: '📤' },
  { num: '02', title: 'AI Analysis', desc: 'Our ML engine parses, extracts, and scores your resume in seconds.', icon: '🤖' },
  { num: '03', title: 'Get Results', desc: 'Receive your ATS score, skills, job matches, and improvement tips.', icon: '📊' },
  { num: '04', title: 'Apply Smarter', desc: 'Use your insights to optimize applications and land more interviews.', icon: '🚀' },
]

const STATS = [
  { value: '98%', label: 'ATS Accuracy' },
  { value: '50+', label: 'Job Roles' },
  { value: '< 5s', label: 'Analysis Time' },
  { value: '10k+', label: 'Resumes Analyzed' },
]

function useIntersectionObserver(ref, options) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, options)
    const elements = ref.current.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Landing() {
  const pageRef = useRef(null)
  useIntersectionObserver(pageRef, { threshold: 0.15 })

  return (
    <div className="landing" ref={pageRef}>
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge reveal">
            <span className="badge badge-cyan">✨ AI-Powered Resume Analysis</span>
          </div>
          <h1 className="hero-title reveal">
            Analyze Your Resume
            <br />
            <span className="gradient-text animated-gradient">with AI Intelligence</span>
          </h1>
          <p className="hero-sub reveal">
            Get instant ATS compatibility scores, skill extraction, personalized job
            recommendations, and actionable improvement tips — all powered by advanced
            machine learning.
          </p>
          <div className="hero-cta reveal">
            <Link to="/register" className="btn-primary btn-lg" id="hero-cta-register">
              <span>🚀 Get Started Free</span>
            </Link>
            <Link to="/login" className="btn-outline btn-lg" id="hero-cta-login">
              Sign In
            </Link>
          </div>
          <div className="hero-stats reveal">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating graphic */}
        <div className="hero-visual reveal">
          <div className="resume-mockup float-anim">
            <div className="mockup-header">
              <div className="mockup-avatar">JD</div>
              <div>
                <div className="mockup-line wide" />
                <div className="mockup-line medium" />
              </div>
              <div className="ats-pill">
                <span className="ats-score-text">ATS</span>
                <span className="ats-number">87</span>
              </div>
            </div>
            <div className="mockup-section-label">Skills</div>
            <div className="mockup-skills">
              {['React', 'Python', 'Node.js', 'ML', 'SQL', 'Docker'].map((s) => (
                <span key={s} className="mockup-skill">{s}</span>
              ))}
            </div>
            <div className="mockup-section-label">Job Match</div>
            <div className="mockup-jobs">
              {[
                { role: 'Full Stack Dev', pct: 92 },
                { role: 'ML Engineer', pct: 78 },
                { role: 'Backend Dev', pct: 71 },
              ].map((j) => (
                <div key={j.role} className="mockup-job-row">
                  <span className="mockup-job-name">{j.role}</span>
                  <div className="mockup-job-bar-wrap">
                    <div className="mockup-job-bar" style={{ width: `${j.pct}%` }} />
                  </div>
                  <span className="mockup-job-pct">{j.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating chips */}
          <div className="float-chip chip-score float-anim" style={{ animationDelay: '0.5s' }}>
            <span>🎯</span> ATS Score: <strong>87/100</strong>
          </div>
          <div className="float-chip chip-skill float-anim" style={{ animationDelay: '1s' }}>
            <span>⚡</span> 12 Skills Found
          </div>
          <div className="float-chip chip-job float-anim" style={{ animationDelay: '1.5s' }}>
            <span>💼</span> 3 Job Matches
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header reveal">
            <span className="badge badge-purple">Features</span>
            <h2 className="section-title" style={{ marginTop: '12px' }}>
              Everything you need to <span className="gradient-text">land your dream job</span>
            </h2>
            <p className="section-subtitle">
              Our AI-powered platform gives you the competitive edge to optimize your resume and stand out.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feature-card glass reveal"
                style={{ animationDelay: `${i * 0.1}s`, '--card-glow': f.glow, '--card-color': f.color }}
              >
                <div className="feature-icon-wrap" style={{ background: f.glow }}>
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <h3 className="feature-title" style={{ color: f.color }}>{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-section section">
        <div className="container">
          <div className="section-header reveal">
            <span className="badge badge-green">How It Works</span>
            <h2 className="section-title" style={{ marginTop: '12px' }}>
              From upload to insights in <span className="gradient-text">4 simple steps</span>
            </h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={step.num} className="step-card reveal" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-card glass reveal">
            <div className="cta-orb" />
            <h2 className="cta-title">
              Ready to supercharge<br />your <span className="gradient-text">job search?</span>
            </h2>
            <p className="cta-sub">
              Join thousands of job seekers who've improved their resume with ResumeIQ AI.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn-primary btn-lg" id="cta-section-register">
                <span>Start Analyzing for Free</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <span className="navbar-logo-text">🧠 Resume<span className="gradient-text">IQ</span> AI</span>
            <p className="footer-copy">© 2024 ResumeIQ AI. Built with ❤️ and machine learning.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
