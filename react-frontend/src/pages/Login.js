import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import {login, useAuth, logout} from "../auth"

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [logged] = useAuth();

    const onSubmitClick = (e) => {
        e.preventDefault()
        console.log("You pressed login")
        let opts = {
            'username': username,
            'password': password
        }
        console.log(opts)
        fetch('/api/login', {
            method: 'post',
            body: JSON.stringify(opts)
        }).then(r => r.json())
            .then(token => {
                if (token.access_token) {
                    login(token)
                    console.log(token)
                }
                else {
                    console.log("Please type in correct username/password")
                }
            })
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div>
            <h1>Login</h1>
            {!logged ? <form action="#">
                <div>
                    <input type="text"
                        placeholder="Username"
                        onChange={handleUsernameChange}
                        value={username}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={handlePasswordChange}
                        value={password}
                    />
                </div>
                <input onClick={onSubmitClick} type="submit" value="Login" />
            </form>
                : <input type="submit" value="Logout" onClick={() => logout()} />}
        </div >
    )
}