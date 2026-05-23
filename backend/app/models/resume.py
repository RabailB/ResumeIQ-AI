from app import db
import json
from datetime import datetime


class Resume(db.Model):
    """Resume model for storing uploaded resumes and analysis results."""
    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    original_filename = db.Column(db.String(300), nullable=False)
    stored_filename = db.Column(db.String(300), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # pending | analyzed | failed
    ats_score = db.Column(db.Float, nullable=True)
    job_role = db.Column(db.String(150), nullable=True)
    raw_text = db.Column(db.Text, nullable=True)
    skills_json = db.Column(db.Text, nullable=True)           # JSON string list
    suggestions_json = db.Column(db.Text, nullable=True)      # JSON string list
    job_recommendations_json = db.Column(db.Text, nullable=True)  # JSON string list

    def _parse_json(self, field: str):
        """Safely parse a JSON string field."""
        try:
            return json.loads(field) if field else []
        except (json.JSONDecodeError, TypeError):
            return []

    def to_dict(self) -> dict:
        """Full serialization including analysis results."""
        return {
            'id': self.id,
            'filename': self.original_filename,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'status': self.status,
            'ats_score': self.ats_score,
            'job_role': self.job_role,
            'skills': self._parse_json(self.skills_json),
            'suggestions': self._parse_json(self.suggestions_json),
            'job_recommendations': self._parse_json(self.job_recommendations_json),
            'raw_text_preview': (self.raw_text[:500] if self.raw_text else None),
        }

    def to_list_dict(self) -> dict:
        """Minimal serialization for list views."""
        return {
            'id': self.id,
            'filename': self.original_filename,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'status': self.status,
            'ats_score': self.ats_score,
            'job_role': self.job_role,
        }

    def __repr__(self):
        return f'<Resume {self.original_filename}>'
