import React from "react"
import {Switch, Route} from "react-router-dom"
import {connect} from "react-redux"
import {dismissAlert, receiveAlert} from "./actions/alerts";
import {authenticateFromLocalStorage, signOut} from "./actions/auth";
import MainTabs from "./components/TabContainer"
const App = props => {
    return (
        <div>
            <Switch>
                <Route path="/">
                    <MainTabs></MainTabs>
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
