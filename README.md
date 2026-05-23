# 📄 ResumeIQ AI — Smart Resume Analyzer

An intelligent resume analysis system that uses **Machine Learning** and **NLP** to evaluate resumes, extract skills, generate ATS scores, and recommend suitable job roles.

---

## 🚀 Quick Start (Windows)

### Step 1 — Prerequisites
Install these first:
| Tool | Download Link | Version |
|---|---|---|
| **Python** | https://python.org/downloads | 3.9 or higher |
| **Node.js** | https://nodejs.org | 18 or higher |
| **Git** (optional) | https://git-scm.com | any |

> ⚠️ During Python install, **check "Add Python to PATH"**

---

### Step 2 — Start the Backend
Double-click **`start_backend.bat`**

This will automatically:
1. Create a Python virtual environment
2. Install all Python packages
3. Generate synthetic training data (700 resumes)
4. Train the ML classification model
5. Start Flask server on **http://localhost:5000**

> ⏱️ First run takes ~2-3 minutes (training). Subsequent runs are instant.

---

### Step 3 — Start the Frontend
Open a **new terminal window** and double-click **`start_frontend.bat`**

This will:
1. Install npm packages (first time)
2. Start Vite dev server on **http://localhost:5173**

---

### Step 4 — Open the App
Open your browser and go to: **http://localhost:5173**

---

## 📁 Project Structure

```
ResumeIQ AI/
├── 🟢 start_backend.bat       ← Run this first
├── 🔵 start_frontend.bat      ← Run this second
│
├── backend/
│   ├── app/
│   │   ├── __init__.py        # Flask app factory
│   │   ├── config.py          # Configuration
│   │   ├── models/
│   │   │   ├── user.py        # User DB model
│   │   │   └── resume.py      # Resume DB model
│   │   ├── routes/
│   │   │   ├── auth.py        # Authentication API
│   │   │   ├── resume.py      # Resume upload API
│   │   │   └── analysis.py    # Analysis API
│   │   └── services/
│   │       ├── parser.py      # PDF/DOCX extraction
│   │       ├── nlp_processor.py  # Skill extraction
│   │       ├── ats_scorer.py  # ATS score engine
│   │       ├── job_recommender.py  # Job matching
│   │       └── suggester.py   # Improvement suggestions
│   ├── ml/
│   │   ├── generate_data.py   # Synthetic dataset
│   │   ├── train.py           # ML model training
│   │   ├── data/              # Training CSV files
│   │   └── models/            # Saved .pkl models
│   ├── uploads/               # Uploaded resumes
│   ├── requirements.txt
│   ├── run.py
│   └── setup.py
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Routes + Auth context
    │   ├── index.css          # Global dark theme
    │   ├── api/client.js      # Axios + JWT interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── UploadZone.jsx # Drag & drop uploader
    │   │   ├── ScoreRing.jsx  # Animated ATS score
    │   │   ├── SkillTags.jsx  # Skill chips
    │   │   ├── JobCards.jsx   # Job recommendations
    │   │   └── SuggestionList.jsx
    │   └── pages/
    │       ├── Landing.jsx    # Hero / home page
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Dashboard.jsx  # Upload + results
    │       ├── History.jsx    # Past analyses
    │       └── ResultPage.jsx # Single result view
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🧠 How It Works

```
User uploads PDF/DOCX
        ↓
Text Extraction (pdfminer / python-docx)
        ↓
NLP Processing (NLTK tokenization + skill matching)
        ↓
ATS Score Calculation (5 weighted factors → 0-100)
        ↓
Job Role Recommendation (TF-IDF + Logistic Regression)
        ↓
Improvement Suggestions (Rule-based engine)
        ↓
Results Dashboard (React UI)
```

---

## 📊 ATS Score Breakdown

| Factor | Max Points | How Scored |
|---|---|---|
| Keyword Density | 30 | Number of skills detected |
| Formatting | 20 | Presence of key sections |
| Length | 15 | Ideal: 300–700 words |
| Action Verbs | 15 | Power words used |
| Contact Info | 20 | Email, phone, LinkedIn |

---

## 🔗 Dataset Links (Optional — to improve ML accuracy)

| Dataset | URL | Use |
|---|---|---|
| Resume Dataset (2400 resumes) | https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset | Place as `backend/ml/data/resumes.csv` |
| Resume Dataset (alternate) | https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset | Alternative training data |
| Job Descriptions | https://www.kaggle.com/datasets/ravindrasinghrana/job-description-dataset | ATS keyword expansion |

> 📝 To use Kaggle data: Download `Resume.csv`, rename to `resumes.csv`, place in `backend/ml/data/`, then run `python ml/train.py`

---

## 📦 Libraries Used

| Library | Purpose |
|---|---|
| Flask | Backend web framework |
| Flask-JWT-Extended | JWT authentication |
| Flask-SQLAlchemy | Database ORM (SQLite) |
| bcrypt | Password hashing |
| pdfminer.six | PDF text extraction |
| python-docx | DOCX file parsing |
| NLTK | Natural Language Processing |
| scikit-learn | ML classification |
| pandas / NumPy | Data processing |
| React 18 | Frontend UI |
| Vite | Frontend build tool |
| Axios | HTTP client |
| React Router | Page navigation |

---

## 🌐 API Endpoints

```
POST   /api/auth/register    Register new account
POST   /api/auth/login       Login
GET    /api/auth/me          Get current user
POST   /api/auth/logout      Logout

POST   /api/resume/upload    Upload PDF/DOCX
GET    /api/resume/list      Get all user's resumes
GET    /api/resume/<id>      Get resume with analysis
DELETE /api/resume/<id>      Delete resume

POST   /api/analyze/<id>     Run full analysis
```

---

## 🛠️ Troubleshooting

**"Python not found"** → Re-install Python and check "Add to PATH"

**"pip install failed"** → Run: `python -m pip install --upgrade pip`

**"Port 5000 already in use"** → Change port in `backend/run.py` to 5001

**"CORS error in browser"** → Make sure backend is running before frontend

**"Model not found"** → Run `python setup.py` inside the `backend/` folder

---

## 👩‍💻 Developer Info

- **Project**: ResumeIQ AI (Final Year Project)
- **Tech Stack**: Python · Flask · React · SQLite · scikit-learn · NLTK
- **Architecture**: REST API + SPA (Single Page Application)

---

*Built with ❤️ using AI-powered automation*
