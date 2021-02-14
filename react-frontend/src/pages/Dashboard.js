import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"
import WorkoutCard from "../components/WorkoutCard"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

export default function Dashboard() {
    const [message, setMessage] = useState('')
    const [stats, setStats] = useState({});
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        console.log("HELLOW");
        authFetch("/api/getstats").then(response => {
            if (response.status === 401) {
                setMessage("Sorry you aren't authorized!")
                return null
            }
            return response.json();
        }).then(response => {
            if (response) {
                console.log(response);
                setStats(response);
                setWorkouts(response.workouts.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1).map(o => <WorkoutCard stats={o}/>));
            }
        })
    }, [])
    return (
        
        <div>
            <h1>Dashboard</h1>
            <Link to="/workout"><input type="button" value="Workout"/></Link>
            <div className="stats-container">
                <h2>Streak: {stats.streak}</h2>
            </div>
            <ul class="workouts-container">
                {workouts}
            </ul>
        </div>
    )
}