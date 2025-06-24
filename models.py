from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

db = SQLAlchemy()
migrate = Migrate()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='medecin')

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(120))
    age = db.Column(db.Integer)
    sexe = db.Column(db.String(10))
    telephone = db.Column(db.String(20))
    adresse = db.Column(db.String(200))
    groupe_sanguin = db.Column(db.String(5))
    image_url = db.Column(db.String(200))
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))

class Diagnostic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    symptomes = db.Column(db.Text)
    maladie = db.Column(db.String(120))
    traitements = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class VitalRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    temperature = db.Column(db.Float)
    tension = db.Column(db.String(50))
    frequence_cardiaque = db.Column(db.Integer)
    saturation = db.Column(db.Integer)
    respiration = db.Column(db.Integer)
    poids = db.Column(db.Float)
    taille = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)