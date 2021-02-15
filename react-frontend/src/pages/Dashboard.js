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
    const [stats, setStats] = useState({});
    const [workouts, setWorkouts] = useState([]);

    /*
        /api/getstats response example:
        {
            streak: STREAK,
            workouts: [
                {
                    timestamp: 123912312,
                    reps: { jumpingJacks: 1, squats: 2 },
                    calories: 100
                },
                {
                    timestamp: 123912312,
                    reps: { jumpingJacks: 1, squats: 2 },
                    calories: 100
                },
            ]
        }
    */

    useEffect(() => {
        authFetch("/api/getstats").then(r => r.json()).then(response => {
            if (response) {
                setStats(response);
                // sorts the workouts array then maps it into an array of WorkoutCard components
                setWorkouts(response.workouts.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1).map(o => <WorkoutCard stats={o} />));
            }
        })
    }, [])

    return (
        <div>
            <h1>Dashboard</h1>
            <Link to="/workout"><input type="button" value="Workout" /></Link>
            <div className="stats-container">
                <h2>Streak: {stats.streak}</h2>
            </div>
            <ul class="workouts-container">
                {workouts}
            </ul>
        </div>
    )
}