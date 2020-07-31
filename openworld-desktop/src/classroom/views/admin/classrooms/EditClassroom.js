import React, {useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {ALERT_STATUS_ERROR, ALERT_STATUS_SUCCESS, receiveAlert} from "../../../actions/alerts";
import {destroyClassroom, readClassroom, updateClassroom} from "../../../actions/classrooms";
import styles from "./EditClassroom.scss";

const EditClassroom = props => {

    const {url} = props.match;

    const nameField = useRef(null);

    const onFormSubmit = event => {
        event.preventDefault();
        const [name] = [nameField].map(ref => ref.current.value);
        props
            .updateClassroom(props.match.params.classroomId, {name})
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

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
                    <form onSubmit={onFormSubmit}>
                        <fieldset>
                            <legend>update classroom</legend>
                            <div>
                                <label>name</label>
                                <input ref={nameField} type="text" defaultValue={props.classroom.name} placeholder="name" required disabled={props.isPending} />
                            </div>
                            <div>
                                <input type="submit" value="update" disabled={props.isPending} />
                            </div>
                        </fieldset>
                    </form>
                    <div>
                        <Link to={url.substr(0, url.lastIndexOf("/"))}>🔙</Link>
                        <Link to={url.substr(0, url.lastIndexOf("/") - 1)} onClick={onDestroyClick(props.classroom.id)} replace>❌</Link>
                    </div>
                </div>
            )
            : <p>classroom not found</p>
            : <p>fetching classroom&#8230;</p>
    );

};

const mapStateToProps = (state, ownProps) => ({isPending: state.classrooms.isPending, classroom: state.classrooms.classrooms.find(classroom => classroom.id === ownProps.match.params.classroomId)});
const mapDispatchToProps = {destroyClassroom, readClassroom, receiveAlert, updateClassroom};

export default connect(mapStateToProps, mapDispatchToProps)(EditClassroom);
