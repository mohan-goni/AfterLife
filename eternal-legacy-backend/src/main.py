import sys
import os
from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.auth import auth_bp
from src.routes.legacy import legacy_bp
from src.routes.media import media_bp
from flask_migrate import Migrate

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
CORS(app)  # Enable CORS for all routes
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(legacy_bp, url_prefix='/api/legacies')
app.register_blueprint(media_bp, url_prefix='/api/media')

# Enable database
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{os.getenv('DB_USERNAME', 'postgres')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', '127.0.0.1')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'Eternal_legacy')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print(f"DEBUG: SQLALCHEMY_DATABASE_URI: {app.config['SQLALCHEMY_DATABASE_URI']}") # Temporary debug print
db.init_app(app)
migrate = Migrate(app, db)

# Create tables
# with app.app_context():
#     db.create_all()

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
