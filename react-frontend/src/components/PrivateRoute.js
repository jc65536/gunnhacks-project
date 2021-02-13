import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom"
import { login, authFetch, useAuth, logout } from "../auth"

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [logged] = useAuth();

    return <Route {...rest} render={(props) => (
        logged
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
}

export default PrivateRoute;