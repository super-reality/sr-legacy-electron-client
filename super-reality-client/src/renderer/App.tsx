import React, { useCallback, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import Test from "./views/test";
import reduxAction from "./redux/reduxAction";
import { AppState } from "./redux/stores/renderer";
import Splash from "./views/splash";
import Loading from "./components/loading";
import Tests from "./views/tests";
import DetachController from "./DetachController";
import "typeface-roboto";
import BackgroundController from "./BackgroundController";
import Windowlet from "./components/create-leson-detached/windowlet";
import closeWindow from "../utils/electron/closeWindow";
import useTransparentFix from "./hooks/useTransparentFix";
import getPrimaryPos from "../utils/electron/getPrimaryPos";
import getDisplayBounds from "../utils/electron/getDisplayBounds";
import getPrimarySize from "../utils/electron/getPrimarySize";
import CreateLessonDetached from "./components/create-leson-detached";
import { MODE_HOME, MODE_LESSON_CREATOR } from "./redux/slices/renderSlice";

export default function App(): JSX.Element {
  useTransparentFix();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);
  const { ready, appMode } = useSelector((state: AppState) => state.render);

  const { isLoading, detached, background } = useSelector(
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
  if (background) {
    return <BackgroundController />;
  }
  if (!ready) {
    return <></>;
  }

  const primarySize = getPrimarySize();
  const primaryPos = getPrimaryPos(getDisplayBounds());
  const left = `${primaryPos.x + primarySize.width / 2 - 150}px`;
  const top = `${primaryPos.y + primarySize.height / 2 - 350}px`;

  return (
    <>
      {appMode == MODE_LESSON_CREATOR && <CreateLessonDetached />}
      {appMode == MODE_HOME && (
        <Windowlet
          width={300}
          height={700}
          initialLeft={left}
          initialTop={top}
          title="Super Reality"
          onClose={closeWindow}
        >
          {isAuthenticated ? (
            <>
              <div
                style={{
                  overflow: "hidden",
                  margin: "0",
                }}
              >
                <Loading state={isLoading} />
                <div
                  onScroll={handleScroll}
                  ref={scrollRef}
                  className="content"
                >
                  <Switch>
                    <Route path="/test" component={Test} />
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
          )}
        </Windowlet>
      )}
    </>
  );
}
