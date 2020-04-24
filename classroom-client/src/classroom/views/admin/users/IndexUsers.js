import React, {Fragment, useEffect} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import classNames from "classnames";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../../actions/alerts";
import {destroyUser, hydrateUsers} from "../../../actions/users";
import styles from "./IndexUsers.scss";

const IndexUsers = props => {

    const {url} = props.match;

    const onDestroyClick = userId => event => {
        props
            .destroyUser(userId)
            .then(user => props.receiveAlert(ALERT_STATUS_SUCCESS, `User "${user.username}" destroyed.`))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    useEffect(() => {
        props
            .hydrateUsers()
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    }, []);

    return (
        !props.isPending || props.users.length > 0
            ? props.users.length > 0
                ? (
                    <table className={classNames(styles.index, {[styles.isPending]: props.isPending})}>
                        <thead>
                        <tr>
                            <th>username</th>
                            <th>actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <Link to={`${url}/${user.id}`}>{user.username}</Link>
                                        &nbsp;
                                        {user.root ? <em>(root)</em> : null}
                                    </td>
                                    <td>
                                        <Fragment>
                                            <Link to={`${url}/${user.id}/edit`}>✏</Link>
                                            <Link to={url} onClick={onDestroyClick(user.id)} replace>❌</Link>
                                        </Fragment>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                )
                : (
                    <p>no users</p>
                )
            : <p>fetching users&#8230;</p>
    );

};

const mapStateToProps = state => ({isPending: state.users.isPending, users: state.users.users});
const mapDispatchToProps = {destroyUser, hydrateUsers, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(IndexUsers);
