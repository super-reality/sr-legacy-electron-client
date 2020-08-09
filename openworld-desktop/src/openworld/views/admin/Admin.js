import React, {Fragment} from "react";
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./Admin.module.scss";
import Users from "./users/Users";

const Admin = props => {

    const {path, url} = props.match;

    return (
        <Fragment>
            <nav>
                <ul className={styles.nav}>
                    <li>admin:</li>
                    <li><NavLink exact to={url} activeClassName={styles.active}>dashboard</NavLink></li>
                    <li><NavLink to={`${url}/users`} activeClassName={styles.active}>users</NavLink></li>
                </ul>
            </nav>
            <Switch>
                <Route path={`${path}/users`} component={Users} />
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
