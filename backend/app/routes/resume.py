import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.resume import Resume

resume_bp = Blueprint('resume', __name__)


def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed."""
    allowed = current_app.config.get('ALLOWED_EXTENSIONS', {'pdf', 'docx'})
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload a resume file."""
    try:
        user_id = int(get_jwt_identity())

        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '' or file.filename is None:
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF and DOCX files are allowed'}), 400

        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        stored_filename = f"{uuid.uuid4().hex}.{ext}"
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, stored_filename)

        # Save file
        file.save(filepath)

        # Create DB record
        resume = Resume(
            user_id=user_id,
            original_filename=file.filename,
            stored_filename=stored_filename,
            status='pending'
        )
        db.session.add(resume)
        db.session.commit()

        return jsonify({
            'id': resume.id,
            'filename': resume.original_filename,
            'message': 'Resume uploaded successfully. Use /api/analyze/<id> to analyze it.'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500


@resume_bp.route('/list', methods=['GET'])
@jwt_required()
def list_resumes():
    """List all resumes for the current user."""
    try:
        user_id = int(get_jwt_identity())
        resumes = Resume.query.filter_by(user_id=user_id).order_by(Resume.upload_date.desc()).all()
        return jsonify([r.to_list_dict() for r in resumes]), 200

    except Exception as e:
        return jsonify({'error': f'Failed to list resumes: {str(e)}'}), 500


@resume_bp.route('/<int:resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id: int):
    """Get a single resume with full analysis."""
    try:
        user_id = int(get_jwt_identity())
        resume = Resume.query.get(resume_id)

        if not resume:
            return jsonify({'error': 'Resume not found'}), 404

        if resume.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        return jsonify(resume.to_dict()), 200

    except Exception as e:
        return jsonify({'error': f'Failed to get resume: {str(e)}'}), 500


@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id: int):
    """Delete a resume file and DB record."""
    try:
        user_id = int(get_jwt_identity())
        resume = Resume.query.get(resume_id)

        if not resume:
            return jsonify({'error': 'Resume not found'}), 404

        if resume.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        # Delete physical file
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, resume.stored_filename)
        if os.path.exists(filepath):
            os.remove(filepath)

        # Delete DB record
        db.session.delete(resume)
        db.session.commit()

        return jsonify({'message': 'Resume deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Delete failed: {str(e)}'}), 500
