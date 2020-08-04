import React, {useRef} from "react";
import {connect} from "react-redux";
import {ALERT_STATUS_ERROR, receiveAlert} from "../../../actions/alerts";
import {createUser} from "../../../actions/users";
import styles from "./NewUser.module.scss";

const NewUser = props => {

    const {url} = props.match;

    const usernameField = useRef(null);
    const passwordField = useRef(null);
    const passwordConfirmField = useRef(null);

    const onFormSubmit = event => {
        event.preventDefault();
        const [username, password, passwordConfirm] = [usernameField, passwordField, passwordConfirmField].map(ref => ref.current.value);
        let isValid = true;
        if(password !== passwordConfirm) {
            isValid = false;
            props.receiveAlert(ALERT_STATUS_ERROR, "passwords don't match");
        }
        if(isValid) {
            props
                .createUser({username, password})
                .then(user => props.history.push(`${url.substr(0, url.lastIndexOf("/"))}/${user.id}`))
                .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset>
                <legend>new user</legend>
                <div>
                    <label>username</label>
                    <input ref={usernameField} type="text" placeholder="username" required disabled={props.isPending} />
                </div>
                <div>
                    <label>password</label>
                    <input ref={passwordField} type="password" placeholder="password" required disabled={props.isPending} />
                </div>
                <div>
                    <label>password (confirm)</label>
                    <input ref={passwordConfirmField} type="password" placeholder="password (confirm)" required disabled={props.isPending} />
                </div>
                <div>
                    <input type="submit" value="create" disabled={props.isPending} />
                </div>
            </fieldset>
        </form>
    );

};

const mapStateToProps = state => ({});
const mapDispatchToProps = {createUser, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
