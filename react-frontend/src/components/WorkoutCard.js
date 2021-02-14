import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"

class WorkoutCard extends React.Component {

    constructor(props) {
        super(props)

    }

    render() {
        var exercises = [];
        for (var i in this.props.stats.reps) {
            var exName;
            if (i === "jumpingJacks")
                exName = "Jumping jacks";
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