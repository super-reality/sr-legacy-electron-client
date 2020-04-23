import React from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {connect} from "react-redux"
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./views/auth/Auth";
import {authInvalidated} from "./actions/auth";
import styles from "./App.scss"
import Users from "./views/users/Users";
import {dismissAlert} from "./actions/alerts";

const App = props => {

    const onSignOutClick = event => {
        event.preventDefault();
        props.signOut()
        history.push("/auth");
    };

    return (
        <div>
            <h1><NavLink to="/">Classroom</NavLink></h1>
            <nav>
                {
                    props.isAuthenticated
                        ? (
                            <ul className={styles.nav}>
                                <li><NavLink to="/classes" activeClassName={styles.active}>classes</NavLink></li>
                                <li><NavLink to="/users" activeClassName={styles.active}>users</NavLink></li>
                                <li><NavLink to="/auth" activeClassName={styles.active} onClick={onSignOutClick}>sign out</NavLink></li>
                            </ul>
                        )
                        : (
                            <ul className={styles.nav}>
                                <li><NavLink to="/auth" activeClassName={styles.active}>sign in</NavLink></li>
                            </ul>
                        )
                }
            </nav>
            {
                props.alerts.length > 0
                ? (
                    <ul>
                        {props.alerts.map(alert => (
                            <li key={alert.id} onClick={e => props.dismissAlert(alert.id)}>{alert.status}: {alert.message}</li>
                        ))}
                    </ul>
                )
                : null
            }
            <Switch>
                <ProtectedRoute path="/classes" authPath="/auth">
                    <p>classes</p>
                </ProtectedRoute>
                <ProtectedRoute path="/users" authPath="/auth">
                    <Users />
                </ProtectedRoute>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Route path="/">
                    <p>home</p>
                </Route>
            </Switch>
        </div>
    );

};

const mapStateToProps = state => ({alerts: state.alerts, isAuthenticated: state.auth.isValid});
const mapDispatchToProps = {dismissAlert, signOut: authInvalidated};

export default connect(mapStateToProps, mapDispatchToProps)(App)
