from flask import Blueprint, request, jsonify, current_app
from .extensions import db
from flask_praetorian import auth_required, current_user_id, current_user
from .models import Workout
from datetime import date
import time

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return "Hello World!"


@main.route("/api/testauth")
@auth_required
def testauth():
    return "Hey! You're authorized!"


@main.route("/api/setstats", methods=["POST"])
@auth_required
def setStats():
    data = request.get_json(force=True)
    reps = data.get("reps")
    calories = data.get("calories")
    sent_date = data.get("date")[0:10]  # Gets YYYY-MM-DD
    workout = Workout(reps=reps, calories=calories, user_id=current_user_id(), timestamp=int(time.time()))
    activity_dates = current_user().activity_dates
    print(activity_dates)
    if len(current_user().activity_dates) != 0:
        last_exercised_date = \
            sorted([date(int(x[0:4]), int(x[5:7]), int(x[8:])) for x in current_user().activity_dates])[-1]

        if (date(int(sent_date[0:4]), int(sent_date[5:7]), int(sent_date[8:])) - last_exercised_date).days == 1:
            current_user().streak += 1
        elif (date(int(sent_date[0:4]), int(sent_date[5:7]), int(sent_date[8:])) - last_exercised_date).days > 1:
            current_user().streak = 1
    else:
        current_user().streak = 1

    activity_dates.add(sent_date)
    current_user().activity_dates = activity_dates
    db.session.add(workout)
    db.session.commit()

    return jsonify({'message': 'Workout added successfully', 'successful': True})


@main.route("/api/getstats", methods=["GET"])
@auth_required
def getStats():
    requested_user = current_user()

    all_workouts = []

    for i in requested_user.workouts:
        all_workouts.append({
            "timestamp": i.timestamp,
            "reps": i.reps,
            "calories": i.calories
        })

    return jsonify({"streak": requested_user.streak, "workouts": all_workouts})


@main.route("/api/getuser")
@auth_required
def getUser():
    return current_user().attributes


@main.route("/api/setuser", methods=['POST'])
@auth_required
def setUser():
    data = request.get_json(force=True)
    current_user().attributes = data
    db.session.commit()
    return jsonify({'message': "Successful"})
