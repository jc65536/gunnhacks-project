import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import { login, authFetch, useAuth, logout } from "../auth"

export default function NavBar() {
    const [logged] = useAuth();
    return (
        <nav>
            <ul>
                <Link to="/"><li>Home</li></Link>

                <Link to="/login"><li>{logged ? "Logout" : "Login"}</li></Link>

                <Link to="/signup"><li>Signup</li></Link>

                <Link to="/dashboard"><li>Dashboard</li></Link>
            </ul>
        </nav>
    )
}