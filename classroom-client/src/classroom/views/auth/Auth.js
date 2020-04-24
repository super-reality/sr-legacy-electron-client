import React, {useRef} from "react"
import {connect} from "react-redux"
import {authenticate} from "../../actions/auth";
import {ALERT_STATUS_ERROR, receiveAlert} from "../../actions/alerts";
import styles from "./Auth.scss"

const Auth = props => {

    const usernameField = useRef(null);
    const passwordField = useRef(null);

    const focusField = fieldRef => event => fieldRef.current.focus();

    const onFormSubmit = event => {
        event.preventDefault();
        props
            .authenticate(usernameField.current.value, passwordField.current.value)
            .then(() => props.history.replace(props.location.state ? props.location.state.redirect : "/"))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset>
                <legend>sign in</legend>
                <div>
                    <label onClick={focusField(usernameField)}>username</label>
                    <input ref={usernameField} type="text" placeholder="username" disabled={props.isPending} />
                </div>
                <div>
                    <label onClick={focusField(passwordField)}>password</label>
                    <input ref={passwordField} type="password" placeholder="password" disabled={props.isPending} />
                </div>
                <div>
                    <input type="submit" value="sign in" disabled={props.isPending} />
                </div>
            </fieldset>
        </form>
    );

};

const mapStateToProps = state => ({isPending: state.auth.isPending, isAuthenticated: state.auth.isValid});
const mapDispatchToProps = {authenticate, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
