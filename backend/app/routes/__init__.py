# routes package
from app.routes.auth import auth_bp
from app.routes.resume import resume_bp
from app.routes.analysis import analysis_bp

__all__ = ['auth_bp', 'resume_bp', 'analysis_bp']
