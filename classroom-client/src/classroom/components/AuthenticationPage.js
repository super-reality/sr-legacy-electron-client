import React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { authenticateCredentials } from "../actions";
import styles from "./AuthenticationPage.scss"

class AuthenticationPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showValidation: false,
            username: "",
            password: ""
        };

        this.usernameFieldRef = React.createRef();
        this.passwordFieldRef = React.createRef();

        this.onUsernameFieldChange = this.onUsernameFieldChange.bind(this);
        this.onPasswordFieldChange = this.onPasswordFieldChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    render() {
        return this.props.isAuthenticated ? <Redirect to="/classes" /> : (
            <div>
                <h1>Game Gen Classroom</h1>
                <form onSubmit={this.onFormSubmit}>
                    <fieldset>
                        <legend>Sign in</legend>
                        <div>
                            <label onClick={this.focusField(this.usernameFieldRef)}>Username</label>
                            <input ref={this.usernameFieldRef} type="text" placeholder="Username" value={this.state.username} onChange={this.onUsernameFieldChange} />
                        </div>
                        <div>
                            <label onClick={this.focusField(this.passwordFieldRef)}>Password</label>
                            <input ref={this.passwordFieldRef} type="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordFieldChange} />
                        </div>
                        <div>
                            <input type="submit" value="Sign in" />
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }

    focusField(fieldRef) {
        return event => fieldRef.current.focus();
    }

    onUsernameFieldChange(event) {
        this.setState({ showValidation: true, username: event.target.value });
    }

    onPasswordFieldChange(event) {
        this.setState({ showValidation: true, password: event.target.value });
    }

    onFormSubmit(event) {
        event.preventDefault();
        const { authenticateCredentials } = this.props;
        this.setState(
            previousState => ({ username: previousState.username.trim() }),
            () => authenticateCredentials({ username: this.state.username, password: this.state.password })
        );
    }

}

const mapStateToProps = state => ({ isAuthenticated: !!state.auth });
const mapDispatchToProps = { authenticateCredentials };

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationPage)
