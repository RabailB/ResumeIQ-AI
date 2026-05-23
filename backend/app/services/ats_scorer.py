import re
from typing import List, Dict, Any

# Action verbs that signal strong resume writing
ACTION_VERBS: List[str] = [
    'developed', 'built', 'created', 'managed', 'led', 'designed',
    'implemented', 'improved', 'increased', 'reduced', 'analyzed',
    'coordinated', 'delivered', 'achieved', 'optimized', 'automated',
    'deployed', 'architected', 'established', 'maintained',
    # Additional impactful verbs
    'engineered', 'launched', 'streamlined', 'negotiated', 'resolved',
    'collaborated', 'mentored', 'trained', 'supervised', 'spearheaded',
    'orchestrated', 'integrated', 'migrated', 'refactored', 'scaled',
    'secured', 'transformed', 'generated', 'executed', 'oversaw',
]

# Regex patterns for contact info
_EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b')
_PHONE_RE = re.compile(
    r'(\+?\d[\d\s\-().]{7,}\d)'
)
_LINKEDIN_RE = re.compile(r'linkedin\.com/in/[\w\-]+', re.IGNORECASE)
_GITHUB_RE = re.compile(r'github\.com/[\w\-]+', re.IGNORECASE)


def _score_keywords(skills: List[str]) -> int:
    """30 pts: 3 pts per skill up to 30."""
    return min(len(skills) * 3, 30)


def _score_formatting(sections: Dict[str, str]) -> int:
    """
    20 pts: Award points for each detected important section.
    education: +5, experience: +5, skills: +5, summary: +5
    """
    score = 0
    if sections.get('education'):
        score += 5
    if sections.get('experience'):
        score += 5
    if sections.get('skills'):
        score += 5
    if sections.get('summary'):
        score += 5
    return score


def _score_length(text: str) -> int:
    """
    15 pts based on word count:
      300-700 -> 15pts
      200-299 -> 10pts
      100-199 -> 7pts
      <100 or >1000 -> 5pts
    """
    word_count = len(text.split())
    if 300 <= word_count <= 700:
        return 15
    elif 200 <= word_count < 300:
        return 10
    elif 100 <= word_count < 200:
        return 7
    else:
        return 5


def _score_action_verbs(text: str) -> int:
    """
    15 pts: 1.5 pts per unique action verb found, max 15.
    """
    text_lower = text.lower()
    count = 0
    for verb in ACTION_VERBS:
        pattern = r'\b' + re.escape(verb) + r'\b'
        if re.search(pattern, text_lower):
            count += 1
    return min(int(count * 1.5), 15)


def _score_contact(text: str) -> int:
    """
    20 pts:
      email found -> +10
      phone found -> +5
      linkedin or github found -> +5
    """
    score = 0
    if _EMAIL_RE.search(text):
        score += 10
    if _PHONE_RE.search(text):
        score += 5
    if _LINKEDIN_RE.search(text) or _GITHUB_RE.search(text):
        score += 5
    return score


def calculate_ats_score(
    text: str,
    skills: List[str],
    sections: Dict[str, str]
) -> Dict[str, Any]:
    """
    Calculate a composite ATS score (0-100) for the resume.

    Returns:
        {
            'total_score': int,
            'breakdown': {
                'keyword_score': int,       # max 30
                'formatting_score': int,    # max 20
                'length_score': int,        # max 15
                'action_verb_score': int,   # max 15
                'contact_score': int,       # max 20
            },
            'grade': str  # Excellent / Good / Average / Poor
        }
    """
    keyword_score = _score_keywords(skills)
    formatting_score = _score_formatting(sections)
    length_score = _score_length(text)
    action_verb_score = _score_action_verbs(text)
    contact_score = _score_contact(text)

    total_score = keyword_score + formatting_score + length_score + action_verb_score + contact_score
    total_score = min(total_score, 100)  # Cap at 100

    # Determine grade
    if total_score >= 85:
        grade = 'Excellent'
    elif total_score >= 70:
        grade = 'Good'
    elif total_score >= 50:
        grade = 'Average'
    else:
        grade = 'Poor'

    return {
        'total_score': total_score,
        'breakdown': {
            'keyword_score': keyword_score,
            'formatting_score': formatting_score,
            'length_score': length_score,
            'action_verb_score': action_verb_score,
            'contact_score': contact_score,
        },
        'grade': grade,
    }
