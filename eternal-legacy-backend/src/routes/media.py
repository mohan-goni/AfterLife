from flask import Blueprint, request, jsonify
import os
import uuid
from werkzeug.utils import secure_filename
from src.models.user import User, db
import jwt

media_bp = Blueprint('media', __name__)

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mp3', 'pdf', 'doc', 'docx'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Authentication middleware
def token_required(f):
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return f(user, *args, **kwargs)
        
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    
    decorated.__name__ = f.__name__
    return decorated

@media_bp.route('/upload', methods=['POST'])
@token_required
def upload_file(user):
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Generate a secure filename with UUID to prevent collisions
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Create user folder if it doesn't exist
        user_folder = os.path.join(UPLOAD_FOLDER, str(user.id))
        os.makedirs(user_folder, exist_ok=True)
        
        file_path = os.path.join(user_folder, unique_filename)
        file.save(file_path)
        
        # Generate public URL for the file
        relative_path = os.path.join('uploads', str(user.id), unique_filename)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_path': relative_path,
            'file_type': file.content_type
        }), 201
    
    return jsonify({'error': 'File type not allowed'}), 400

@media_bp.route('/files', methods=['GET'])
@token_required
def get_user_files(user):
    user_folder = os.path.join(UPLOAD_FOLDER, str(user.id))
    
    # Check if user folder exists
    if not os.path.exists(user_folder):
        return jsonify({'files': []}), 200
    
    # Get all files in user folder
    files = []
    for filename in os.listdir(user_folder):
        file_path = os.path.join('uploads', str(user.id), filename)
        file_type = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'unknown'
        
        files.append({
            'filename': filename,
            'file_path': file_path,
            'file_type': file_type
        })
    
    return jsonify({'files': files}), 200

@media_bp.route('/files/<path:filename>', methods=['DELETE'])
@token_required
def delete_file(user, filename):
    # Ensure filename is within user's folder
    if not filename.startswith(f"uploads/{user.id}/"):
        return jsonify({'error': 'Access denied'}), 403
    
    # Get actual file path
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', filename)
    
    # Check if file exists
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    
    # Delete file
    os.remove(file_path)
    
    return jsonify({'message': 'File deleted successfully'}), 200
