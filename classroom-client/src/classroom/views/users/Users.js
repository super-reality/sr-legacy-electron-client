import React, {Fragment, useEffect} from "react"
import {Link, Route, Switch, Redirect, useRouteMatch} from "react-router-dom";
import {connect} from "react-redux"
import {hydrate} from "../../actions/users";
import styles from "./Users.scss"

const Users = props => {

    const {path, url} = useRouteMatch();

    useEffect(() => props.hydrate(props.authToken), []);

    return props.isAuthenticated
        ? (
            <div>
                {
                    props.users.errors.length > 0
                    ? (
                        <ul>
                            {props.users.errors.map((error, index) => (
                                <li key={index}>{error.message}</li>
                            ))}
                        </ul>
                    )
                    : null
                }
                <Switch>
                    <Route path={`${path}/`}>
                        {
                            !props.isFetching
                                ? props.users.users.length > 0
                                ? (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>username</th>
                                            <th>actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            props.users.users.map(user => (
                                                <tr key={user._id}>
                                                    <td>
                                                        {user.username}
                                                        {user.root ? <em>(root)</em> : null}
                                                    </td>
                                                    <td>
                                                        {
                                                            !user.root
                                                                ? (
                                                                    <Fragment>
                                                                        <Link to={`${url}/${user._id}`}>👁</Link>
                                                                        <Link to={`${url}/${user._id}/edit`}>✏</Link>
                                                                        <Link to={`${url}/${user._id}`}>❌</Link>
                                                                    </Fragment>
                                                                )
                                                                : null
                                                        }
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
            </div>
        )
        : <Redirect to="/auth" />;

};

const mapStateToProps = state => ({isAuthenticated: state.auth.isValid, authToken: state.auth.token, users: state.users});
const mapDispatchToProps = {hydrate};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
