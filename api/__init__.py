from flask import Flask
import os
from flask_cors import CORS
import flask_praetorian

SECRET_KEY = os.urandom(32)


# Basic app factory
def create_app():
    app = Flask(__name__)
    register_extensions(app)
    register_blueprints(app)

    cors = CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})

    return app


def register_extensions(app):
    from .extensions import db, guard
    from .models import User
    # Will probably need to make a separate config file at some point
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
    app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
    guard.init_app(app, User)

    db.init_app(app)


def register_blueprints(app):
    from .main import main
    app.register_blueprint(main)

    from .auth import auth
    app.register_blueprint(auth)
