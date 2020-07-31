import React, {useEffect} from "react";
import {connect} from "react-redux";
import styles from "./ShowClassroom.scss";
import {destroyClassroom, readClassroom} from "../../../actions/classrooms";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../../actions/alerts";
import {Link} from "react-router-dom";

const ShowClassroom = props => {

    const {url} = props.match;

    const onDestroyClick = classroomId => event => {
        props
            .destroyClassroom(classroomId)
            .then(classroom => props.receiveAlert(ALERT_STATUS_SUCCESS, `Classroom "${classroom.name}" destroyed.`))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    useEffect(() => {
        props
            .readClassroom(props.match.params.classroomId)
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    }, []);

    return (
        !props.isPending || props.classroom
            ? props.classroom
            ? (
                <div>
                    <h3>{props.classroom.name}</h3>
                    <p>id: <code>{props.classroom.id}</code></p>
                    <div>
                        <Link to={`${url}/edit`}>✏</Link>
                        <Link to={url.substr(0, url.lastIndexOf("/"))} onClick={onDestroyClick(props.classroom.id)} replace>❌</Link>
                    </div>
                </div>
            )
            : <p>classroom not found</p>
            : <p>fetching classroom&#8230;</p>
    );

};

const mapStateToProps = (state, ownProps) => ({isPending: state.classrooms.isPending, classroom: state.classrooms.classrooms.find(classroom => classroom.id === ownProps.match.params.classroomId)});
const mapDispatchToProps = {destroyClassroom, readClassroom, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(ShowClassroom);
