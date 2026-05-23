import os


class Config:
    SECRET_KEY = 'resumeiq-secret-key-2024'
    JWT_SECRET_KEY = 'resumeiq-jwt-secret-2024'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///resumeiq.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}
    JWT_ACCESS_TOKEN_EXPIRES = False
