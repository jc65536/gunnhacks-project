import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import { login } from "./auth"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import Workout from "./pages/Workout"
import "./style/main.css"
import NavBar from "./components/NavBar"
import Logout from "./pages/Logout"

export default function App() {
    return (
        <Router>
            <div>
                <NavBar />
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <div className="content-container">
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/signup">
                            <Signup />
                        </Route>
                        <PrivateRoute component={Dashboard} path="/dashboard" />
                        <PrivateRoute component={Workout} path="/workout" />
                        <Route path="/logout">
                            <Logout />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h1>Jumping Jarvis!</h1>
            <p>Meet your A.I. exercise buddy Jumping Jarvis! Jarvis uses the Posenet pose estimation model to track how you move, helping you count all your reps! He also stores all your workouts, so you can see your progress over time!</p>
            <p>View his source code <a href={"https://github.com/jc65536/gunnhacks-project"}>here.</a></p>
        </div>
    )
}
