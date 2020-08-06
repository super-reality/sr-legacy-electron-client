import React, {Fragment, useEffect} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import classNames from "classnames";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../../actions/alerts";
import {destroyClassroom, hydrateClassrooms} from "../../../actions/classrooms";
import styles from "./ListClassrooms.scss";

const ListClassrooms = props => {

    const {url} = props.match;

    const onDestroyClick = classroomId => event => {
        props
            .destroyClassroom(classroomId)
            .then(classroom => props.receiveAlert(ALERT_STATUS_SUCCESS, `Classroom "${classroom.name}" destroyed.`))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    useEffect(() => {
        props
            .hydrateClassrooms()
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    }, []);

    return (
        !props.isPending || props.classrooms.length > 0
            ? props.classrooms.length > 0
            ? (
                <table className={classNames(styles.index, {[styles.isPending]: props.isPending})}>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        props.classrooms.map(classroom => (
                            <tr key={classroom.id}>
                                <td>
                                    <Link to={`${url}/${classroom.id}`}>{classroom.name}</Link>
                                </td>
                                <td>
                                    <Fragment>
                                        <Link to={`${url}/${classroom.id}/edit`}>✏</Link>
                                        <Link to={url} onClick={onDestroyClick(classroom.id)} replace>❌</Link>
                                    </Fragment>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            )
            : (
                <p>no classrooms</p>
            )
            : <p>fetching classrooms&#8230;</p>
    );

};

const mapStateToProps = state => ({isPending: state.classrooms.isPending, classrooms: state.classrooms.classrooms});
const mapDispatchToProps = {destroyClassroom, hydrateClassrooms, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(ListClassrooms);
