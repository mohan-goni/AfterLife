import os
import requests # For making internal HTTP requests
from flask import Blueprint, request, jsonify, current_app
import logging
from werkzeug.utils import secure_filename # For handling filenames if needed

# Assuming a token_required decorator similar to other route files for JWT
# If not available centrally, it would need to be defined or imported
# For now, let's assume a placeholder or we'll add one if not found in AuthContext or similar.
# For this exercise, we'll use a simplified version of token_required.
# In a real app, this should be robust and likely imported from auth routes or a shared utility.

import jwt # PyJWT for decoding token (simplified for this example)
from src.models.user import User, db # To get user if needed

logger = logging.getLogger(__name__)

avatar_bp = Blueprint('avatar', __name__)

# Simplified token_required decorator for demonstration
# In a real app, use the one from your auth module or a shared utility
def token_required_simplified(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Bearer token malformed'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # SECRET_KEY should be from app config for consistency
            secret_key = current_app.config.get('SECRET_KEY') if current_app else os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            current_user = User.query.get(payload['user_id'])
            if not current_user:
                 return jsonify({'error': 'User not found after token decode'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            logger.error(f"Token validation error: {e}")
            return jsonify({'error': 'Token validation failed'}), 401
            
        return f(current_user, *args, **kwargs)
    decorated.__name__ = f.__name__ # Preserve original function name for Flask
    return decorated

INTERNAL_SERVICES_BASE_URL = "http://127.0.0.1:5000/api/services" # Assuming backend runs on port 5000

@avatar_bp.route('/generate', methods=['POST'])
@token_required_simplified
def generate_avatar_wrapper(current_user):
    """
    Wrapper endpoint to generate a 3D avatar.
    It proxies the request to the internal /api/services/avatar/generate endpoint.
    """
    try:
        # Forward files and form data
        files = {}
        if 'image' in request.files:
            image_file = request.files['image']
            files['image'] = (secure_filename(image_file.filename), image_file.stream, image_file.mimetype)
        
        # Forward headers, including Authorization for the internal service if needed,
        # though our /api/services proxy doesn't currently require auth itself, it's good practice
        # if it were to evolve. For now, we'll just pass the original Authorization.
        headers = {key: value for (key, value) in request.headers if key != 'Host'}
        
        # Make the internal request
        internal_url = f"{INTERNAL_SERVICES_BASE_URL}/avatar/generate"
        logger.info(f"Forwarding avatar generation request for user {current_user.id} to {internal_url}")
        
        resp = requests.post(internal_url, files=files, data=request.form, headers=headers, timeout=60)
        
        # Return the response from the internal service
        return jsonify(resp.json()), resp.status_code
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Internal request to avatar generation service failed: {e}")
        return jsonify({'error': 'Failed to connect to internal avatar service', 'details': str(e)}), 502
    except Exception as e:
        logger.error(f"Error in generate_avatar_wrapper: {e}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@avatar_bp.route('/voice', methods=['POST'])
@token_required_simplified
def clone_voice_wrapper(current_user):
    """
    Wrapper endpoint to clone a voice.
    It proxies the request to the internal /api/services/voice/clone endpoint.
    """
    try:
        files = {}
        if 'audio' in request.files:
            audio_file = request.files['audio']
            files['audio'] = (secure_filename(audio_file.filename), audio_file.stream, audio_file.mimetype)
        else:
            return jsonify({'error': 'Audio file is required'}), 400

        headers = {key: value for (key, value) in request.headers if key != 'Host'}

        internal_url = f"{INTERNAL_SERVICES_BASE_URL}/voice/clone"
        logger.info(f"Forwarding voice cloning request for user {current_user.id} to {internal_url}")

        resp = requests.post(internal_url, files=files, data=request.form, headers=headers, timeout=60)
        return jsonify(resp.json()), resp.status_code

    except requests.exceptions.RequestException as e:
        logger.error(f"Internal request to voice cloning service failed: {e}")
        return jsonify({'error': 'Failed to connect to internal voice cloning service', 'details': str(e)}), 502
    except Exception as e:
        logger.error(f"Error in clone_voice_wrapper: {e}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@avatar_bp.route('/speech', methods=['POST'])
@token_required_simplified
def generate_speech_wrapper(current_user):
    """
    Wrapper endpoint to generate speech from text.
    It proxies the request to the internal /api/services/voice/speak endpoint.
    """
    try:
        data = request.get_json()
        if not data or 'text' not in data or 'voiceId' not in data:
            return jsonify({'error': 'Missing text or voiceId in JSON payload'}), 400

        headers = {key: value for (key, value) in request.headers if key != 'Host'}
        # Ensure Content-Type is application/json for the internal request
        headers['Content-Type'] = 'application/json'


        internal_url = f"{INTERNAL_SERVICES_BASE_URL}/voice/speak"
        logger.info(f"Forwarding speech generation request for user {current_user.id} to {internal_url}")
        
        resp = requests.post(internal_url, json=data, headers=headers, timeout=60)
        
        # If the internal service returns audio directly, handle appropriately.
        # For now, assuming it also returns JSON like other proxy endpoints.
        return jsonify(resp.json()), resp.status_code

    except requests.exceptions.RequestException as e:
        logger.error(f"Internal request to speech generation service failed: {e}")
        return jsonify({'error': 'Failed to connect to internal speech generation service', 'details': str(e)}), 502
    except Exception as e:
        logger.error(f"Error in generate_speech_wrapper: {e}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
