import pytest
import os
import tempfile

import pytest # Keep pytest at the top
import os
import tempfile
# sys module is no longer explicitly used for path manipulation here, can be removed if not used by other fixtures later
# import sys 

# Pytest should handle path discovery.
# The 'src' directory (containing main.py and models/) should be discoverable if tests are run correctly.
# For example, if running pytest from 'eternal-legacy-backend/', it will typically add 'eternal-legacy-backend/src/' to sys.path.

from src.main import create_app # Import the create_app factory
from src.models.user import db as _db # Import the db instance
from src.models.user import User 
from src.models.legacy import Legacy # Corrected import

@pytest.fixture(scope='session')
def app():
    """Session-wide test Flask application created by the app factory."""
    
    # Use a temporary SQLite database for testing for each session
    db_fd, db_path = tempfile.mkstemp(suffix='.sqlite')
    test_db_uri = f"sqlite:///{db_path}"

    # Create an app instance with 'testing' config, then override DB URI
    _app = create_app(config_name='testing') 
    _app.config.update({
        "SQLALCHEMY_DATABASE_URI": test_db_uri,
        # Other test-specific overrides can also go here if needed,
        # though create_app('testing') should handle most.
        "SECRET_KEY": "test-secret-key", # Consistent test key
        "JWT_SECRET_KEY": "test-jwt-secret-key" # Consistent test JWT key
    })

    with _app.app_context():
        _db.create_all() # Create database tables using the test URI

    yield _app # Provide the app instance for tests

    # Teardown: close and remove the temporary database file
    with _app.app_context():
        _db.session.remove()
        _db.drop_all() # Drop all tables
    
    os.close(db_fd)
    os.unlink(db_path) # Delete the temporary database file


@pytest.fixture(scope='function')
def db(app): # 'app' here is the _app created by the factory with test config
    """Function-scoped database fixture to ensure clean state for each test."""
    with app.app_context():
        yield _db # provide the db object (SQLAlchemy extension instance) to tests
        
        # Clean up database session and all data after each test
        # This ensures each test function starts with a clean slate.
        _db.session.remove()
        for table in reversed(_db.metadata.tables.values()): # Correct way to get tables
            _db.session.execute(table.delete())
        _db.session.commit()


@pytest.fixture # client fixture depends on app, so app's scope will apply
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()

# Fixture to create a test user and commit to db
@pytest.fixture
def new_user(db):
    user = User(username='testuser', email='test@example.com', password='password123')
    db.session.add(user)
    db.session.commit()
    return user

# Fixture to get an auth token for a test user
@pytest.fixture
def auth_token(client, new_user):
    # Log in the user to get a token
    response = client.post('/auth/login', json={
        'email': new_user.email,
        'password': 'password123' # Use the same password as defined in new_user
    })
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'token' in json_data
    return json_data['token']
