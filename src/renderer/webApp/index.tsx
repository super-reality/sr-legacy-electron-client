import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../index.scss";
import reduxAction from "../redux/reduxAction";
import { AppState } from "../redux/stores/renderer";
import Splash from "../views/splash";
import Loading from "../components/loading";
import "typeface-roboto";
import ErrorBoundary from "../ErrorBoundary";
import {
  globalKeyDownListener,
  globalKeyUpListener,
} from "../../utils/globalKeyListeners";

import Sidebar from "../components/sidebar";

export default function WebApp() {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);

  const { yScrollMoveTo } = useSelector((state: AppState) => state.render);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollRef.current && yScrollMoveTo !== undefined) {
      scrollRef.current.scrollTop = yScrollMoveTo;
      reduxAction(dispatch, { type: "SET_YSCROLL_MOVE", arg: undefined });
    }
  }, [yScrollMoveTo]);

  document.onkeydown = globalKeyDownListener;
  document.onkeyup = globalKeyUpListener;

  return (
    <ErrorBoundary>
      {isAuthenticated ? (
        <Sidebar />
      ) : (
        <>
          <Splash />
          <Loading state={isPending} />
        </>
      )}
    </ErrorBoundary>
  );
}
