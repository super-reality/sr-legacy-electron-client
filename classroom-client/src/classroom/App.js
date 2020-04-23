import React from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {connect} from "react-redux"
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./views/admin/Admin";
import Auth from "./views/auth/Auth";
import {dismissAlert} from "./actions/alerts";
import {authInvalidated} from "./actions/auth";
import styles from "./App.scss"

const App = props => {

    const onSignOutClick = event => {
        event.preventDefault();
        props.signOut()
        history.push("/auth");
    };

    return (
        <div>
            <nav>
                {
                    props.isAuthenticated
                        ? (
                            <ul className={styles.nav}>
                                <li><NavLink exact to="/" activeClassName={styles.active}>classroom</NavLink></li>
                                <li><NavLink to="/admin" activeClassName={styles.active}>admin</NavLink></li>
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
            <Switch>
                <ProtectedRoute path="/admin" authPath="/auth">
                    <Admin />
                </ProtectedRoute>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Route path="/">
                    <p>classroom</p>
                </Route>
            </Switch>
            {
                props.alerts.length > 0
                    ? (
                        <div>
                            <ul>
                                {props.alerts.map(alert => (
                                    <li key={alert.id} onClick={e => props.dismissAlert(alert.id)}>{alert.status}: {alert.message}</li>
                                ))}
                            </ul>
                        </div>
                    )
                    : null
            }
        </div>
    );

};

const mapStateToProps = state => ({alerts: state.alerts, isAuthenticated: state.auth.isValid});
const mapDispatchToProps = {dismissAlert, signOut: authInvalidated};

export default connect(mapStateToProps, mapDispatchToProps)(App)
