import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

export default function NavBar() {
    return (
        <nav>
            <ul>
                <Link to="/"><li>Home</li></Link>

                <Link to="/login"><li>Login</li></Link>

                <Link to="/signup"><li>Signup</li></Link>

                <Link to="/dashboard"><li>Dashboard</li></Link>
            </ul>
        </nav>
    )
}