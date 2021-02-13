from api import create_app
from api.extensions import db

db.create_all(app=create_app())