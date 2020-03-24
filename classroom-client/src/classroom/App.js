import React from "react"
import { connect } from "react-redux"
import { updateMessage } from "./actions";
import styles from "./App.scss"

class App extends React.Component {
    render() {
        return (
            <div>
                <h1 className={styles.test}>{this.props.message}</h1>
                <button onClick={event => this.props.updateMessage("Goodbye, React!")}>Update Message</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({ message: state.message });
const mapDispatchToProps = { updateMessage };
export default connect(mapStateToProps, mapDispatchToProps)(App)
