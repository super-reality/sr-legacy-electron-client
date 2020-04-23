import React, {Fragment} from "react";
import {NavLink, Route, Switch, useRouteMatch} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./Admin.scss";
import Users from "./users/Users";

const Admin = props => {

    const {path, url} = useRouteMatch();

    return (
        <Fragment>
            <nav>
                <ul className={styles.nav}>
                    <li><NavLink exact to={url} activeClassName={styles.active}>dashboard</NavLink></li>
                    <li><NavLink to={`${url}/users`} activeClassName={styles.active}>users</NavLink></li>
                </ul>
            </nav>
            <Switch>
                <Route path={`${path}/users`}>
                    <Users />
                </Route>
                <Route path={`${path}/`}>
                    <p>dashboard</p>
                </Route>
            </Switch>
        </Fragment>
    );

};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
