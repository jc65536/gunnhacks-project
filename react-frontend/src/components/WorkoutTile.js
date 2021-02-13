import { login, authFetch, useAuth, logout } from "../auth"
import React, { useEffect, useState } from "react"

class WorkoutTile extends React.Component {

    constructor(props) {
        super(props)

    }

    render() {
        return (
            <a href={`workouts/${this.props.name.toLowerCase()}`}>
                <td style={{
                    width: "200px",
                    height: "100px",
                    border: "1px solid black"
                }}>
                    <h2>{this.props.name}</h2>
                </td>
            </a>
        )
    }
}

export default WorkoutTile;