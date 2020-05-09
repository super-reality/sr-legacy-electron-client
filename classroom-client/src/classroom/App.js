import React, {useEffect} from "react"
import {Switch, Route, NavLink, useHistory} from "react-router-dom"
import {connect} from "react-redux"
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./views/admin/Admin";
import Auth from "./views/auth/Auth";
import {ALERT_STATUS_ERROR, dismissAlert, receiveAlert} from "./actions/alerts";
import {authenticateFromLocalStorage, signOut} from "./actions/auth";
import styles from "./App.scss"

const App = props => {

    const history = useHistory();

    const onSignOutClick = event => {
        event.preventDefault();
        props.signOut()
        history.push("/auth");
    };

    useEffect(() => {
        props
            .authenticateFromLocalStorage()
            .catch(error => error ? props.receiveAlert(ALERT_STATUS_ERROR, error.message) : undefined);
    }, []);

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
                <ProtectedRoute path="/admin" authPath="/auth" component={Admin} />
                <Route path="/auth" component={Auth} />
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
const mapDispatchToProps = {authenticateFromLocalStorage, dismissAlert, receiveAlert, signOut};

export default connect(mapStateToProps, mapDispatchToProps)(App)
