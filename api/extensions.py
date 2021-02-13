# File: extensions.py
# Will mainly serve as a place to put database stuff, to prevent circular imports
from flask_praetorian import Praetorian
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
guard = Praetorian()