from typing import List, Dict, Any

# Job profiles: role -> required skills
JOB_PROFILES: Dict[str, List[str]] = {
    'Data Scientist': [
        'Python', 'Machine Learning', 'Deep Learning', 'Statistics',
        'pandas', 'NumPy', 'TensorFlow', 'scikit-learn', 'SQL',
        'Data Analysis', 'Data Visualization',
    ],
    'Web Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js',
        'SQL', 'Git', 'REST API',
    ],
    'Backend Developer': [
        'Python', 'Java', 'Node.js', 'SQL', 'REST API',
        'Docker', 'Git', 'PostgreSQL',
    ],
    'Frontend Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Angular',
        'Vue.js', 'TypeScript', 'Figma',
    ],
    'DevOps Engineer': [
        'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Linux',
        'CI/CD', 'Git', 'Python',
    ],
    'Machine Learning Engineer': [
        'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow',
        'PyTorch', 'scikit-learn', 'pandas', 'NumPy', 'SQL',
    ],
    'Android Developer': [
        'Java', 'Kotlin', 'Android', 'Firebase', 'SQL', 'REST API', 'Git',
    ],
    'iOS Developer': [
        'Swift', 'iOS', 'Firebase', 'REST API', 'Git',
    ],
    'Database Administrator': [
        'SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'MongoDB',
        'Redis', 'Data Warehousing',
    ],
    'Cybersecurity Analyst': [
        'Networking', 'Cybersecurity', 'Linux', 'Python',
        'Penetration Testing', 'Ethical Hacking',
    ],
    'UI/UX Designer': [
        'Figma', 'Adobe XD', 'UI/UX', 'Photoshop', 'Illustrator',
        'CSS', 'HTML',
    ],
    'Business Analyst': [
        'Data Analysis', 'Excel', 'SQL', 'Tableau', 'Power BI',
        'Project Management', 'Communication',
    ],
    'Full Stack Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python',
        'SQL', 'REST API', 'Git', 'Docker',
    ],
    'Data Analyst': [
        'SQL', 'Excel', 'Python', 'Data Analysis', 'Data Visualization',
        'Tableau', 'Power BI', 'Statistics',
    ],
    'Cloud Architect': [
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
        'Microservices', 'Python', 'Linux',
    ],
}


def recommend_jobs(text: str, skills: List[str]) -> List[Dict[str, Any]]:
    """
    Recommend job roles based on skill matching.

    For each role in JOB_PROFILES, compute:
      - matched_skills: skills from user that appear in required list
      - match_percentage: matched / required * 100
      - confidence: 'High' / 'Medium' / 'Low'

    Returns top 3 roles sorted by match_percentage desc.
    """
    skills_set = set(skills)
    results = []

    for role, required_skills in JOB_PROFILES.items():
        required_set = set(required_skills)
        matched = list(skills_set.intersection(required_set))
        match_pct = (len(matched) / len(required_set)) * 100 if required_set else 0

        # Confidence tier
        if match_pct >= 70:
            confidence = 'High'
        elif match_pct >= 40:
            confidence = 'Medium'
        else:
            confidence = 'Low'

        results.append({
            'role': role,
            'confidence': confidence,
            'required_skills': required_skills,
            'matched_skills': sorted(matched),
            'match_percentage': round(match_pct, 1),
        })

    # Sort by match_percentage descending, then alphabetically for ties
    results.sort(key=lambda x: (-x['match_percentage'], x['role']))

    # Return top 3
    return results[:3]
