import React, {useEffect} from "react";
import {connect} from "react-redux";
import styles from "./ShowUser.scss";
import {destroyUser, readUser} from "../../../actions/users";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../../actions/alerts";
import {Link} from "react-router-dom";

const ShowUser = props => {

    const {url} = props.match;

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
                    <div>
                        <Link to={`${url}/edit`}>✏</Link>
                        <Link to={url.substr(0, url.lastIndexOf("/"))} onClick={onDestroyClick(props.user.id)} replace>❌</Link>
                    </div>
                </div>
            )
            : <p>user not found</p>
        : <p>fetching user&#8230;</p>
    );

};

const mapStateToProps = (state, ownProps) => ({isPending: state.users.isPending, user: state.users.users.find(user => user.id === ownProps.match.params.userId)});
const mapDispatchToProps = {destroyUser, readUser, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(ShowUser);
