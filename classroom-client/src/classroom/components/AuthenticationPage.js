import React, { useState, useRef } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { authenticateCredentials } from "../actions";
import styles from "./AuthenticationPage.scss"

const AuthenticationPage = props => {

    const [showValidation, setShowValidation] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const usernameFieldRef = useRef(null);
    const passwordFieldRef = useRef(null);

    const focusField = fieldRef => event => fieldRef.current.focus();

    const onUsernameFieldChange = event => {
        setShowValidation(true);
        setUsername(event.target.value);
    };

    const onPasswordFieldChange = event => {
        setShowValidation(true);
        setPassword(event.target.value);
    };

    const onFormSubmit = event => {
        event.preventDefault();
        props.authenticateCredentials({ username, password });
    };

    return props.isAuthenticated ? <Redirect to="/classes" /> : (
        <div>
            <h1>Game Gen Classroom</h1>
            <form onSubmit={onFormSubmit}>
                <fieldset>
                    <legend>Sign in</legend>
                    <div>
                        <label onClick={focusField(usernameFieldRef)}>Username</label>
                        <input ref={usernameFieldRef} type="text" placeholder="Username" value={username} onChange={onUsernameFieldChange} />
                    </div>
                    <div>
                        <label onClick={focusField(passwordFieldRef)}>Password</label>
                        <input ref={passwordFieldRef} type="password" placeholder="Password" value={password} onChange={onPasswordFieldChange} />
                    </div>
                    <div>
                        <input type="submit" value="Sign in" />
                    </div>
                </fieldset>
            </form>
        </div>
    );

};

const mapStateToProps = state => ({ isAuthenticated: !!state.auth });
const mapDispatchToProps = { authenticateCredentials };

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationPage)
