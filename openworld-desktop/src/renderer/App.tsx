import React, { useCallback, useEffect } from "react";
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
import { AppState } from "./redux/stores/renderer";
import Splash from "./views/splash";
import Loading from "./components/loading";
import Profile from "./views/profile";
import Create from "./views/create";
import Tests from "./views/tests";

export default function App(): JSX.Element {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const handleScroll = useCallback((): void => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      reduxAction(dispatch, { type: "SET_YSCROLL", arg: scrollTop });
    }
  }, [scrollRef, dispatch]);

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
    <>
      {isPending ? <Loading /> : <></>}
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route exact path="/tests/:id" component={Tests} />
        <Route path="*" component={Auth} />
      </Switch>
    </>
  );
}
