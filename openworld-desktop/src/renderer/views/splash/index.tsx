import React, { useState, useCallback } from "react";
import "./index.scss";
import { useHistory } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import ButtonSimple from "../../components/button-simple";
import topTitle from "../../../assets/images/logo.png";
import MuteButton from "../../components/mute-button";
import Auth from "../auth";

export default function Splash(): JSX.Element {
  const history = useHistory();
  const [mute, setMute] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const onMute = useCallback(() => setMute(!mute), [mute]);

  const authSpring = useSpring({
    transform: `scale(${showAuth ? 1 : 0.8}) translateY(${
      showAuth ? "0px" : "-30px"
    })`,
    opacity: showAuth ? 1 : 0,
  } as any);

  const buttonSpring = useSpring({
    opacity: showAuth ? 0 : 1,
    display: showAuth ? "none" : "block",
  } as any);

  return (
    <div className="splash-container">
      <video muted={mute} loop autoPlay>
        <source src="loading.mp4" type="video/mp4" />
      </video>
      <div className="splash-logo">
        <img src={topTitle} />
      </div>
      <div className="splash-elements">
        <animated.div style={{ ...authSpring }}>
          <Auth />
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
    </div>
  );
}
