import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"
import WorkoutTile from "../components/WorkoutTile"

export default function Dashboard() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        authFetch("/api/testauth").then(response => {
            if (response.status === 401) {
                setMessage("Sorry you aren't authorized!")
                return null
            }
            return response.text();
        }).then(response => {
            if (response) {
                console.log(response)
                setMessage(response)
            }
        })
    }, [])
    return (
        <div>
            <h2>Dashboard: {message}</h2>
            <input type="submit" value="Logout" onClick={() => logout()} />
            <table>
                <tr>
                    <WorkoutTile name="Squats"/>
                </tr>
            </table>
        </div>
    )
}