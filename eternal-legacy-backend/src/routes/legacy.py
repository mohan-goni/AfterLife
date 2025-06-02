from flask import Blueprint, request, jsonify, current_app
import jwt
import os
from src.models.legacy import Legacy, TimelineEvent, MediaItem, Story, LegacyCollaborator
from src.models.user import User, db
from datetime import datetime

legacy_bp = Blueprint('legacy', __name__)

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')

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

# Legacy routes
@legacy_bp.route('/', methods=['GET'])
@token_required
def get_legacies(user):
    # Get user's legacies
    owned_legacies = Legacy.query.filter_by(user_id=user.id).all()
    
    # Get legacies where user is a collaborator
    collaborations = LegacyCollaborator.query.filter_by(user_id=user.id).all()
    collab_legacy_ids = [collab.legacy_id for collab in collaborations]
    collab_legacies = Legacy.query.filter(Legacy.id.in_(collab_legacy_ids)).all()
    
    # Combine and ensure uniqueness
    combined_legacies_dict = {leg.id: leg for leg in owned_legacies}
    for leg in collab_legacies:
        if leg.id not in combined_legacies_dict:
            combined_legacies_dict[leg.id] = leg
            
    unique_legacies = list(combined_legacies_dict.values())
    
    return jsonify({
        'legacies': [legacy.to_dict() for legacy in unique_legacies]
    }), 200

@legacy_bp.route('/', methods=['POST'])
@token_required
def create_legacy(user):
    data = request.get_json()
    
    # Validate required fields
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    # Create new legacy
    new_legacy = Legacy(
        title=data['title'],
        description=data.get('description'),
        birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data.get('birth_date') else None,
        death_date=datetime.strptime(data['death_date'], '%Y-%m-%d').date() if data.get('death_date') else None,
        cover_image=data.get('cover_image'),
        privacy_level=data.get('privacy_level', 'private'),
        user_id=user.id
    )
    
    db.session.add(new_legacy)
    db.session.commit()
    
    # Add owner as collaborator
    owner_collab = LegacyCollaborator(
        user_id=user.id,
        legacy_id=new_legacy.id,
        role='owner'
    )
    db.session.add(owner_collab)
    db.session.commit()
    
    return jsonify({
        'message': 'Legacy created successfully',
        'legacy': new_legacy.to_dict()
    }), 201

@legacy_bp.route('/<int:legacy_id>', methods=['GET'])
@token_required
def get_legacy(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user has access
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id
        ).first()
        
        if not collab and legacy.privacy_level != 'public':
            return jsonify({'error': 'Access denied'}), 403
    
    # Get timeline events
    timeline_events = [event.to_dict() for event in legacy.timeline_events]
    
    # Get media items
    media_items = [media.to_dict() for media in legacy.media_items]
    
    # Get stories
    stories = [story.to_dict() for story in legacy.stories]
    
    # Get collaborators
    collaborators = []
    for collab in legacy.collaborators:
        collab_user = User.query.get(collab.user_id)
        collaborators.append({
            'id': collab.id,
            'user_id': collab.user_id,
            'username': collab_user.username,
            'role': collab.role
        })
    
    # Combine and return
    legacy_data = legacy.to_dict()
    legacy_data['timeline_events'] = timeline_events
    legacy_data['media_items'] = media_items
    legacy_data['stories'] = stories
    legacy_data['collaborators'] = collaborators
    
    return jsonify({
        'legacy': legacy_data
    }), 200

@legacy_bp.route('/<int:legacy_id>', methods=['PUT'])
@token_required
def update_legacy(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user has permission
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id
        ).first()
        
        if not collab or collab.role not in ['owner', 'editor']:
            return jsonify({'error': 'Permission denied'}), 403
    
    # Update legacy data
    data = request.get_json()
    
    if 'title' in data:
        legacy.title = data['title']
    if 'description' in data:
        legacy.description = data['description']
    if 'birth_date' in data:
        legacy.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data['birth_date'] else None
    if 'death_date' in data:
        legacy.death_date = datetime.strptime(data['death_date'], '%Y-%m-%d').date() if data['death_date'] else None
    if 'cover_image' in data:
        legacy.cover_image = data['cover_image']
    if 'privacy_level' in data:
        legacy.privacy_level = data['privacy_level']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Legacy updated successfully',
        'legacy': legacy.to_dict()
    }), 200

@legacy_bp.route('/<int:legacy_id>', methods=['DELETE'])
@token_required
def delete_legacy(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user is owner
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id,
            role='owner'
        ).first()
        
        if not collab:
            return jsonify({'error': 'Permission denied'}), 403
    
    # Delete legacy
    db.session.delete(legacy)
    db.session.commit()
    
    return jsonify({
        'message': 'Legacy deleted successfully'
    }), 200

# Timeline event routes
@legacy_bp.route('/<int:legacy_id>/timeline', methods=['POST'])
@token_required
def create_timeline_event(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user has permission
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id
        ).first()
        
        if not collab or collab.role not in ['owner', 'editor', 'contributor']:
            return jsonify({'error': 'Permission denied'}), 403
    
    # Create new timeline event
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    new_event = TimelineEvent(
        title=data['title'],
        description=data.get('description'),
        event_date=datetime.strptime(data['event_date'], '%Y-%m-%d').date() if data.get('event_date') else None,
        location=data.get('location'),
        legacy_id=legacy_id
    )
    
    db.session.add(new_event)
    db.session.commit()
    
    return jsonify({
        'message': 'Timeline event created successfully',
        'event': new_event.to_dict()
    }), 201

# Media item routes
@legacy_bp.route('/<int:legacy_id>/media', methods=['POST'])
@token_required
def create_media_item(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user has permission
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id
        ).first()
        
        if not collab or collab.role not in ['owner', 'editor', 'contributor']:
            return jsonify({'error': 'Permission denied'}), 403
    
    # Create new media item
    data = request.get_json()
    
    if not data or 'media_type' not in data or 'file_path' not in data:
        return jsonify({'error': 'Media type and file path are required'}), 400
    
    new_media = MediaItem(
        title=data.get('title'),
        description=data.get('description'),
        media_type=data['media_type'],
        file_path=data['file_path'],
        thumbnail_path=data.get('thumbnail_path'),
        legacy_id=legacy_id,
        timeline_event_id=data.get('timeline_event_id'),
        story_id=data.get('story_id')
    )
    
    db.session.add(new_media)
    db.session.commit()
    
    return jsonify({
        'message': 'Media item created successfully',
        'media': new_media.to_dict()
    }), 201

# Story routes
@legacy_bp.route('/<int:legacy_id>/stories', methods=['POST'])
@token_required
def create_story(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user has permission
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id
        ).first()
        
        if not collab or collab.role not in ['owner', 'editor', 'contributor']:
            return jsonify({'error': 'Permission denied'}), 403
    
    # Create new story
    data = request.get_json()
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'error': 'Title and content are required'}), 400
    
    new_story = Story(
        title=data['title'],
        content=data['content'],
        author_id=user.id,
        legacy_id=legacy_id
    )
    
    db.session.add(new_story)
    db.session.commit()
    
    return jsonify({
        'message': 'Story created successfully',
        'story': new_story.to_dict()
    }), 201

# Collaborator routes
@legacy_bp.route('/<int:legacy_id>/collaborators', methods=['POST'])
@token_required
def add_collaborator(user, legacy_id):
    legacy = Legacy.query.get(legacy_id)
    
    if not legacy:
        return jsonify({'error': 'Legacy not found'}), 404
    
    # Check if user is owner
    if legacy.user_id != user.id:
        collab = LegacyCollaborator.query.filter_by(
            user_id=user.id, 
            legacy_id=legacy_id,
            role='owner'
        ).first()
        
        if not collab:
            return jsonify({'error': 'Permission denied'}), 403
    
    # Add new collaborator
    data = request.get_json()
    
    if not data or 'email' not in data or 'role' not in data: # Expect 'email' instead of 'user_id'
        return jsonify({'error': 'Email and role are required'}), 400
    
    # Find user by email
    collab_user = User.query.filter_by(email=data['email']).first()
    if not collab_user:
        return jsonify({'error': f"User with email '{data['email']}' not found"}), 404
    
    # Check if already a collaborator
    existing_collab = LegacyCollaborator.query.filter_by(
        user_id=collab_user.id, # Use the found user's ID
        legacy_id=legacy_id
    ).first()
    
    if existing_collab:
        # Option 1: Update role if user is already a collaborator
        # existing_collab.role = data['role']
        # db.session.commit()
        # return jsonify({
        #     'message': 'Collaborator role updated successfully',
        #     'collaborator': existing_collab.to_dict()
        # }), 200
        # Option 2: Inform that user is already a collaborator
        return jsonify({'message': f"User '{collab_user.username}' is already a collaborator on this legacy."}), 200 # Or 409 Conflict

    # Create new collaborator
    new_collab = LegacyCollaborator(
        user_id=collab_user.id, # Use the found user's ID
        legacy_id=legacy_id,
        role=data['role']
    )
    
    db.session.add(new_collab)
    db.session.commit()
    
    return jsonify({
        'message': 'Collaborator added successfully',
        'collaborator': new_collab.to_dict()
    }), 201
