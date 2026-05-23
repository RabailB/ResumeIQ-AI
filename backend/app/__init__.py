import os
import nltk
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from app.config import Config

db = SQLAlchemy()
jwt = JWTManager()


def download_nltk_data():
    """Download required NLTK data packages silently."""
    # In NLTK 3.8+, punkt was replaced by punkt_tab
    # Always download both to ensure compatibility
    packages = ['stopwords', 'punkt', 'punkt_tab',
                'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng']
    for name in packages:
        try:
            nltk.download(name, quiet=True)
        except Exception:
            pass


def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.resume import resume_bp
    from app.routes.analysis import analysis_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(analysis_bp, url_prefix='/api/analyze')

    # Create database tables
    with app.app_context():
        # Import models so SQLAlchemy knows about them
        from app.models.user import User  # noqa: F401
        from app.models.resume import Resume  # noqa: F401
        db.create_all()

    # Download NLTK data
    download_nltk_data()

    return app
