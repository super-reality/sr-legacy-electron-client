import React from "react"
import {HashRouter as Router, Switch, Route, NavLink} from "react-router-dom"
import { connect } from "react-redux"
import { updateMessage } from "./actions"
import styles from "./App.scss"

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <NavLink exact to="/" className={styles.link} activeClassName={styles.active}>Home</NavLink>
                        &nbsp;
                        <NavLink exact to="/test" className={styles.link} activeClassName={styles.active}>Test</NavLink>
                    </nav>
                    <Switch>
                        <Route path="/test">
                            <h1>Test Page</h1>
                        </Route>
                        <Route path="/">
                            <h1>{this.props.message}</h1>
                            <button onClick={event => this.props.updateMessage("Goodbye, React!")}>Update Message</button>
                        </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}

const mapStateToProps = state => ({ message: state.message });
const mapDispatchToProps = { updateMessage };

export default connect(mapStateToProps, mapDispatchToProps)(App)
