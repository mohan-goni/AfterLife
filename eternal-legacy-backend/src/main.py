import sys
import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate

# Assuming db is defined in models.user or a shared models file
# Adjust this import based on your actual db object location
from src.models.user import db # If db is in user.py
# from src.models import db # If db is in models/__init__.py

# Import Blueprints
from src.routes.auth import auth_bp
from src.routes.legacy import legacy_bp
from src.routes.media import media_bp
from src.routes.external_services import external_services_bp
from src.routes.avatar import avatar_bp

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    # Ensure src is in path for model imports etc.
    # This might be redundant if run as a module but good for clarity
    sys.path.insert(0, os.path.dirname(__file__))


    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

    # Load essential configurations from environment variables
    # Forcing these to be set for security reasons, especially in non-testing environments
    flask_secret_key = os.environ.get('SECRET_KEY')
    jwt_secret_key = os.environ.get('JWT_SECRET_KEY')

    if config_name != 'testing': # In testing, keys might be overridden by test config
        if not flask_secret_key:
            raise ValueError("SECRET_KEY is not set in environment variables. Please set a strong, unique key.")
        if not jwt_secret_key:
            raise ValueError("JWT_SECRET_KEY is not set in environment variables. Please set a strong, unique key.")

    app.config['SECRET_KEY'] = flask_secret_key or 'test-flask-secret-for-testing-only' # Fallback for testing if not set by test_config
    app.config['JWT_SECRET_KEY'] = jwt_secret_key or 'test-jwt-secret-for-testing-only' # Fallback for testing
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # Set a maximum content length for file uploads (e.g., 16MB)
    # This is a Flask setting that will reject requests larger than this before they hit the route.
    app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_UPLOAD_MB', '16')) * 1024 * 1024


    if config_name == 'testing':
        app.config['TESTING'] = True
        # In conftest, this will be overridden by a temporary SQLite file URI
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('TEST_DATABASE_URI', 'sqlite:///:memory:') 
        app.config['WTF_CSRF_ENABLED'] = False # Useful for tests if you use Flask-WTF
    else:
        # Production/Development configuration
        app.config['SQLALCHEMY_DATABASE_URI'] = \
            f"postgresql+psycopg2://{os.getenv('DB_USERNAME', 'postgres')}:" \
            f"{os.getenv('DB_PASSWORD', 'password')}@" \
            f"{os.getenv('DB_HOST', '127.0.0.1')}:" \
            f"{os.getenv('DB_PORT', '5432')}/" \
            f"{os.getenv('DB_NAME', 'Eternal_legacy')}"
        # Print URI only when not testing for cleaner test output
        print(f"DEBUG: SQLALCHEMY_DATABASE_URI: {app.config['SQLALCHEMY_DATABASE_URI']}")


    # Initialize extensions
    CORS(app)  # Enable CORS for all routes
    db.init_app(app)
    Migrate(app, db) # Initialize Flask-Migrate

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(legacy_bp, url_prefix='/api/legacies')
    app.register_blueprint(media_bp, url_prefix='/api/media')
    app.register_blueprint(external_services_bp, url_prefix='/api/services')
    app.register_blueprint(avatar_bp, url_prefix='/api/avatar')

    # Static file serving (no change needed here for app factory)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return "index.html not found", 404
                
    return app

# This part is for running the app directly using `python src/main.py`
# For production, a WSGI server like Gunicorn or uWSGI would be used,
# and it would typically call create_app() itself.
if __name__ == '__main__':
    app = create_app() # Creates app with default (dev/prod) config
    # Create tables if they don't exist (optional, migrations should handle this)
    # with app.app_context():
    #     db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
