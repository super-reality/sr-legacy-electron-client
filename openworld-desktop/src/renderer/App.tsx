import React, { useCallback } from "react";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./views/admin/Admin";
import Auth from "./views/auth/Auth";
import { AppState } from "./redux/stores/renderer";
import { reduxAction } from "./redux/reduxAction";
import localForage from "localforage";
import Axios from "axios";
import TopNav from "./components/top-nav";
import css from "./App.scss";

export default function App(): JSX.Element {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const dispatch = useDispatch();
  const history = useHistory();

  const _authenticateFromLocalStorage = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_PENDING", arg: false });
    return localForage
      .getItem<string>("com.gamegen.classroom.auth.token")
      .then((token) => {
        if (token) {
          return Axios.post("http://localhost:3000/api/v1/auth/verify", null, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000,
          })
            .then((_response) => Promise.resolve(token))
            .catch((error) => Promise.reject(error));
        } else {
          return Promise.reject();
        }
      })
      .then((token) => {
        reduxAction(dispatch, { type: "AUTH_SUCCESSFUL", arg: token });
        return Promise.resolve();
      })
      .catch((error) => {
        reduxAction(dispatch, { type: "AUTH_FAILED", arg: false });
        return Promise.reject(error);
      });
  }, [dispatch]);

  const signOut = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_INVALIDATED", arg: false });
    return localForage.removeItem("com.gamegen.classroom.auth.token");
  }, [dispatch]);

  const onSignOutClick = (event) => {
    event.preventDefault();
    signOut();
    history.push("/auth");
  };

  return (
    <div className={css.mainWrapper}>
      <TopNav />
      <nav>
        {isAuthenticated ? (
          <ul className={css.nav}>
            <li>
              <NavLink exact to="/" activeClassName={css.active}>
                classroom
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" activeClassName={css.active}>
                admin
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/auth"
                activeClassName={css.active}
                onClick={onSignOutClick}
              >
                sign out
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul className={css.nav}>
            <li>
              <NavLink to="/auth" activeClassName={css.active}>
                sign in
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
      <Switch>
        <ProtectedRoute path="/admin" authPath="/auth" component={Admin} />
        <Route path="/auth" component={Auth} />
        <Route path="/">
          <p>classroom</p>
        </Route>
      </Switch>
    </div>
  );
}
