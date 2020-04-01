import React from "react"
import { connect } from "react-redux"
import io from "socket.io-client"
import styles from "./ServerClientTest.scss"
import {initializeUsersSocket, userConnectedSocket, userDisconnectedSocket} from "./actions";

class ServerClientTest extends React.Component {

    constructor(props) {
        super(props);
        const { dispatch } = this.props;
        this.socket = io.connect("ws://localhost:3000");
        this.props.initializeUsersSocket(this.socket);
        this.props.userConnectedSocket(this.socket);
        this.props.userDisconnectedSocket(this.socket);
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

const mapStateToProps = state => ({ users: state.users });
const mapDispatchToProps = { initializeUsersSocket, userConnectedSocket, userDisconnectedSocket };

export default connect(mapStateToProps, mapDispatchToProps)(ServerClientTest)
