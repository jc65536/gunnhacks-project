import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom"

export default function Logout() {
    logout();
    return <Redirect to="/login"/>
}