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
  addKeyDownListener,
} from "../../utils/globalKeyListeners";

import Sidebar from "../components/sidebar";
import BrowseLessons from "../components/browse-lessons";

function MainApp() {
  useTransparentFix();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);
  const { ready } = useSelector((state: AppState) => state.render);

  const { pathname } = useLocation();

  const { detached } = useSelector((state: AppState) => state.commonProps);

  const { yScrollMoveTo, topMost } = useSelector(
    (state: AppState) => state.render
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const [openHeXR, setOpenHeXR] = useState(false);

  useEffect(() => {
    if (scrollRef.current && yScrollMoveTo !== undefined) {
      scrollRef.current.scrollTop = yScrollMoveTo;
      reduxAction(dispatch, { type: "SET_YSCROLL_MOVE", arg: undefined });
    }
    addKeyDownListener("x", () => setOpenHeXR(!openHeXR));
  }, [yScrollMoveTo, openHeXR]);

  useEffect(() => {
    // Add as more modes are transparent
    const isTopMost = topMost || pathname == "/recorder";
    if (isTopMost) {
      setFocusable(false);
      setTopMost(true);
    } else {
      setFocusable(true);
      setTopMost(false);
    }
  }, [topMost, pathname]);

  if (detached) {
    return <DetachController />;
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
        <Route path="/lesson/create/:id" component={CreateLesson} />
        <Route path="/trello/home" component={TrelloBoard} />
      </Switch>
      {isAuthenticated && (
        <>
          <NavigationWidget show={openHeXR} />
          <Sidebar />
        </>
      )}
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

export default function App(): JSX.Element {
  const { background } = useSelector((state: AppState) => state.commonProps);

  if (background) {
    return <BackgroundController />;
  }
  return <MainApp />;
}
