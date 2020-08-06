import React, {useRef} from "react";
import {connect} from "react-redux";
import {ALERT_STATUS_ERROR, receiveAlert} from "../../../actions/alerts";
import {createClassroom} from "../../../actions/classrooms";
import styles from "./NewClassroom.scss";

const NewClassroom = props => {

    const {url} = props.match;

    const nameField = useRef(null);

    const onFormSubmit = event => {
        event.preventDefault();
        const [name] = [nameField].map(ref => ref.current.value);
        props
            .createClassroom({name})
            .then(classroom => props.history.push(`${url.substr(0, url.lastIndexOf("/"))}/${classroom.id}`))
            .catch(error => props.receiveAlert(ALERT_STATUS_ERROR, error.message));
    };

    return (
        <form onSubmit={onFormSubmit}>
            <fieldset>
                <legend>new classroom</legend>
                <div>
                    <label>name</label>
                    <input ref={nameField} type="text" placeholder="name" required disabled={props.isPending} />
                </div>
                <div>
                    <input type="submit" value="create" disabled={props.isPending} />
                </div>
            </fieldset>
        </form>
    );

};

const mapStateToProps = state => ({});
const mapDispatchToProps = {createClassroom, receiveAlert};

export default connect(mapStateToProps, mapDispatchToProps)(NewClassroom);
