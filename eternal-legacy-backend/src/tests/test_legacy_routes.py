import pytest
import json
from src.models.legacy import Legacy # For querying the Legacy model
from src.models.user import User # For new_user fixture typing if needed

def test_create_legacy_success(client, db, auth_token, new_user):
    """Test successful legacy creation with a valid token."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    legacy_data = {
        'title': 'My First Legacy',
        'description': 'A collection of precious memories.',
        'birth_date': '1980-01-01',
        'death_date': '2050-01-01',
        'privacy_level': 'private'
    }
    response = client.post('/api/legacies/', json=legacy_data, headers=headers)
    
    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['message'] == 'Legacy created successfully'
    assert 'legacy' in json_data
    assert json_data['legacy']['title'] == 'My First Legacy'
    assert json_data['legacy']['user_id'] == new_user.id

    # Verify legacy is in the database
    legacy = Legacy.query.filter_by(title='My First Legacy').first()
    assert legacy is not None
    assert legacy.user_id == new_user.id
    assert legacy.description == 'A collection of precious memories.'
    # Check if owner is automatically added as a collaborator
    assert len(legacy.collaborators) == 1
    assert legacy.collaborators[0].user_id == new_user.id
    assert legacy.collaborators[0].role == 'owner'


def test_create_legacy_no_token(client, db):
    """Test legacy creation attempt without an authentication token."""
    legacy_data = {
        'title': 'Unauthorized Legacy',
        'description': 'This should not be created.'
    }
    response = client.post('/api/legacies/', json=legacy_data) # No headers
    
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data['error'] == 'Missing or invalid token'

def test_create_legacy_invalid_token(client, db):
    """Test legacy creation attempt with an invalid token."""
    headers = {
        'Authorization': 'Bearer invalidtoken123'
    }
    legacy_data = {
        'title': 'Forbidden Legacy',
        'description': 'This should also not be created.'
    }
    response = client.post('/api/legacies/', json=legacy_data, headers=headers)
    
    assert response.status_code == 401 
    json_data = response.get_json()
    assert json_data['error'] == 'Invalid token' # Corrected message

def test_create_legacy_missing_title(client, db, auth_token):
    """Test legacy creation with missing required title field."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    legacy_data = {
        'description': 'A legacy without a title.'
        # Title is missing
    }
    response = client.post('/api/legacies/', json=legacy_data, headers=headers)
    
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['error'] == 'Title is required'

def test_get_legacies_success(client, db, auth_token, new_user):
    """Test getting a list of legacies for the authenticated user."""
    # First, create a legacy for the user
    headers = {'Authorization': f'Bearer {auth_token}'}
    client.post('/api/legacies/', json={'title': 'Legacy One'}, headers=headers)
    client.post('/api/legacies/', json={'title': 'Legacy Two'}, headers=headers)

    response = client.get('/api/legacies/', headers=headers)
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'legacies' in json_data
    assert len(json_data['legacies']) == 2
    assert json_data['legacies'][0]['title'] == 'Legacy One'
    assert json_data['legacies'][1]['title'] == 'Legacy Two'
    assert json_data['legacies'][0]['user_id'] == new_user.id

def test_get_specific_legacy_success(client, db, auth_token, new_user):
    """Test getting a specific legacy by its ID."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    # Create a legacy
    create_response = client.post('/api/legacies/', json={'title': 'Specific Legacy'}, headers=headers)
    legacy_id = create_response.get_json()['legacy']['id']

    response = client.get(f'/api/legacies/{legacy_id}', headers=headers)
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'legacy' in json_data
    assert json_data['legacy']['id'] == legacy_id
    assert json_data['legacy']['title'] == 'Specific Legacy'
    assert json_data['legacy']['user_id'] == new_user.id
    assert 'timeline_events' in json_data['legacy'] # Check for other expected fields
    assert 'media_items' in json_data['legacy']
    assert 'stories' in json_data['legacy']
    assert 'collaborators' in json_data['legacy']
    # Check if owner is listed as a collaborator
    assert any(c['user_id'] == new_user.id and c['role'] == 'owner' for c in json_data['legacy']['collaborators'])


def test_get_specific_legacy_not_found(client, auth_token):
    """Test getting a non-existent legacy."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.get('/api/legacies/99999', headers=headers) # Assuming 99999 does not exist
    assert response.status_code == 404
    json_data = response.get_json()
    assert json_data['error'] == 'Legacy not found'

# Add more tests for update, delete, adding timeline events, media, stories, collaborators etc.
# For example:
# def test_update_legacy_success(client, db, auth_token, new_user): ...
# def test_delete_legacy_success(client, db, auth_token, new_user): ...
# def test_add_collaborator_to_legacy(client, db, auth_token, new_user, another_user_fixture): ...
# def test_get_legacy_access_denied_for_non_collaborator(client, db, auth_token_for_another_user, legacy_id_of_private_legacy): ...
