import React, { useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"
import { login } from "../auth"

class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signedUp: false,
            username: "",
            password: ""
        };

        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }

    onSubmitClick(e) {
        e.preventDefault();
        console.log("You pressed login");
        let opts = {
            'username': this.state.username,
            'password': this.state.password
        }
        console.log(opts);
        fetch('/api/register', {
            method: 'post',
            body: JSON.stringify(opts)
        }).then(r => r.json())
            .then(token => {
                console.log(token.message);
                if (token.registered) {
                    this.setState({signedUp: true});
                }
            })
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        if (this.state.signedUp) {
            alert("You are signed up! Now you can log in.");
            return <Redirect to="/login" />
        } else
            return <div>
                <h2>Sign up</h2>
                <form action="#">
                    <div>
                        <input type="text"
                            placeholder="Username"
                            onChange={this.handleUsernameChange}
                            value={this.state.username}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={this.handlePasswordChange}
                            value={this.state.password}
                        />
                    </div>
                    <input value="Sign up" onClick={this.onSubmitClick} type="submit" />
                </form>
            </div>
    }
}

export default Signup;