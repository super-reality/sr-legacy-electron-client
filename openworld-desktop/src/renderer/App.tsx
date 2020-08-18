import React, { useCallback } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import Test from "./views/test";
import Auth from "./views/auth";
import Discover from "./views/discover";
import Learn from "./views/learn";
import Teach from "./views/teach";
import TopSearch from "./components/top-search";
import reduxAction from "./redux/reduxAction";
import CreateLesson from "./components/create-lesson";
import { AppState } from "./redux/stores/renderer";
import Splash from "./views/splash";
import Profile from "./views/profile";
import Create from "./views/create";

export default function App(): JSX.Element {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const handleScroll = useCallback((): void => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      reduxAction(dispatch, { type: "SET_YSCROLL", arg: scrollTop });
    }
  }, [scrollRef, dispatch]);

  /*
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

  const onSignOutClick = (event: any) => {
    event.preventDefault();
    signOut();
    history.push("/auth");
  };
  */

  return isAuthenticated ? (
    <>
      <TopSearch />
      <div onScroll={handleScroll} ref={scrollRef} className="content">
        <Switch>
          <Route exact path="/test" component={Test} />
          <Route exact path="/discover" component={Discover} />
          <Route exact path="/learn" component={Learn} />
          <Route exact path="/teach" component={Teach} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </div>
    </>
  ) : (
    <Switch>
      <Route exact path="/" component={Splash} />
      <Route exact path="/auth" component={Auth} />
    </Switch>
  );
}
// <ProtectedRoute path="/admin" authPath="/auth" component={Admin} />
