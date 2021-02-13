import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"
import { login, authFetch, useAuth, logout } from "../auth"

class Workout extends React.Component {

    constructor(props) {
        super(props)
        this.doWorkout = this.doWorkout.bind(this);
    }

    doWorkout() {
        authFetch("/api/setstats", {
            method: 'post',
            body: JSON.stringify({
                reps: {
                    squats: 2,
                    jumpingJacks: 4
                },
                date: new Date().toISOString(),
                calories: 400
            })
        }).then(response => {

            return response.json();
        }).then(response => {
            console.log(response)
        })
    }

    render() {
        return <div>
            <h2>Welcome to workout!</h2>
            <input type="button" value="do workout" onClick={this.doWorkout} />
        </div>
    }
}

export default Workout;