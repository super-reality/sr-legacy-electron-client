import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom";
import styles from "./ClassesPage.scss"
import { requestClasses } from "../actions";

const ClassesPage = props => {

    useEffect(() => {
        if(props.isAuthenticated) {
            props.requestClasses(props.auth);
        }
    }, []);

    return !props.isAuthenticated ? <Redirect to="/auth" /> :  (
        <div>
            <h1>Game Gen Classroom</h1>
            <h2>Classes</h2>
            {
                props.areClassesLoaded
                    ?
                    (
                        props.classes.length > 0
                            ? <ul>{props.classes.map(c => <li key={c.id}>{c.name}</li>)}</ul>
                            : <p>No classes available.</p>
                    )
                    : <p>Loading classes...</p>
            }
        </div>
    )

};

const mapStateToProps = state => ({ auth: state.auth, isAuthenticated: !!state.auth, classes: state.classes, areClassesLoaded: !!state.classes });
const mapDispatchToProps = { requestClasses };

export default connect(mapStateToProps, mapDispatchToProps)(ClassesPage)
