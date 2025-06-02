import pytest
import json
from src.models.user import User # For querying the User model

def test_register_success(client, db):
    """Test successful user registration."""
    response = client.post('/auth/register', json={
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'password123',
        'first_name': 'New',
        'last_name': 'User'
    })
    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['message'] == 'User registered successfully'
    assert 'token' in json_data
    assert json_data['user']['username'] == 'newuser'
    assert json_data['user']['email'] == 'newuser@example.com'

    # Verify user is in the database
    user = User.query.filter_by(email='newuser@example.com').first()
    assert user is not None
    assert user.username == 'newuser'

def test_register_duplicate_username(client, db, new_user):
    """Test registration with a duplicate username."""
    response = client.post('/auth/register', json={
        'username': new_user.username, # Using existing username from new_user fixture
        'email': 'another@example.com',
        'password': 'password123'
    })
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['error'] == 'Username already exists'

def test_register_duplicate_email(client, db, new_user):
    """Test registration with a duplicate email."""
    response = client.post('/auth/register', json={
        'username': 'anotheruser',
        'email': new_user.email, # Using existing email from new_user fixture
        'password': 'password123'
    })
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['error'] == 'Email already exists'

def test_register_missing_fields(client, db):
    """Test registration with missing required fields."""
    response = client.post('/auth/register', json={
        'username': 'missingfielduser'
        # Missing email and password
    })
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'Missing required field' in json_data['error']

def test_login_success(client, db, new_user):
    """Test successful user login."""
    # new_user fixture already created a user: testuser, test@example.com, password123
    response = client.post('/auth/login', json={
        'email': new_user.email,
        'password': 'password123' 
    })
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['message'] == 'Login successful'
    assert 'token' in json_data
    assert json_data['user']['email'] == new_user.email

def test_login_invalid_email(client, db):
    """Test login with a non-existent email."""
    response = client.post('/auth/login', json={
        'email': 'wrong@example.com',
        'password': 'password123'
    })
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data['error'] == 'Invalid email or password'

def test_login_wrong_password(client, db, new_user):
    """Test login with an incorrect password."""
    response = client.post('/auth/login', json={
        'email': new_user.email,
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data['error'] == 'Invalid email or password'

def test_login_missing_fields(client, db):
    """Test login with missing fields."""
    response = client.post('/auth/login', json={
        'email': 'test@example.com'
        # Missing password
    })
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data['error'] == 'Missing email or password'

def test_get_profile_success(client, auth_token):
    """Test successfully getting user profile with a valid token."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    response = client.get('/auth/profile', headers=headers)
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'user' in json_data
    assert json_data['user']['email'] == 'test@example.com' # From new_user via auth_token

def test_get_profile_no_token(client):
    """Test getting profile without a token."""
    response = client.get('/auth/profile')
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data['error'] == 'Missing or invalid token'

def test_get_profile_invalid_token(client):
    """Test getting profile with an invalid token."""
    headers = {
        'Authorization': 'Bearer invalidtoken123'
    }
    response = client.get('/auth/profile', headers=headers)
    assert response.status_code == 401 
    json_data = response.get_json()
    assert json_data['error'] == 'Invalid token' # Corrected message

def test_update_profile_success(client, db, auth_token, new_user):
    """Test successfully updating user profile."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    updated_data = {
        'first_name': 'UpdatedFirst',
        'last_name': 'UpdatedLast'
    }
    response = client.put('/auth/profile', json=updated_data, headers=headers)
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['message'] == 'Profile updated successfully'
    assert json_data['user']['first_name'] == 'UpdatedFirst'
    assert json_data['user']['last_name'] == 'UpdatedLast'

    # Verify in DB
    db.session.refresh(new_user) # Refresh object from session
    assert new_user.first_name == 'UpdatedFirst'

def test_update_profile_change_password(client, db, auth_token, new_user):
    """Test updating user profile including password."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    updated_data = {
        'first_name': 'PasswordChanger',
        'password': 'newpassword123'
    }
    response = client.put('/auth/profile', json=updated_data, headers=headers)
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['user']['first_name'] == 'PasswordChanger'

    # Verify password change by trying to log in with the new password
    logout_response = client.post('/auth/login', json={'email': new_user.email, 'password': 'newpassword123'})
    assert logout_response.status_code == 200, "Login with new password failed"

    # Verify old password no longer works
    old_password_response = client.post('/auth/login', json={'email': new_user.email, 'password': 'password123'})
    assert old_password_response.status_code == 401, "Old password still works"
