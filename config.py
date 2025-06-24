import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/clinique_db")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "superjwtsecret")
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False