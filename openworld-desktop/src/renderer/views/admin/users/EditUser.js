import React, {useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../../actions/alerts";
import {destroyUser, readUser, updateUser} from "../../../actions/users";
import styles from "./EditUser.module.scss";

const EditUser = props => {

    const {url} = props.match;

    const usernameField = useRef(null);
    const passwordField = useRef(null);
    const passwordConfirmField = useRef(null);

    const onFormSubmit = event => {
        event.preventDefault();
        const [username, password, passwordConfirm] = [usernameField, passwordField, passwordConfirmField].map(ref => ref.current.value);
        let isValid = true;
        if((password || passwordConfirm) && password !== passwordConfirm) {
            isValid = false;
            props.receiveAlert(ALERT_STATUS_ERROR, "passwords don't match");
        }
        if(isValid) {
            props
                .updateUser(props.match.params.userId, {username, password})
                .then(user => {
                    passwordField.current.value = "";
                    passwordConfirmField.current.value = "";
                })
                .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
        }
    };

    const onDestroyClick = userId => event => {
        props
            .destroyUser(userId)
            .then(user => props.receiveAlert(ALERT_STATUS_SUCCESS, `User "${user.username}" destroyed.`))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    useEffect(() => {
        props
            .readUser(props.match.params.userId)
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    }, []);

    return (
        !props.isPending || props.user
            ? props.user
                ? (
                    <div>
                        <h3>{props.user.username}</h3>
                        <p>id: <code>{props.user.id}</code></p>
                        <form onSubmit={onFormSubmit}>
                            <fieldset>
                                <legend>update user</legend>
                                <div>
                                    <label>username</label>
                                    <input ref={usernameField} type="text" defaultValue={props.user.username} placeholder="username" required disabled={props.isPending} />
                                </div>
                                <div>
                                    <label>password</label>
                                    <input ref={passwordField} type="password" placeholder="password" disabled={props.isPending} />
                                </div>
                                <div>
                                    <label>password (confirm)</label>
                                    <input ref={passwordConfirmField} type="password" placeholder="password (confirm)" disabled={props.isPending} />
                                </div>
                                <div>
                                    <input type="submit" value="update" disabled={props.isPending} />
                                </div>
                            </fieldset>
                        </form>
                        <div>
                            <Link to={url.substr(0, url.lastIndexOf("/"))}>🔙</Link>
                            <Link to={url.substr(0, url.lastIndexOf("/") - 1)} onClick={onDestroyClick(props.user.id)} replace>❌</Link>
                        </div>
                    </div>
                )
                : <p>user not found</p>
            : <p>fetching user&#8230;</p>
    );

};

const mapStateToProps = (state, ownProps) => ({isPending: state.users.isPending, user: state.users.users.find(user => user.id === ownProps.match.params.userId)});
const mapDispatchToProps = {destroyUser, readUser, receiveAlert, updateUser};

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
