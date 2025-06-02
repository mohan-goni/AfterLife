from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Legacy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    death_date = db.Column(db.Date, nullable=True)
    cover_image = db.Column(db.String(255), nullable=True)
    privacy_level = db.Column(db.String(20), default='private')  # private, shared, public
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    timeline_events = db.relationship('TimelineEvent', backref='legacy', lazy=True, cascade='all, delete-orphan')
    media_items = db.relationship('MediaItem', backref='legacy', lazy=True, cascade='all, delete-orphan')
    stories = db.relationship('Story', backref='legacy', lazy=True, cascade='all, delete-orphan')
    collaborators = db.relationship('LegacyCollaborator', backref='legacy', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Legacy {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'death_date': self.death_date.isoformat() if self.death_date else None,
            'cover_image': self.cover_image,
            'privacy_level': self.privacy_level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user_id': self.user_id
        }

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    event_date = db.Column(db.Date, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    legacy_id = db.Column(db.Integer, db.ForeignKey('legacy.id'), nullable=False)
    
    # Relationships
    media_items = db.relationship('MediaItem', backref='timeline_event', lazy=True)
    
    def __repr__(self):
        return f'<TimelineEvent {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'legacy_id': self.legacy_id
        }

class MediaItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    media_type = db.Column(db.String(20), nullable=False)  # image, video, audio, document
    file_path = db.Column(db.String(255), nullable=False)
    thumbnail_path = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    legacy_id = db.Column(db.Integer, db.ForeignKey('legacy.id'), nullable=False)
    timeline_event_id = db.Column(db.Integer, db.ForeignKey('timeline_event.id'), nullable=True)
    story_id = db.Column(db.Integer, db.ForeignKey('story.id'), nullable=True)
    
    def __repr__(self):
        return f'<MediaItem {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'media_type': self.media_type,
            'file_path': self.file_path,
            'thumbnail_path': self.thumbnail_path,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'legacy_id': self.legacy_id,
            'timeline_event_id': self.timeline_event_id,
            'story_id': self.story_id
        }

class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    legacy_id = db.Column(db.Integer, db.ForeignKey('legacy.id'), nullable=False)
    
    # Relationships
    media_items = db.relationship('MediaItem', backref='story', lazy=True)
    
    def __repr__(self):
        return f'<Story {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'author_id': self.author_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'legacy_id': self.legacy_id
        }

class LegacyCollaborator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    legacy_id = db.Column(db.Integer, db.ForeignKey('legacy.id'), nullable=False)
    role = db.Column(db.String(20), default='contributor')  # owner, editor, contributor, viewer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='collaborations')
    
    def __repr__(self):
        return f'<LegacyCollaborator {self.user_id} - {self.legacy_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'legacy_id': self.legacy_id,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
