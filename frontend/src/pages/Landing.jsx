import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import heroBoy from '../assets/hero_boy.png'
import heroGirlThinking from '../assets/hero_girl_thinking.png'
import heroGirlAnalyzing from '../assets/hero_girl_analyzing.png'
import './Landing.css'

const FEATURES = [
  {
    icon: '🎯',
    title: 'ATS Score',
    desc: 'Get your resume\'s ATS compatibility score and understand exactly how applicant tracking systems rank you.',
    color: 'var(--accent-orange)',
    bg: 'rgba(249, 115, 22, 0.1)',
  },
  {
    icon: '🔍',
    title: 'Skill Extraction',
    desc: 'AI automatically identifies all your technical and soft skills, ensuring none of your expertise goes unnoticed.',
    color: 'var(--accent-yellow)',
    bg: 'rgba(234, 179, 8, 0.1)',
  },
  {
    icon: '💼',
    title: 'Job Recommendations',
    desc: 'Get matched to the right job roles based on your skills and experience with confidence percentages.',
    color: 'var(--accent-green)',
    bg: 'rgba(22, 163, 74, 0.1)',
  },
  {
    icon: '📝',
    title: 'Improvement Tips',
    desc: 'Receive actionable, priority-ranked suggestions to optimize your resume for maximum impact.',
    color: 'var(--accent-blue)',
    bg: 'rgba(37, 99, 235, 0.1)',
  },
]

const STEPS = [
  { num: '01', title: 'Upload Resume', desc: 'Drag & drop your PDF or DOCX file into our secure uploader.', icon: '📤' },
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
  useIntersectionObserver(pageRef, { threshold: 0.12 })

  return (
    <div className="landing" ref={pageRef}>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        {/* Background blobs */}
        <div className="hero-blob blob-1" />
        <div className="hero-blob blob-2" />
        <div className="hero-blob blob-3" />
        <div className="hero-dots" />

        <div className="container hero-content">
          {/* Left */}
          <div className="hero-left">
            <div className="hero-badge-wrap reveal">
              <div className="hero-badge">
                <div className="hero-badge-dot" />
                ✨ AI-Powered Resume Analysis
              </div>
            </div>

            <h1 className="hero-title reveal">
              Analyze Your Resume
              <span className="line-gradient">with AI Intelligence</span>
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


          </div>

          {/* Right — Illustrations Only */}
          <div className="hero-right reveal">
            <div className="illus-center float-anim">
              <img src={heroGirlAnalyzing} alt="Analyzing resume" className="illus-main" />
            </div>
            <div className="float-illus illus-boy float-anim" style={{ animationDelay: '0.3s' }}>
              <img src={heroBoy} alt="Smart assistant" />
            </div>
            <div className="float-illus illus-thinking float-anim" style={{ animationDelay: '0.9s' }}>
              <img src={heroGirlThinking} alt="Thinking girl" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="badge badge-cyan">✨ Features</span>
            <h2 className="section-title" style={{ marginTop: '14px' }}>
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
                className="feature-card reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon-wrap" style={{ background: f.bg }}>
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
            <span className="badge badge-green">🔄 How It Works</span>
            <h2 className="section-title" style={{ marginTop: '14px' }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card reveal">
            <h2 className="cta-title">
              Ready to supercharge your<br />job search? 🚀
            </h2>
            <p className="cta-sub">
              Join thousands of job seekers who've improved their resume with ResumeIQ AI.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn-cta" id="cta-section-register">
                <span>Start Analyzing for Free</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
              🧠 Resume<span className="gradient-text">IQ</span> AI
            </span>
            <p className="footer-copy">© 2024 ResumeIQ AI. Built with ❤️ and machine learning.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
