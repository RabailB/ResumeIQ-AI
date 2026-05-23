import re
from typing import List, Dict, Any

# Contact detection patterns
_EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b')
_PHONE_RE = re.compile(r'(\+?\d[\d\s\-().]{7,}\d)')
_LINKEDIN_RE = re.compile(r'linkedin\.com/in/[\w\-]+', re.IGNORECASE)
_GITHUB_RE = re.compile(r'github\.com/[\w\-]+', re.IGNORECASE)
_QUANTIFY_RE = re.compile(r'\b\d+[%$KkMm]?\b|\b\d+\s*(percent|million|billion|thousand)\b', re.IGNORECASE)

# Action verbs to check presence
_ACTION_VERBS = [
    'developed', 'built', 'created', 'managed', 'led', 'designed',
    'implemented', 'improved', 'increased', 'reduced', 'analyzed',
    'coordinated', 'delivered', 'achieved', 'optimized', 'automated',
    'deployed', 'architected', 'established', 'maintained',
]


def _has_action_verbs(text: str) -> bool:
    text_lower = text.lower()
    return any(re.search(r'\b' + v + r'\b', text_lower) for v in _ACTION_VERBS)


def _has_quantification(text: str) -> bool:
    return bool(_QUANTIFY_RE.search(text))


def generate_suggestions(
    text: str,
    skills: List[str],
    sections: Dict[str, str],
    ats_breakdown: Dict[str, int]
) -> List[Dict[str, Any]]:
    """
    Generate actionable resume improvement suggestions.

    Returns a list of suggestion dicts:
        [{priority, category, message, tip}]
    Priority: 'high' | 'medium' | 'low'
    Category: 'structure' | 'content' | 'keywords' | 'formatting'
    """
    suggestions = []
    word_count = len(text.split())
    has_email = bool(_EMAIL_RE.search(text))
    has_phone = bool(_PHONE_RE.search(text))
    has_linkedin = bool(_LINKEDIN_RE.search(text))
    has_github = bool(_GITHUB_RE.search(text))
    has_verbs = _has_action_verbs(text)
    has_numbers = _has_quantification(text)

    # ?? Structure: Missing Sections ??????????????????????????????????????????

    if not sections.get('summary'):
        suggestions.append({
            'priority': 'high',
            'category': 'structure',
            'message': 'Missing Professional Summary section',
            'tip': (
                'Add a 3-4 sentence professional summary at the top of your resume. '
                'It should highlight your experience level, key skills, and career goal. '
                'ATS systems scan this section first -- make it keyword-rich.'
            ),
        })

    if not sections.get('experience'):
        suggestions.append({
            'priority': 'high',
            'category': 'structure',
            'message': 'No Work Experience section detected',
            'tip': (
                'Include a clearly labelled "Work Experience" or "Professional Experience" section. '
                'List roles in reverse chronological order with company name, title, and dates.'
            ),
        })

    if not sections.get('education'):
        suggestions.append({
            'priority': 'medium',
            'category': 'structure',
            'message': 'Education section not detected',
            'tip': (
                'Add an "Education" section with your degree, institution, and graduation year. '
                'Many ATS systems filter candidates by education qualifiers.'
            ),
        })

    if not sections.get('skills'):
        suggestions.append({
            'priority': 'high',
            'category': 'structure',
            'message': 'No dedicated Skills section found',
            'tip': (
                'Add a "Skills" section listing your technical and soft skills separated by commas or bullets. '
                'This is one of the most heavily weighted sections in ATS parsing.'
            ),
        })

    if not sections.get('projects'):
        suggestions.append({
            'priority': 'low',
            'category': 'structure',
            'message': 'Consider adding a Projects section',
            'tip': (
                'A Projects section showcases hands-on work especially if you lack extensive experience. '
                'Include project name, tech stack used, and key outcomes.'
            ),
        })

    # ?? Content: Skills ???????????????????????????????????????????????????????

    if len(skills) < 5:
        suggestions.append({
            'priority': 'high',
            'category': 'keywords',
            'message': f'Only {len(skills)} recognizable skill(s) found -- too few for ATS',
            'tip': (
                'Expand your skills section to include 10-15+ technical and transferable skills. '
                'Match keywords from the job description you are targeting. '
                'Include tools, frameworks, languages, and methodologies.'
            ),
        })
    elif len(skills) < 10:
        suggestions.append({
            'priority': 'medium',
            'category': 'keywords',
            'message': f'{len(skills)} skills detected -- aim for at least 10-15',
            'tip': (
                'Consider adding more relevant skills like cloud platforms (AWS/Azure), '
                'version control (Git), databases (SQL/PostgreSQL), or domain-specific tools.'
            ),
        })

    # ?? Content: Action Verbs ????????????????????????????????????????????????

    if not has_verbs:
        suggestions.append({
            'priority': 'high',
            'category': 'content',
            'message': 'No strong action verbs detected in your resume',
            'tip': (
                'Start each bullet point with a powerful action verb. '
                'Examples: "Developed a REST API that...", "Optimized database queries by...", '
                '"Led a team of 5 engineers to deliver...". '
                'Action verbs make your contributions clear and measurable.'
            ),
        })

    # ?? Content: Quantification ??????????????????????????????????????????????

    if not has_numbers:
        suggestions.append({
            'priority': 'high',
            'category': 'content',
            'message': 'No quantified achievements found (no numbers, %, $, etc.)',
            'tip': (
                'Quantify your impact wherever possible. '
                'Instead of "Improved performance", write "Improved API response time by 40%". '
                'Numbers make your accomplishments credible and memorable to both ATS and recruiters.'
            ),
        })

    # ?? Content: Length ???????????????????????????????????????????????????????

    if word_count < 200:
        suggestions.append({
            'priority': 'high',
            'category': 'formatting',
            'message': f'Resume is too short ({word_count} words) -- ATS may rank it low',
            'tip': (
                'A strong resume should have 300-700 words. '
                'Expand your experience bullets, add a summary, skills section, and certifications. '
                'Thin resumes signal lack of experience to automated screeners.'
            ),
        })
    elif word_count > 1000:
        suggestions.append({
            'priority': 'medium',
            'category': 'formatting',
            'message': f'Resume is too long ({word_count} words) -- consider trimming',
            'tip': (
                'Ideal resumes are 1 page (300-500 words) for juniors or 2 pages (500-700 words) for seniors. '
                'Remove outdated roles (>10 years old), redundant bullets, and filler words. '
                'Recruiters spend an average of 7 seconds on initial review.'
            ),
        })

    # ?? Contact: Email ????????????????????????????????????????????????????????

    if not has_email:
        suggestions.append({
            'priority': 'high',
            'category': 'formatting',
            'message': 'No email address detected in the resume',
            'tip': (
                'Include a professional email address (avoid nicknames like cooldev99@...). '
                'Place it prominently in the header. '
                'Missing contact details will disqualify you immediately.'
            ),
        })

    # ?? Contact: Phone ????????????????????????????????????????????????????????

    if not has_phone:
        suggestions.append({
            'priority': 'medium',
            'category': 'formatting',
            'message': 'Phone number not detected',
            'tip': (
                'Add your phone number to the header section. '
                'Use international format if applying abroad (e.g., +1-555-123-4567). '
                'Recruiters often call before emailing.'
            ),
        })

    # ?? Contact: LinkedIn ????????????????????????????????????????????????????

    if not has_linkedin:
        suggestions.append({
            'priority': 'medium',
            'category': 'content',
            'message': 'LinkedIn profile URL not found',
            'tip': (
                'Add your LinkedIn profile URL to the header (e.g., linkedin.com/in/yourname). '
                'Ensure your LinkedIn is up-to-date and consistent with your resume. '
                '87% of recruiters use LinkedIn to evaluate candidates.'
            ),
        })

    # ?? Contact: GitHub ???????????????????????????????????????????????????????

    if not has_github and len(skills) > 0:
        suggestions.append({
            'priority': 'low',
            'category': 'content',
            'message': 'GitHub profile not linked',
            'tip': (
                'For technical roles, a GitHub profile is essential proof of your skills. '
                'Link it in your header: github.com/yourusername. '
                'Pin your best projects and keep contributions active.'
            ),
        })

    # ?? ATS Score: Low ????????????????????????????????????????????????????????

    total_score = sum(ats_breakdown.values())
    if total_score < 50:
        suggestions.append({
            'priority': 'high',
            'category': 'formatting',
            'message': f'Overall ATS score is low ({total_score}/100) -- major improvements needed',
            'tip': (
                'Focus on: (1) Adding clear section headers, (2) Including 10+ relevant skills, '
                '(3) Using action verbs and numbers, (4) Completing contact information. '
                'A score below 50 means most ATS systems will filter out your resume before a human sees it.'
            ),
        })
    elif total_score < 70:
        suggestions.append({
            'priority': 'medium',
            'category': 'content',
            'message': f'ATS score is average ({total_score}/100) -- room for improvement',
            'tip': (
                'To push past 70+: tailor your resume to each job description, '
                'add a stronger skills section, and quantify at least 3-5 achievements. '
                'Mirror the exact language used in job postings for the role you want.'
            ),
        })

    # ?? Certifications suggestion ??????????????????????????????????????????????

    if not sections.get('certifications'):
        suggestions.append({
            'priority': 'low',
            'category': 'content',
            'message': 'No certifications section detected',
            'tip': (
                'Add relevant certifications (e.g., AWS Certified Solutions Architect, '
                'Google Data Analytics Certificate, PMP, Scrum Master). '
                'Certifications validate your skills and can differentiate you from other candidates.'
            ),
        })

    # ?? Keyword Density ????????????????????????????????????????????????????????

    if ats_breakdown.get('keyword_score', 0) < 15:
        suggestions.append({
            'priority': 'medium',
            'category': 'keywords',
            'message': 'Low keyword density -- add more industry-relevant terms',
            'tip': (
                'Study 3-5 job descriptions for your target role and identify repeated terms. '
                'Incorporate those exact keywords naturally throughout your resume. '
                'Tools like JobScan can help match your resume to a specific job posting.'
            ),
        })

    # Sort: high -> medium -> low
    priority_order = {'high': 0, 'medium': 1, 'low': 2}
    suggestions.sort(key=lambda s: priority_order.get(s['priority'], 3))

    return suggestions
