from flask import Blueprint, request, jsonify, current_app
from .extensions import db
from flask_praetorian import auth_required

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return "Hello World!"


@main.route("/api/testauth")
@auth_required
def testauth():
    return "Hey! You're authorized!"
