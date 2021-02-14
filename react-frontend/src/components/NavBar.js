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

                

                {
                    logged ? <Link to="/logout"><li>Logout</li></Link> : <Link to="/login"><li>Login</li></Link>
                }
                {
                    logged ? <Link to="/dashboard"><li>Dashboard</li></Link> : <Link to="/signup"><li>Sign Up</li></Link>
                }



            </ul>
        </nav>
    )
}