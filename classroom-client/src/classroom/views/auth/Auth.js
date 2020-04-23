import React, {useRef} from "react"
import {useHistory, useLocation} from "react-router-dom";
import {connect} from "react-redux"
import {authenticate} from "../../actions/auth";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../actions/alerts";
import styles from "./Auth.scss"

const Auth = props => {

    const location = useLocation();
    const history = useHistory();

    const usernameField = useRef(null);
    const passwordField = useRef(null);

    const focusField = fieldRef => event => fieldRef.current.focus();

    const onFormSubmit = event => {
        event.preventDefault();
        props
            .authenticate(usernameField.current.value, passwordField.current.value)
            .then(() => history.replace(location.state ? location.state.redirect : "/"))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset>
                <legend>sign in</legend>
                <div>
                    <label onClick={focusField(usernameField)}>username</label>
                    <input ref={usernameField} type="text" placeholder="username" disabled={props.isFetching} />
                </div>
                <div>
                    <label onClick={focusField(passwordField)}>password</label>
                    <input ref={passwordField} type="password" placeholder="password" disabled={props.isFetching} />
                </div>
                <div>
                    <input type="submit" value={props.isFetching ? "signing in..." : "sign in"} disabled={props.isFetching} />
                </div>
            </fieldset>
        </form>
    );

};

const mapStateToProps = state => ({isFetching: state.auth.isFetching, isAuthenticated: state.auth.isValid});
const mapDispatchToProps = {authenticate, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
