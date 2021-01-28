import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../index.scss";
import reduxAction from "../redux/reduxAction";
import { AppState } from "../redux/stores/renderer";
import Splash from "../views/splash";
import Loading from "../components/loading";
import DetachController from "../DetachController";
import "typeface-roboto";
import BackgroundController from "../BackgroundController";
import Windowlet from "../components/windowlet";
import closeWindow from "../../utils/electron/closeWindow";
import useTransparentFix from "../hooks/useTransparentFix";
import CreateLesson from "../components/create-leson-detached";
import ErrorBoundary from "../ErrorBoundary";
import minimizeWindow from "../../utils/electron/minimizeWindow";
import Recorder from "../components/recorder";
import setFocusable from "../../utils/electron/setFocusable";
import setTopMost from "../../utils/electron/setTopMost";
import {
  globalKeyDownListener,
  globalKeyUpListener,
} from "../../utils/globalKeyListeners";

import Sidebar from "../components/sidebar";
import BrowseLessons from "../components/browse-lessons";

export default function App(): JSX.Element {
  useTransparentFix();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);
  const { ready } = useSelector((state: AppState) => state.render);

  const { pathname } = useLocation();

  const { detached, background } = useSelector(
    (state: AppState) => state.commonProps
  );
  const yScrollMoveTo = useSelector(
    (state: AppState) => state.render.yScrollMoveTo
  );

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollRef.current && yScrollMoveTo !== undefined) {
      scrollRef.current.scrollTop = yScrollMoveTo;
      reduxAction(dispatch, { type: "SET_YSCROLL_MOVE", arg: undefined });
    }
  }, [yScrollMoveTo]);

  useEffect(() => {
    // Add as more modes are transparent
    const isTopMost = pathname == "/recorder";
    if (isTopMost) {
      setFocusable(false);
      setTopMost(true);
    } else {
      setFocusable(true);
      setTopMost(false);
    }
  }, [pathname]);

  if (detached) {
    return <DetachController />;
  }
  if (background) {
    return <BackgroundController />;
  }
  if (!ready) {
    return <></>;
  }

  document.onkeydown = globalKeyDownListener;
  document.onkeyup = globalKeyUpListener;

  return (
    <ErrorBoundary>
      <Switch>
        <Route exact path="/recorder" component={Recorder} />
        <Route exact path="/lesson/view" component={BrowseLessons} />
        <Route exact path="/lesson/create" component={CreateLesson} />
      </Switch>
      {isAuthenticated && <Sidebar />}
      {!isAuthenticated && (
        <Windowlet
          width={1100}
          height={600}
          title="Super Reality"
          onMinimize={minimizeWindow}
          onClose={closeWindow}
        >
          <Splash />
          <Loading state={isPending} />
        </Windowlet>
      )}
    </ErrorBoundary>
  );
}
