import React from "react"
import {HashRouter as Router, Switch, Route} from "react-router-dom"
import { connect } from "react-redux"
import styles from "./App.scss"
import ServerClientTest from "./ServerClientTest";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/">
                            <ServerClientTest />
                        </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App)
