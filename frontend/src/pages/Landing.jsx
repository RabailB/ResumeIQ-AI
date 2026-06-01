import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import illustHero    from '../assets/illus_hero_career.png'
import illustAI      from '../assets/illus_ai_brain.png'
import illustSuccess from '../assets/illus_success_person.png'
import './Landing.css'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    ref.current.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

const FEATURES = [
  { emoji: '📄', title: 'ATS Score', desc: 'Instantly see how well your resume scores against Applicant Tracking Systems used by top companies.', color: 'yellow' },
  { emoji: '🔍', title: 'Skill Extraction', desc: 'Our AI reads every line and pulls out every skill — so you never undersell yourself again.', color: 'rose' },
  { emoji: '💼', title: 'Job Matching', desc: 'Get matched to the right roles with confidence percentages based on your unique skill set.', color: 'blue' },
  { emoji: '✨', title: 'Improvement Tips', desc: 'Receive friendly, actionable suggestions to make your resume shine brighter than the rest.', color: 'green' },
]

const STEPS = [
  { n: '1', icon: '📤', title: 'Upload Your Resume', desc: 'Drop in your PDF or DOCX. Takes less than 5 seconds.' },
  { n: '2', icon: '🤖', title: 'AI Does the Magic', desc: 'Our smart engine reads, scores, and understands your resume.' },
  { n: '3', icon: '🎯', title: 'Get Your Results', desc: 'See your ATS score, skills, job matches and tips.' },
  { n: '4', icon: '🚀', title: 'Apply with Confidence', desc: 'Use your insights to land more interviews.' },
]

export default function Landing() {
  const pageRef = useReveal()

  return (
    <div className="landing-page" ref={pageRef}>

      {/* ===== NAVBAR ===== */}
      <nav className="lnav">
        <div className="lnav-inner">
          <Link to="/" className="lnav-logo">
            <span className="lnav-logo-icon">🧠</span>
            <span className="lnav-logo-text">ResumeIQ AI</span>
          </Link>
          <div className="lnav-links">
            <a href="#features" className="lnav-link">Features</a>
            <a href="#how"      className="lnav-link">How it Works</a>
            <Link to="/login"   className="lnav-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary lnav-cta" id="nav-cta">Get Started ✨</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        {/* Decorative doodles */}
        <span className="deco d-star1">★</span>
        <span className="deco d-star2">✦</span>
        <span className="deco d-star3">✶</span>
        <span className="deco d-dot1" />
        <span className="deco d-dot2" />
        <span className="deco d-dot3" />

        <div className="container hero-inner">
          {/* Left */}
          <div className="hero-text reveal">
            <div className="badge badge-yellow mb-4">🎉 AI-Powered · Free to Use</div>
            <h1 className="hero-h1">
              Land Your<br />
              <em>Dream Job</em><br />
              with AI Magic ✨
            </h1>
            <p className="hero-p">
              Upload your resume and get your ATS score, skills analysis, job matches,
              and improvement tips — all in under 5 seconds.
            </p>
            <div className="hero-btns">
              <Link to="/register" className="btn btn-primary" id="hero-cta">
                Analyze My Resume 🚀
              </Link>
              <Link to="/login" className="btn btn-outline" id="hero-login">
                Sign In
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="hero-illus reveal">
            <div className="hero-illus-blob" />
            <img src={illustHero} alt="Career illustration" className="hero-illus-img" />
            {/* Floating tags */}
            <div className="htag htag-1 float-anim">🎯 ATS Score Ready</div>
            <div className="htag htag-2 float-anim" style={{ animationDelay: '0.7s' }}>⚡ 5 sec Analysis</div>
            <div className="htag htag-3 float-anim" style={{ animationDelay: '1.4s' }}>💼 Job Matches</div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="wave-bottom">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F5C842" opacity="0.25" />
            <path d="M0,55 C480,15 960,75 1440,55 L1440,80 L0,80 Z" fill="#EDB830" opacity="0.15" />
          </svg>
        </div>
      </section>

      {/* ===== YELLOW BANNER ===== */}
      <section className="banner-section">
        <div className="container banner-inner">
          <span className="deco b-star1">★</span>
          <span className="deco b-star2">✦</span>
          <p className="banner-text">
            You have an amazing resume — but is it getting past the ATS filter?
            Let our AI read it and tell you exactly what to fix. 🤓
          </p>
        </div>
        <div className="wave-bottom">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF4EC" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-hd reveal text-center">
            <span className="deco-star">★</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              Stop Guessing,<br /><em className="gradient-text">Start Winning</em>
            </h2>
            <p className="section-sub text-center" style={{ margin: '16px auto 0' }}>
              Everything you need to optimize your resume and land more interviews.
            </p>
          </div>

          <div className="features-grid reveal">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`feat-card feat-${f.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feat-icon">{f.emoji}</div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPLIT SECTION: AI ===== */}
      <section className="split-section split-cream">
        <div className="container split-inner">
          <div className="split-img reveal">
            <div className="split-blob split-blob-yellow" />
            <img src={illustAI} alt="AI analyzing resume" className="split-illus" />
          </div>
          <div className="split-text reveal">
            <span className="badge badge-yellow mb-4">🤖 How It Works</span>
            <h2 className="section-title">
              Our AI Reads<br /><em>Every Word</em>
            </h2>
            <p className="section-sub">
              Not just keywords — our machine learning model understands context, skills,
              experience level, and industry fit. It's like having a senior recruiter review
              your resume instantly.
            </p>
            <ul className="split-list mt-8">
              {['Parses your entire resume in seconds', 'Extracts all skills and experience', 'Checks ATS keyword compatibility', 'Matches you to relevant job roles'].map(item => (
                <li key={item} className="split-list-item">
                  <span className="split-check">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="steps-section" id="how">
        <div className="wave-top">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#FAF4EC" />
          </svg>
        </div>

        <div className="container">
          <div className="section-hd reveal text-center">
            <h2 className="section-title">
              Simple Steps to Your<br /><em>Next Big Opportunity</em> 🌟
            </h2>
            <p className="section-sub text-center" style={{ margin: '16px auto 0' }}>
              No sign-up headaches. No confusing dashboards. Just upload, analyze, and go get that job.
            </p>
          </div>

          <div className="steps-grid reveal">
            {STEPS.map((s, i) => (
              <div key={s.n} className="step-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="step-num">{s.n}</div>
                <div className="step-icon-box">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="wave-bottom">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,30 C480,0 960,60 1440,30 L1440,60 L0,60 Z" fill="#FAF4EC" />
          </svg>
        </div>
      </section>

      {/* ===== SPLIT SECTION: SUCCESS ===== */}
      <section className="split-section">
        <div className="container split-inner split-reverse">
          <div className="split-text reveal">
            <span className="badge badge-rose mb-4">🚀 Your Success Story</span>
            <h2 className="section-title">
              Apply Smarter,<br /><em>Land Faster</em>
            </h2>
            <p className="section-sub">
              Armed with your personalized insights, you'll know exactly which jobs to target,
              what to highlight, and how to beat the ATS. No more sending resumes into the void.
            </p>
            <div className="mt-8">
              <Link to="/register" className="btn btn-rose" id="split-cta">
                Start for Free →
              </Link>
            </div>
          </div>
          <div className="split-img reveal">
            <div className="split-blob split-blob-rose" />
            <img src={illustSuccess} alt="Landing a job" className="split-illus" />
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-section">
        <div className="wave-top">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#FAF4EC" />
          </svg>
        </div>
        <div className="cta-inner">
          <span className="deco c-star1">★</span>
          <span className="deco c-star2">✦</span>
          <span className="deco c-star3">✶</span>
          <div className="container text-center">
            <h2 className="cta-title reveal">
              Ready to analyze<br />your resume? 🧠
            </h2>
            <p className="cta-sub reveal">
              It's free, it's fast, and it might just change your career.
            </p>
            <div className="reveal">
              <Link to="/register" className="btn btn-primary cta-btn" id="cta-register">
                Get My Free Analysis ✨
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="container footer-inner">
          <span className="footer-logo">🧠 ResumeIQ AI</span>
          <p className="footer-copy">© 2024 ResumeIQ AI · Made with ♥ and machine learning</p>
        </div>
      </footer>

    </div>
  )
}
