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
        this.startCapture = this.startCapture.bind(this);
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

    startCapture() {
        var video = document.querySelector("#videoElement");
        console.log(video)
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log("Something went wrong!");
                });
        }
    }

    render() {
        return <div>
            <h2>Welcome to workout!</h2>
            <input type="button" value="do workout" onClick={this.doWorkout} />
            <div id="video-container">
                <video autoPlay={true} id="videoElement" onClick={this.startCapture} width="500px" height="375px" style={{
                    border: "1px solid black"
                }}>

                </video>
            </div>
        </div>
    }
}

export default Workout;