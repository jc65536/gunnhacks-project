import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"

// These are the cards you see on the dashboard after you start logging workouts
class WorkoutCard extends React.Component {

    constructor(props) {
        super(props)
    }

    /*
        this.props.stats example:
        {
            timestamp: 12313123123,
            reps: {
                jumpingJacks: 1,
                squats: 2
            },
            calories: 100
        }
    */
    render() {
        var exercises = [];
        for (var i in this.props.stats.reps) {
            var exName;
            if (i === "jumpingJacks")
                exName = "Jumping Jacks";
            else {
                exName = "Squats"
            }
            exercises.push(<p>{exName}: {this.props.stats.reps[i]} reps</p>);
        }
        return (
            <li className="workout-card">
                <h2>{new Date(this.props.stats.timestamp * 1000).toString()}</h2>
                {exercises}
                <h2>Calories burned: {this.props.stats.calories.toFixed(2)}</h2>
            </li>
        )
    }
}

export default WorkoutCard;