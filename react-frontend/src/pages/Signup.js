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
            password: "",
            weight: "",
            height: "",
            in: "",
        };

        // There's gotta be a more elegant way right?
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleWeightChange = this.handleWeightChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleInChange = this.handleInChange.bind(this);
    }

    onSubmitClick(e) {
        e.preventDefault();
        let opts = {
            'username': this.state.username,
            'password': this.state.password,
            attributes: {
                weight: parseFloat(this.state.weight) * 0.453592,
                height: (parseFloat(this.state.height) + parseFloat(this.state.in) / 12) * 0.3048
            }
        }
        fetch('/api/register', {
            method: 'post',
            body: JSON.stringify(opts)
        }).then(r => r.json()).then(token => {
            console.log(token.message);
            if (token.registered) {
                this.setState({ signedUp: true });
            }
        })
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleWeightChange(e) {
        this.setState({ weight: e.target.value })
    }

    handleHeightChange(e) {
        this.setState({ height: e.target.value })
    }

    handleInChange(e) {
        this.setState({ in: e.target.value })
    }

    render() {
        if (this.state.signedUp) {
            return <Redirect to="/login" />
        } else
            return (
                <div>
                    <h1>Sign up</h1>
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
                        <br />
                    Optional:
                    <div>
                            <input
                                type="number"
                                placeholder="Weight (lbs)"
                                onChange={this.handleWeightChange}
                                value={this.state.weight}
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="Height (ft)"
                                onChange={this.handleHeightChange}
                                value={this.state.height}
                                style={{
                                    width: "120px",

                                }}
                            />
                            <input
                                type="number"
                                placeholder="(in)"
                                onChange={this.handleInChange}
                                value={this.state.in}
                                style={{
                                    width: "60px",
                                    marginLeft: "16px",

                                }}
                            />
                        </div>
                        <input onClick={this.onSubmitClick} type="submit" value="Sign up" />
                    </form>
                </div>
            )
    }
}

export default Signup;