from flask import Blueprint, request, jsonify
import jwt
import datetime
import os
from src.models.user import User, db

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        
        # Get user from database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        
        # Get user from database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update user data
        data = request.get_json()
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'profile_image' in data:
            user.profile_image = data['profile_image']
        
        # Update password if provided
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@auth_bp.route('/legacy-contact', methods=['POST'])
def set_legacy_contact():
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        
        # Get user from database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get legacy contact data
        data = request.get_json()
        if not data or 'contact_id' not in data:
            return jsonify({'error': 'Missing legacy contact ID'}), 400
        
        # Verify contact exists
        contact = User.query.get(data['contact_id'])
        if not contact:
            return jsonify({'error': 'Legacy contact user not found'}), 404
        
        # Set legacy contact
        user.legacy_contact_id = contact.id
        db.session.commit()
        
        return jsonify({
            'message': 'Legacy contact set successfully',
            'user': user.to_dict()
        }), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
