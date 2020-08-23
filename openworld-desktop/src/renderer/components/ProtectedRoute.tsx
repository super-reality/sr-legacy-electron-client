import React, { PropsWithChildren } from "react";
import { connect, useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";
import "./ProtectedRoute.scss";
import { AppState } from "../redux/stores/renderer";

const ProtectedRoute = (props: PropsWithChildren<{ authPath: string }>) => {
  const { authPath, children } = props;
  const { pathname } = useLocation();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);

  return (
    <Route>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={{ pathname: authPath, state: { redirect: pathname } }} />
      )}
    </Route>
  );
};

export default ProtectedRoute;
