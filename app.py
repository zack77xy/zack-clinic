from flask import Flask, request, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from routes.auth import auth_bp
from routes.patients import patient_bp
from routes.diagnostics import diagnostic_bp
from routes.vitals import vitals_bp

app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clinic.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser les extensions
db.init_app(app)
jwt = JWTManager(app)

# IMPROVED CORS Configuration
CORS(app, 
     origins=['http://localhost:3000', 'http://localhost:3001'], 
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     expose_headers=['Content-Type', 'Authorization'])

# Handle preflight requests explicitly
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

# Enregistrer tous les blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(patient_bp, url_prefix='/api/patients')
app.register_blueprint(diagnostic_bp, url_prefix='/api/diagnostics')
app.register_blueprint(vitals_bp, url_prefix='/api/vitals')

# Créer les tables si elles n'existent pas
with app.app_context():
    db.create_all()

@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'OK', 'message': 'API is running'}

# Test endpoint without auth to verify CORS
@app.route('/test', methods=['GET'])
def test():
    return {'message': 'CORS test successful'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)