import React, {Fragment} from "react"
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux"
import ListUsers from "./ListUsers";
import styles from "./Users.scss"
import EditUser from "./EditUser";
import NewUser from "./NewUser";
import ShowUser from "./ShowUser";

const Users = props => {

    const {path, url} = props.match;

    return (
        <Fragment>
            <nav>
                <ul className={styles.nav}>
                    <li>users:</li>
                    <li><NavLink exact to={url} activeClassName={styles.active}>index</NavLink></li>
                    <li><NavLink to={`${url}/new`} activeClassName={styles.active}>new</NavLink></li>
                </ul>
            </nav>
            <Switch>
                <Route path={`${path}/new`} component={NewUser} />
                <Route path={`${path}/:userId/edit`} component={EditUser} />
                <Route path={`${path}/:userId`} component={ShowUser} />
                <Route path={`${path}/`} component={ListUsers} />
            </Switch>
        </Fragment>
    );

};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
