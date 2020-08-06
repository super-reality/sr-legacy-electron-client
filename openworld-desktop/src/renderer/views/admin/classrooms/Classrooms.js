import React, {Fragment} from "react"
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux"
import ListClassrooms from "./ListClassrooms";
import EditClassroom from "./EditClassroom";
import NewClassroom from "./NewClassroom";
import ShowClassroom from "./ShowClassroom";
import styles from "./Classrooms.scss"

const Classrooms = props => {

    const {path, url} = props.match;

    return (
        <Fragment>
            <nav>
                <ul className={styles.nav}>
                    <li>classrooms:</li>
                    <li><NavLink exact to={url} activeClassName={styles.active}>index</NavLink></li>
                    <li><NavLink to={`${url}/new`} activeClassName={styles.active}>new</NavLink></li>
                </ul>
            </nav>
            <Switch>
                <Route path={`${path}/new`} component={NewClassroom} />
                <Route path={`${path}/:classroomId/edit`} component={EditClassroom} />
                <Route path={`${path}/:classroomId`} component={ShowClassroom} />
                <Route path={`${path}/`} component={ListClassrooms} />
            </Switch>
        </Fragment>
    );

};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Classrooms);
