import json
import os
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.resume import Resume
from app.services.parser import parse_resume
from app.services.nlp_processor import extract_skills, get_text_features
from app.services.ats_scorer import calculate_ats_score
from app.services.job_recommender import recommend_jobs
from app.services.suggester import generate_suggestions

analysis_bp = Blueprint('analysis', __name__)


@analysis_bp.route('/<int:resume_id>', methods=['POST'])
@jwt_required()
def analyze_resume(resume_id: int):
    """Run full NLP analysis on a resume and return results."""
    try:
        user_id = int(get_jwt_identity())
        resume = Resume.query.get(resume_id)

        if not resume:
            return jsonify({'error': 'Resume not found'}), 404

        if resume.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403

        # Build filepath
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, resume.stored_filename)

        if not os.path.exists(filepath):
            resume.status = 'failed'
            db.session.commit()
            return jsonify({'error': 'Resume file not found on disk'}), 404

        # --- Step 1: Parse resume ---
        try:
            parsed = parse_resume(filepath)
        except Exception as parse_err:
            resume.status = 'failed'
            db.session.commit()
            return jsonify({'error': f'Failed to parse resume: {str(parse_err)}'}), 422

        raw_text = parsed.get('raw_text', '')
        sections = parsed.get('sections', {})

        if not raw_text.strip():
            resume.status = 'failed'
            db.session.commit()
            return jsonify({'error': 'Could not extract text from resume. Ensure the file is not scanned/image-based.'}), 422

        # --- Step 2: Extract skills ---
        skills = extract_skills(raw_text)

        # --- Step 3: ATS scoring ---
        ats_result = calculate_ats_score(raw_text, skills, sections)
        total_score = ats_result.get('total_score', 0)
        breakdown = ats_result.get('breakdown', {})
        grade = ats_result.get('grade', 'Poor')

        # --- Step 4: Job recommendations ---
        job_recs = recommend_jobs(raw_text, skills)
        top_role = job_recs[0]['role'] if job_recs else 'General'

        # --- Step 5: Generate suggestions ---
        suggestions = generate_suggestions(raw_text, skills, sections, breakdown)

        # --- Step 6: Build full result ---
        full_ats_result = {
            'total_score': total_score,
            'grade': grade,
            'breakdown': breakdown,
        }

        # --- Step 7: Persist to DB ---
        resume.raw_text = raw_text
        resume.ats_score = total_score
        resume.job_role = top_role
        resume.skills_json = json.dumps(skills)
        resume.suggestions_json = json.dumps(suggestions)
        resume.job_recommendations_json = json.dumps(job_recs)
        resume.status = 'analyzed'
        db.session.commit()

        # --- Step 8: Return full response ---
        return jsonify({
            'id': resume.id,
            'filename': resume.original_filename,
            'upload_date': resume.upload_date.isoformat() if resume.upload_date else None,
            'status': resume.status,
            'ats_score': total_score,
            'ats_grade': grade,
            'ats_breakdown': breakdown,
            'job_role': top_role,
            'skills': skills,
            'suggestions': suggestions,
            'job_recommendations': job_recs,
            'raw_text_preview': raw_text[:500] if raw_text else None,
            'text_features': get_text_features(raw_text),
            'sections_detected': list(sections.keys()),
        }), 200

    except Exception as e:
        try:
            resume = Resume.query.get(resume_id)
            if resume:
                resume.status = 'failed'
                db.session.commit()
        except Exception:
            pass
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500
