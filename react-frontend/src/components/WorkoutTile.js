import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"

class WorkoutTile extends React.Component {

    constructor(props) {
        super(props)

    }

    render() {
        var exercises = [];
        for (var i in this.props.stats.reps) {
            exercises.push(<p>{i}: {this.props.stats.reps[i]} reps</p>);
        }
        return (
            <li style={{
                border: "1px solid black"
            }}>
                <h2>{new Date(this.props.stats.timestamp * 1000).toString()}</h2>
                {exercises}
                <h2>Calories burned: {this.props.stats.calories}</h2>
            </li>
        )
    }
}

export default WorkoutTile;