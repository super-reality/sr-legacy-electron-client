import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import AuthenticationPage from "./components/AuthenticationPage";
import ClassesPage from "./components/ClassesPage";
import styles from "./App.scss"

const App = props => (
    <Switch>
        <Route path="/classes/:classId">
            <h1>Specific Class</h1>
            <p>This is a route stub.</p>
        </Route>
        <Route path="/classes">
            <ClassesPage />
        </Route>
        <Route path="/auth">
            <AuthenticationPage />
        </Route>
        <Route path="/">
            <Redirect to="/auth" />
        </Route>
    </Switch>
);

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App)
