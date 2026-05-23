"""
generate_data.py
Generates synthetic resume training data across 14 job categories.
Saves to ml/data/resumes.csv with columns: Category, Resume
"""

import os
import random
import csv
from typing import List, Tuple

# ??? Keyword pools per category ??????????????????????????????????????????????

CATEGORY_KEYWORDS = {
    'Data Scientist': [
        'Python', 'machine learning', 'deep learning', 'neural networks', 'statistics',
        'pandas', 'NumPy', 'TensorFlow', 'scikit-learn', 'data analysis', 'SQL',
        'data visualization', 'Matplotlib', 'Seaborn', 'R', 'hypothesis testing',
        'regression', 'classification', 'clustering', 'NLP', 'feature engineering',
        'model evaluation', 'cross-validation', 'Jupyter', 'big data', 'A/B testing',
        'predictive modeling', 'time series analysis', 'Keras', 'PyTorch', 'BERT',
    ],
    'Web Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST API',
        'responsive design', 'Bootstrap', 'jQuery', 'webpack', 'npm', 'Express.js',
        'MongoDB', 'MySQL', 'TypeScript', 'Vue.js', 'Angular', 'PHP', 'WordPress',
        'web performance', 'SEO', 'cross-browser compatibility', 'UI components',
        'Sass', 'LESS', 'GraphQL', 'JSON', 'AJAX', 'DOM manipulation',
    ],
    'Backend Developer': [
        'Python', 'Java', 'Node.js', 'SQL', 'REST API', 'Docker', 'Git', 'PostgreSQL',
        'Django', 'Flask', 'Spring Boot', 'microservices', 'API design', 'Redis',
        'message queues', 'RabbitMQ', 'Kafka', 'authentication', 'JWT', 'OAuth',
        'database optimization', 'caching', 'Linux', 'AWS', 'CI/CD', 'unit testing',
        'C#', '.NET', 'Golang', 'Rust', 'gRPC', 'Nginx', 'load balancing',
    ],
    'Frontend Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'TypeScript',
        'Figma', 'responsive design', 'UI/UX', 'Redux', 'Next.js', 'Webpack',
        'accessibility', 'ARIA', 'CSS animations', 'Flexbox', 'CSS Grid',
        'unit testing', 'Jest', 'React Testing Library', 'Storybook', 'styled-components',
        'Tailwind CSS', 'performance optimization', 'PWA', 'web components', 'Babel',
    ],
    'DevOps Engineer': [
        'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Linux', 'CI/CD', 'Git',
        'Python', 'Terraform', 'Ansible', 'Helm', 'monitoring', 'Prometheus',
        'Grafana', 'ELK Stack', 'infrastructure as code', 'cloud architecture',
        'Azure', 'Google Cloud', 'shell scripting', 'Bash', 'network security',
        'load balancing', 'auto-scaling', 'GitOps', 'ArgoCD', 'deployment pipelines',
    ],
    'Machine Learning Engineer': [
        'Python', 'machine learning', 'deep learning', 'TensorFlow', 'PyTorch',
        'scikit-learn', 'pandas', 'NumPy', 'SQL', 'model deployment', 'MLOps',
        'feature engineering', 'model optimization', 'distributed training',
        'CUDA', 'GPU', 'transformers', 'BERT', 'GPT', 'computer vision',
        'NLP', 'reinforcement learning', 'data pipelines', 'Airflow', 'Kubeflow',
    ],
    'Android Developer': [
        'Java', 'Kotlin', 'Android', 'Firebase', 'SQL', 'REST API', 'Git',
        'Android Studio', 'Jetpack Compose', 'MVVM', 'Room database', 'Retrofit',
        'Glide', 'Picasso', 'RecyclerView', 'Material Design', 'Gradle',
        'Google Play', 'push notifications', 'SQLite', 'SharedPreferences',
        'ViewModel', 'LiveData', 'Hilt', 'Dagger', 'Coroutines', 'Flow',
    ],
    'Database Administrator': [
        'SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis',
        'data warehousing', 'database design', 'query optimization', 'indexing',
        'replication', 'backup and recovery', 'ETL', 'data modeling', 'SQL Server',
        'PL/SQL', 'stored procedures', 'triggers', 'database security',
        'performance tuning', 'Cassandra', 'DynamoDB', 'data migration', 'OLAP',
    ],
    'Cybersecurity Analyst': [
        'networking', 'cybersecurity', 'Linux', 'Python', 'penetration testing',
        'ethical hacking', 'SIEM', 'SOC', 'threat intelligence', 'vulnerability assessment',
        'incident response', 'firewall', 'IDS/IPS', 'Wireshark', 'Metasploit',
        'Nmap', 'Burp Suite', 'OWASP', 'risk assessment', 'compliance',
        'CISSP', 'CEH', 'CompTIA Security+', 'forensics', 'encryption', 'PKI',
    ],
    'Business Analyst': [
        'data analysis', 'Excel', 'SQL', 'Tableau', 'Power BI', 'project management',
        'communication', 'requirements gathering', 'stakeholder management',
        'process improvement', 'business intelligence', 'Agile', 'Scrum',
        'JIRA', 'Confluence', 'documentation', 'UML', 'use cases', 'wireframes',
        'KPI', 'metrics', 'reporting', 'data-driven decisions', 'MS Office', 'SAP',
    ],
    'UI/UX Designer': [
        'Figma', 'Adobe XD', 'UI/UX', 'Photoshop', 'Illustrator', 'CSS', 'HTML',
        'user research', 'wireframing', 'prototyping', 'usability testing',
        'interaction design', 'information architecture', 'design systems',
        'accessibility', 'user personas', 'journey mapping', 'Sketch',
        'InVision', 'Zeplin', 'typography', 'color theory', 'responsive design',
    ],
    'Full Stack Developer': [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL',
        'REST API', 'Git', 'Docker', 'MongoDB', 'PostgreSQL', 'TypeScript',
        'Express.js', 'Django', 'Flask', 'AWS', 'CI/CD', 'GraphQL',
        'microservices', 'authentication', 'JWT', 'Linux', 'Nginx', 'Redis',
    ],
    'Data Analyst': [
        'SQL', 'Excel', 'Python', 'data analysis', 'data visualization',
        'Tableau', 'Power BI', 'statistics', 'pandas', 'NumPy', 'R',
        'pivot tables', 'VLOOKUP', 'data cleaning', 'ETL', 'reporting',
        'dashboards', 'KPI tracking', 'business intelligence', 'Matplotlib',
        'Google Analytics', 'data storytelling', 'A/B testing', 'cohort analysis',
    ],
    'Cloud Architect': [
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'microservices',
        'Python', 'Linux', 'Terraform', 'infrastructure as code', 'serverless',
        'Lambda', 'S3', 'EC2', 'VPC', 'cloud security', 'cost optimization',
        'disaster recovery', 'high availability', 'load balancing', 'CDN',
        'DevOps', 'CI/CD', 'monitoring', 'cloud migration', 'multi-cloud',
    ],
}

# ??? Resume templates ????????????????????????????????????????????????????????

SUMMARY_TEMPLATES = [
    "Experienced {role} with {years} years of hands-on experience in {kw1} and {kw2}.",
    "Passionate {role} skilled in {kw1}, {kw2}, and {kw3} with a proven track record.",
    "Results-driven {role} with expertise in {kw1} and {kw2}, delivering high-quality solutions.",
    "Detail-oriented {role} with strong background in {kw1}, {kw2}, and {kw3}.",
    "Innovative {role} proficient in {kw1} and {kw2}, focused on scalable solutions.",
    "Dedicated {role} with {years}+ years experience working with {kw1} and {kw2}.",
    "Dynamic {role} specializing in {kw1}, {kw2}, and {kw3} for enterprise-level projects.",
]

EXPERIENCE_TEMPLATES = [
    "Developed and maintained {kw1} applications using {kw2} and {kw3}.",
    "Built scalable {kw1} solutions leveraging {kw2} and {kw3}.",
    "Designed and implemented {kw1} systems with {kw2} improving performance by 35%.",
    "Led a team of 5 engineers to deliver {kw1} projects using {kw2}.",
    "Optimized {kw1} pipelines reducing latency by 40% using {kw2} and {kw3}.",
    "Collaborated with cross-functional teams to deploy {kw1} using {kw2}.",
    "Automated {kw1} workflows with {kw2} saving 20 hours per week.",
    "Architected {kw1} infrastructure on {kw2} supporting 1M+ users.",
    "Implemented {kw1} best practices using {kw2} and {kw3}.",
    "Migrated legacy {kw1} systems to {kw2} reducing costs by 30%.",
]

EDUCATION_TEMPLATES = [
    "Bachelor of Science in Computer Science, {university}, {year}",
    "Master of Science in Data Science, {university}, {year}",
    "Bachelor of Engineering in Software Engineering, {university}, {year}",
    "Bachelor of Technology in Information Technology, {university}, {year}",
    "Master of Computer Applications (MCA), {university}, {year}",
]

UNIVERSITIES = [
    "MIT", "Stanford University", "Carnegie Mellon University", "UC Berkeley",
    "Georgia Tech", "University of Washington", "Purdue University",
    "University of Michigan", "Cornell University", "UT Austin",
    "FAST NUCES", "NUST", "LUMS", "IIT Delhi", "University of Toronto",
]


def _build_resume(category: str, keywords: List[str]) -> str:
    """Build a synthetic resume text for a given category."""
    kws = keywords.copy()
    random.shuffle(kws)

    role = category
    years = random.randint(1, 10)
    university = random.choice(UNIVERSITIES)
    grad_year = random.randint(2012, 2022)

    lines = []

    # Header
    first_names = ['Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Riley',
                   'Sam', 'Jamie', 'Chris', 'Dana', 'Ali', 'Sara', 'Omar', 'Mia']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson',
                  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Khan', 'Ahmed', 'Chen', 'Patel']
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    email = f"{name.lower().replace(' ', '.')}@email.com"
    phone = f"+1-{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}"
    lines.append(name)
    lines.append(f"Email: {email} | Phone: {phone}")
    lines.append(f"LinkedIn: linkedin.com/in/{name.lower().replace(' ', '-')}")
    lines.append(f"GitHub: github.com/{name.lower().replace(' ', '')}")
    lines.append('')

    # Summary
    summary_kws = kws[:3] if len(kws) >= 3 else kws
    summary = random.choice(SUMMARY_TEMPLATES).format(
        role=role,
        years=years,
        kw1=summary_kws[0] if len(summary_kws) > 0 else 'technology',
        kw2=summary_kws[1] if len(summary_kws) > 1 else 'systems',
        kw3=summary_kws[2] if len(summary_kws) > 2 else 'solutions',
    )
    lines.append('Summary')
    lines.append(summary)
    lines.append('')

    # Skills
    lines.append('Skills')
    skill_sample = kws[:random.randint(8, min(15, len(kws)))]
    lines.append(', '.join(skill_sample))
    lines.append('')

    # Experience
    lines.append('Experience')
    num_roles = random.randint(2, 4)
    companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
                 'Uber', 'Airbnb', 'Stripe', 'Shopify', 'IBM', 'Oracle', 'SAP',
                 'Accenture', 'Deloitte', 'Infosys', 'TCS', 'Wipro']

    for i in range(num_roles):
        start_year = grad_year + i * random.randint(1, 3)
        end_year = start_year + random.randint(1, 3)
        company = random.choice(companies)
        lines.append(f"{role} at {company} ({start_year} - {end_year})")

        num_bullets = random.randint(3, 5)
        for _ in range(num_bullets):
            exp_kws = random.sample(kws, min(3, len(kws)))
            bullet = random.choice(EXPERIENCE_TEMPLATES).format(
                kw1=exp_kws[0] if len(exp_kws) > 0 else 'software',
                kw2=exp_kws[1] if len(exp_kws) > 1 else 'tools',
                kw3=exp_kws[2] if len(exp_kws) > 2 else 'frameworks',
            )
            lines.append(f"- {bullet}")
        lines.append('')

    # Education
    lines.append('Education')
    lines.append(random.choice(EDUCATION_TEMPLATES).format(
        university=university, year=grad_year
    ))
    lines.append('')

    # Certifications (sometimes)
    if random.random() > 0.4:
        cert_map = {
            'Data Scientist': ['IBM Data Science Certificate', 'Google Data Analytics'],
            'DevOps Engineer': ['AWS Certified DevOps Engineer', 'CKA (Certified Kubernetes Administrator)'],
            'Cloud Architect': ['AWS Solutions Architect', 'Google Cloud Professional', 'Azure Solutions Architect'],
            'Cybersecurity Analyst': ['CompTIA Security+', 'CEH (Certified Ethical Hacker)', 'CISSP'],
            'Machine Learning Engineer': ['TensorFlow Developer Certificate', 'AWS ML Specialty'],
        }
        certs = cert_map.get(category, ['Agile Scrum Master', 'Project Management Professional (PMP)'])
        lines.append('Certifications')
        for cert in random.sample(certs, min(len(certs), random.randint(1, 2))):
            lines.append(f"- {cert}")
        lines.append('')

    # Projects (sometimes)
    if random.random() > 0.3:
        lines.append('Projects')
        proj_kws = random.sample(kws, min(3, len(kws)))
        lines.append(f"- {category} Portfolio Project: Built using {proj_kws[0]} and {proj_kws[1] if len(proj_kws) > 1 else 'modern tooling'}. Deployed on cloud infrastructure.")
        if random.random() > 0.5:
            lines.append(f"- Open Source Contribution: Contributed to {random.choice(kws)} library with 50+ GitHub stars.")
        lines.append('')

    return '\n'.join(lines)


def generate_synthetic_data(output_path: str, samples_per_category: int = 50) -> int:
    """
    Generate synthetic resume data and save to CSV.
    Returns total number of rows generated.
    """
    rows: List[Tuple[str, str]] = []

    for category, keywords in CATEGORY_KEYWORDS.items():
        for _ in range(samples_per_category):
            resume_text = _build_resume(category, keywords)
            # Collapse newlines to spaces for CSV storage
            resume_text_flat = ' '.join(resume_text.split())
            rows.append((category, resume_text_flat))

    # Shuffle rows
    random.shuffle(rows)

    # Write CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Category', 'Resume'])
        writer.writerows(rows)

    return len(rows)


if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, 'data', 'resumes.csv')
    total = generate_synthetic_data(output_path, samples_per_category=50)
    print(f"[OK] Generated {total} synthetic resume samples -> {output_path}")
