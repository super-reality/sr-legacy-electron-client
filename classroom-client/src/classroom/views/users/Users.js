import React, {Fragment, useEffect} from "react"
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import {connect} from "react-redux"
import {hydrate} from "../../actions/users";
import styles from "./Users.scss"

const Users = props => {

    const {path, url} = useRouteMatch();

    useEffect(() => {
        props
            .hydrate()
            .catch(error => undefined);
    }, []);

    return (
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
                                            <tr key={user.id}>
                                                <td>
                                                    {user.username}
                                                    {user.root ? <em>(root)</em> : null}
                                                </td>
                                                <td>
                                                    {
                                                        !user.root
                                                            ? (
                                                                <Fragment>
                                                                    <Link to={`${url}/${user.id}`}>👁</Link>
                                                                    <Link to={`${url}/${user.id}/edit`}>✏</Link>
                                                                    <Link to={`${url}/${user.id}`}>❌</Link>
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
    );

};

const mapStateToProps = state => ({users: state.users});
const mapDispatchToProps = {hydrate};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
