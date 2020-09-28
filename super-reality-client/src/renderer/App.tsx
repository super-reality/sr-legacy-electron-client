import React, { useCallback, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import Test from "./views/test";
import Discover from "./views/discover";
import Learn from "./views/learn";
import TopSearch from "./components/top-search";
import reduxAction from "./redux/reduxAction";
import { AppState } from "./redux/stores/renderer";
import Splash from "./views/splash";
import Loading from "./components/loading";
import Profile from "./views/profile";
import Create from "./views/create";
import Tests from "./views/tests";
import DetachController from "./DetachController";
import "typeface-roboto";
import CvComponents from "./components/CvComponents";

export default function App(): JSX.Element {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);

  const { isLoading, detached } = useSelector(
    (state: AppState) => state.commonProps
  );
  const yScrollMoveTo = useSelector(
    (state: AppState) => state.render.yScrollMoveTo
  );

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const handleScroll = useCallback((): void => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      reduxAction(dispatch, { type: "SET_YSCROLL", arg: scrollTop });
    }
  }, [scrollRef, dispatch]);

  useEffect(() => {
    if (scrollRef.current && yScrollMoveTo !== undefined) {
      scrollRef.current.scrollTop = yScrollMoveTo;
      reduxAction(dispatch, { type: "SET_YSCROLL_MOVE", arg: undefined });
    }
  }, [yScrollMoveTo]);

  if (detached) {
    return <DetachController />;
  }

  return isAuthenticated ? (
    <>
      <CvComponents />
      <TopSearch />
      <Loading state={isLoading} />
      <div onScroll={handleScroll} ref={scrollRef} className="content">
        <div className="content-wrapper">
          <Switch>
            <Route path="/discover" component={Discover} />
            <Route path="/learn" component={Learn} />
            <Route path="/teach" component={Test} />
            <Route path="/create" component={Create} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </div>
      </div>
    </>
  ) : (
    <>
      <Loading state={isPending} />
      <Switch>
        <Route exact path="/tests/:id" component={Tests} />
        <Route path="*" component={Splash} />
      </Switch>
    </>
  );
}
