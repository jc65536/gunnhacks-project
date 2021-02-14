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
        <h1>Home</h1>
        <p>Meet your A.I. exercise buddy!</p>
        </div>
    )
}
