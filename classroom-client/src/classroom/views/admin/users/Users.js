import React, {Fragment, useEffect} from "react"
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import {connect} from "react-redux"
import {ALERT_STATUS_ERROR, receiveAlert} from "../../../actions/alerts";
import {hydrate} from "../../../actions/users";
import styles from "./Users.scss"

const Users = props => {

    const {path, url} = useRouteMatch();

    useEffect(() => {
        props
            .hydrate()
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    }, []);

    return (
        <Switch>
            <Route path={`${path}/`}>
                {
                    !props.isFetching
                        ? props.users.users.length > 0
                            ? (
                                <table className={styles.index}>
                                    <thead>
                                        <tr>
                                            <th>username</th>
                                            <th>actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        props.users.users.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <Link to={`${url}/${user.id}`}>{user.username}</Link>
                                                    &nbsp;
                                                    {user.root ? <em>(root)</em> : null}
                                                </td>
                                                <td>
                                                    <Fragment>
                                                        <Link to={`${url}/${user.id}/edit`}>✏</Link>
                                                        <Link to={`${url}/${user.id}`}>❌</Link>
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
                }
            </Route>
        </Switch>
    );

};

const mapStateToProps = state => ({users: state.users});
const mapDispatchToProps = {hydrate, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
