import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import reduxAction from "./redux/reduxAction";
import { AppState } from "./redux/stores/renderer";
import Splash from "./views/splash";
import Loading from "./components/loading";
import Tests from "./views/tests";
import DetachController from "./DetachController";
import "typeface-roboto";
import BackgroundController from "./BackgroundController";
import Windowlet from "./components/windowlet";
import closeWindow from "../utils/electron/closeWindow";
import useTransparentFix from "./hooks/useTransparentFix";
import CreateLessonDetached from "./components/create-leson-detached";
import { MODE_LESSON_CREATOR, MODE_RECORDER } from "./redux/slices/renderSlice";
import ErrorBoundary from "./ErrorBoundary";
import minimizeWindow from "../utils/electron/minimizeWindow";
import Recorder from "./components/recorder";
import setFocusable from "../utils/electron/setFocusable";
import setTopMost from "../utils/electron/setTopMost";
import {
  globalKeyDownListener,
  globalKeyUpListener,
} from "../utils/globalKeyListeners";

import Sidebar from "./components/create-leson-detached/sidebar";

// import Test from "./views/test";

export default function App(): JSX.Element {
  useTransparentFix();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);
  const { ready, appMode } = useSelector((state: AppState) => state.render);

  const { detached, background } = useSelector(
    (state: AppState) => state.commonProps
  );
  const yScrollMoveTo = useSelector(
    (state: AppState) => state.render.yScrollMoveTo
  );

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  // const handleScroll = useCallback((): void => {
  //   if (scrollRef.current) {
  //     const { scrollTop } = scrollRef.current;
  //     reduxAction(dispatch, { type: "SET_YSCROLL", arg: scrollTop });
  //   }
  // }, [scrollRef, dispatch]);

  useEffect(() => {
    if (scrollRef.current && yScrollMoveTo !== undefined) {
      scrollRef.current.scrollTop = yScrollMoveTo;
      reduxAction(dispatch, { type: "SET_YSCROLL_MOVE", arg: undefined });
    }
  }, [yScrollMoveTo]);

  useEffect(() => {
    // Add as more modes are transparent
    const isTopMost = appMode == MODE_RECORDER;
    if (isTopMost) {
      setFocusable(false);
      setTopMost(true);
    } else {
      setFocusable(true);
      setTopMost(false);
    }
  }, [appMode]);

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
      {isAuthenticated && <Sidebar />}
      {appMode == MODE_RECORDER && <Recorder />}
      {appMode == MODE_LESSON_CREATOR && <CreateLessonDetached />}
      {!isAuthenticated && (
        <Windowlet
          width={1100}
          height={600}
          title="Super Reality"
          onMinimize={minimizeWindow}
          onClose={closeWindow}
        >
          <Loading state={isPending} />
          <Switch>
            <Route exact path="/tests/:id" component={Tests} />
            <Route path="*" component={Splash} />
          </Switch>
        </Windowlet>
      )}
    </ErrorBoundary>
  );
}
