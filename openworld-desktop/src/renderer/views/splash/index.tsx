import React, { useState, useCallback } from "react";
import "./index.scss";
import { useHistory } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { useDispatch } from "react-redux";
import ButtonSimple from "../../components/button-simple";
import topTitle from "../../../assets/images/logo.png";
import MuteButton from "../../components/mute-button";
import Auth from "../auth";
import reduxAction from "../../redux/reduxAction";
import Category from "../../../types/collections";

export default function Splash(): JSX.Element {
  const history = useHistory();
  const dispatch = useDispatch();
  const [mute, setMute] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);

  const onMute = useCallback(() => setMute(!mute), [mute]);

  const authSpring = useSpring({
    transform: `scale(${showAuth ? 1 : 0.8}) translateY(${
      showAuth ? "-64px" : "-96px"
    })`,
    opacity: showAuth ? 1 : 0,
  } as any);

  const buttonSpring = useSpring({
    opacity: showAuth ? 0 : 1,
    display: showAuth ? "none" : "block",
  } as any);

  const downSpring = useSpring({
    opacity: auth ? 0 : 1,
    transform: `translateY(${auth ? "100px" : "0px"})`,
  } as any);

  const upSpring = useSpring({
    opacity: auth ? 0 : 1,
    transform: `translateY(${auth ? "-100px" : "0px"})`,
  } as any);

  const doEnd = useCallback(() => {
    reduxAction(dispatch, {
      type: "AUTH_VALID",
      arg: true,
    });
    history.push(`/discover/${Category.Collection}`);
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
      <animated.div style={upSpring} className="splash-shadow-top" />
      <animated.div style={downSpring} className="splash-shadow-bottom" />
      <video muted={mute} loop autoPlay>
        <source src="loading.mp4" type="video/mp4" />
      </video>
      <div className="splash-logo">
        <img src={topTitle} />
      </div>
      <div className="splash-elements">
        <animated.div style={{ ...authSpring }}>
          <Auth onAuth={beginAuth} />
        </animated.div>
        <animated.div className="splash-button" style={buttonSpring}>
          <ButtonSimple
            margin="16px auto"
            style={{
              maxWidth: "200px",
              height: "32px",
              width: "-webkit-fill-available",
            }}
            onClick={() => setShowAuth(!showAuth)}
          >
            Login
          </ButtonSimple>
        </animated.div>
        <div className="splash-mute">
          <MuteButton state={mute} callback={onMute} />
        </div>
      </div>
    </animated.div>
  );
}
