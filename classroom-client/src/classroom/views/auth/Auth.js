import React, {useRef} from "react"
import {useHistory, useLocation} from "react-router-dom";
import {connect} from "react-redux"
import {authenticate} from "../../actions/auth";
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
            .catch(() => undefined);
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
                    {
                        props.errors.length > 0
                            ? (
                                <ul>
                                    {props.errors.map((error, index) => (
                                        <li key={index}>{error.message}</li>
                                    ))}
                                </ul>
                            )
                            : null
                    }
                </div>
            </fieldset>
        </form>
    );

};

const mapStateToProps = state => ({isFetching: state.auth.isFetching, isAuthenticated: state.auth.isValid, errors: state.auth.errors});
const mapDispatchToProps = {authenticate};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
