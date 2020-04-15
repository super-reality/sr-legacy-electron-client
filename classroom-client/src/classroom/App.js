import React from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {connect} from "react-redux"
import Auth from "./views/auth/Auth";
import {authInvalidated} from "./actions/auth";
import styles from "./App.scss"
import Users from "./views/users/Users";

const App = props => {

    const onSignOutClick = event => props.signOut();

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
            <Switch>
                <Route path="/classes">
                    <p>classes</p>
                </Route>
                <Route path="/users">
                    <Users />
                </Route>
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

const mapStateToProps = state => ({isAuthenticated: state.auth.isValid});
const mapDispatchToProps = {signOut: authInvalidated};

export default connect(mapStateToProps, mapDispatchToProps)(App)
