from app import app
from models import db, User
from werkzeug.security import generate_password_hash

def create_admin_user():
    with app.app_context():
        # Vérifier si l'utilisateur existe déjà
        existing_user = User.query.filter_by(email='admin@clinic.com').first()
        if existing_user:
            print("L'utilisateur admin@clinic.com existe déjà!")
            return
        
        # Créer un nouvel utilisateur
        admin_user = User(
            name='Dr. Admin',
            email='admin@clinic.com',
            password_hash=generate_password_hash('admin123'),
            role='admin'
        )
        
        db.session.add(admin_user)
        db.session.commit()
        
        print("✅ Utilisateur admin créé avec succès!")
        print("📧 Email: admin@clinic.com")
        print("🔑 Mot de passe: admin123")
        print("👤 Rôle: admin")

if __name__ == '__main__':
    create_admin_user()