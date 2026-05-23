import re
import string
from typing import List, Dict

try:
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize, sent_tokenize
    NLTK_AVAILABLE = True
    try:
        _STOP_WORDS = set(stopwords.words('english'))
    except LookupError:
        import nltk
        nltk.download('stopwords', quiet=True)
        nltk.download('punkt', quiet=True)
        nltk.download('punkt_tab', quiet=True)
        _STOP_WORDS = set(stopwords.words('english'))
except ImportError:
    NLTK_AVAILABLE = False
    _STOP_WORDS = set()


# ??? Comprehensive Skills Vocabulary ????????????????????????????????????????

SKILLS_VOCABULARY: set = {
    # Programming Languages
    'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'PHP', 'Ruby',
    'Swift', 'Kotlin', 'Go', 'Rust', 'R', 'MATLAB', 'Scala',

    # Web Technologies
    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js',
    'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel',

    # Databases
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    'Cassandra', 'Firebase', 'DynamoDB',

    # AI / ML
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn',
    'pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV', 'NLTK', 'spaCy',

    # Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'Linux', 'REST API',
    'GraphQL', 'Microservices', 'Agile', 'Scrum', 'DevOps', 'CI/CD',

    # Data & Analytics
    'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI',
    'Excel', 'Statistics',

    # Soft Skills
    'Project Management', 'Communication', 'Leadership', 'Teamwork',
    'Problem Solving', 'Critical Thinking',

    # Security
    'Networking', 'Cybersecurity', 'Penetration Testing', 'Ethical Hacking',

    # Mobile
    'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin',

    # Blockchain
    'Blockchain', 'Solidity', 'Smart Contracts', 'NFT',

    # Design
    'Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'Adobe XD',

    # Enterprise
    'SAP', 'ERP', 'CRM', 'Salesforce',

    # Big Data
    'Hadoop', 'Spark', 'Kafka', 'ETL', 'Data Warehousing', 'Big Data',
}

# Build a lowercase lookup for fast case-insensitive matching
_SKILLS_LOWER: Dict[str, str] = {skill.lower(): skill for skill in SKILLS_VOCABULARY}


def extract_skills(text: str) -> List[str]:
    """
    Extract skills from resume text using case-insensitive substring search.
    Returns a sorted list of matched canonical skill names.
    """
    if not text:
        return []

    text_lower = text.lower()
    matched = set()

    for skill_lower, skill_canonical in _SKILLS_LOWER.items():
        # Use word-boundary-aware search: wrap multi-word skills or use \b for single words
        # For multi-word skills (e.g. "Machine Learning") just do substring search
        # For single-word skills use word boundary to avoid false matches
        words_in_skill = skill_lower.split()
        if len(words_in_skill) == 1:
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, text_lower):
                matched.add(skill_canonical)
        else:
            if skill_lower in text_lower:
                matched.add(skill_canonical)

    return sorted(matched)


def preprocess_text(text: str) -> str:
    """
    Preprocess text: lowercase, remove punctuation and stopwords.
    Returns cleaned text string.
    """
    if not text:
        return ''

    # Lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)

    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)

    # Remove punctuation (keep spaces)
    text = text.translate(str.maketrans(string.punctuation, ' ' * len(string.punctuation)))

    # Remove digits
    text = re.sub(r'\d+', '', text)

    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    # Remove stopwords
    if NLTK_AVAILABLE and _STOP_WORDS:
        try:
            words = word_tokenize(text)
            words = [w for w in words if w not in _STOP_WORDS and len(w) > 1]
            text = ' '.join(words)
        except Exception:
            # Fallback: simple split
            words = text.split()
            words = [w for w in words if w not in _STOP_WORDS and len(w) > 1]
            text = ' '.join(words)
    else:
        words = text.split()
        if _STOP_WORDS:
            words = [w for w in words if w not in _STOP_WORDS and len(w) > 1]
        text = ' '.join(words)

    return text


def get_text_features(text: str) -> Dict:
    """
    Extract quantitative features from resume text.
    Returns dict with word_count, sentence_count, avg_word_length.
    """
    if not text:
        return {'word_count': 0, 'sentence_count': 0, 'avg_word_length': 0.0}

    # Word count
    words = text.split()
    word_count = len(words)

    # Sentence count
    if NLTK_AVAILABLE:
        try:
            sentences = sent_tokenize(text)
            sentence_count = len(sentences)
        except Exception:
            sentence_count = len(re.split(r'[.!?]+', text))
    else:
        sentence_count = len(re.split(r'[.!?]+', text))

    # Average word length
    if word_count > 0:
        total_chars = sum(len(w) for w in words)
        avg_word_length = round(total_chars / word_count, 2)
    else:
        avg_word_length = 0.0

    return {
        'word_count': word_count,
        'sentence_count': sentence_count,
        'avg_word_length': avg_word_length,
    }
