import React, { useState, useCallback } from "react";
import "./index.scss";
import { useHistory } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { useDispatch } from "react-redux";
import MuteButton from "../../components/mute-button";
import Auth from "../auth";
import reduxAction from "../../redux/reduxAction";

export default function Splash(): JSX.Element {
  const history = useHistory();
  const dispatch = useDispatch();
  const [mute, setMute] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(true);
  const [auth, setAuth] = useState<boolean>(false);

  const onMute = useCallback(() => setMute(!mute), [mute]);

  const authSpring = useSpring({
    transform: `scale(${showAuth ? 1 : 0.8}) translateX(${
      showAuth ? "0" : "400px"
    })`,
    opacity: showAuth ? 1 : 0,
  } as any);

  const doEnd = useCallback(() => {
    reduxAction(dispatch, {
      type: "AUTH_VALID",
      arg: true,
    });
    history.push(`/test`);
  }, [dispatch]);

  const fadeOutSpring = useSpring({
    opacity: auth ? 0 : 1,
    transform: `scale(${auth ? "1.1" : "1"})`,
    onRest: doEnd,
  } as any);

  const beginAuth = useCallback(() => {
    setAuth(true);
  }, []);

  return (
    <animated.div style={fadeOutSpring} className="splash-container">
      <video muted={mute} loop={false} autoPlay>
        <source src="loading.mp4" type="video/mp4" />
      </video>
      <div className="splash-mute">
        <MuteButton state={mute} callback={onMute} />
      </div>
      <animated.div style={{ ...authSpring }} className="splash-elements">
        <Auth onAuth={beginAuth} />
      </animated.div>
    </animated.div>
  );
}
