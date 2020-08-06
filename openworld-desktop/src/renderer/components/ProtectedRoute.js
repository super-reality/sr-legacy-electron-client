import React from "react";
import {connect} from "react-redux";
import {Redirect, Route, useLocation} from "react-router-dom";
import styles from "./ProtectedRoute.module.scss";

const ProtectedRoute = ({children, isAuthenticated, authPath, ...rest}) => {

    const {pathname} = useLocation();

    return (
        <Route {...rest}>
            {isAuthenticated ? children : <Redirect to={{pathname: authPath, state: {redirect: pathname}}} />}
        </Route>
    );

};

const mapStateToProps = state => ({isAuthenticated: state.auth.isValid});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
