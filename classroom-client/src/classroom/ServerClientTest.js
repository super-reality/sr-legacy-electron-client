import React from "react"
import { connect } from "react-redux"
import io from "socket.io-client"
import styles from "./ServerClientTest.scss"
import {initializeUsersSocket, connectUser, disconnectUser} from "./actions";

class ServerClientTest extends React.Component {

    constructor(props) {
        super(props);
        const { dispatch } = this.props;
        this.socket = io.connect("ws://localhost:3000");
        dispatch(initializeUsersSocket(this.socket));
        this.socket.on("userConnected", user => dispatch(connectUser(user)));
        this.socket.on("userDisconnected", user => dispatch(disconnectUser(user)));
    }

    render() {
        return (
            <div>
                <h1>Server/Client Test</h1>
                <h2>Connected users</h2>
                <ul>
                    {this.props.users.map(user => (
                        <li key={user}>{user}{user === this.socket.id ? " (that's you!)" : null}</li>
                    ))}
                </ul>
            </div>
        )
    }

}

export default connect(state => ({ users: state.users }))(ServerClientTest)
