import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom"
import { login, authFetch, useAuth, logout } from "../auth"

// Code taken from https://yasoob.me/posts/how-to-setup-and-deploy-jwt-auth-using-react-and-flask/

// PrivateRoute redirects users to /login if they try to access private pages
const PrivateRoute = ({ component: Component, ...rest }) => {
    const [logged] = useAuth();

    return <Route {...rest} render={(props) => (
        logged
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
}

export default PrivateRoute;