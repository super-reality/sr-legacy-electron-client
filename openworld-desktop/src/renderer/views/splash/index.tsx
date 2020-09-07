import React, { useState, useCallback } from "react";
import "./index.scss";
import { useHistory } from "react-router-dom";
import ButtonSimple from "../../components/button-simple";
import topTitle from "../../../assets/images/teacherbot.png";
import MuteButton from "../../components/mute-button";

export default function Splash(): JSX.Element {
  const history = useHistory();
  const [mute, setMute] = useState<boolean>(false);

  const onMute = useCallback(() => setMute(!mute), [mute]);

  return (
    <div className="splash-container">
      <div className="splash-logo">
        <img src={topTitle} />
      </div>
      <div className="splash-video">
        <video muted={mute} loop autoPlay>
          <source src="loading.mp4" type="video/mp4" />
        </video>
      </div>
      <MuteButton state={mute} callback={onMute} />
      <div className="splash-button">
        <ButtonSimple
          margin="16px auto"
          style={{
            maxWidth: "200px",
            height: "32px",
            width: "-webkit-fill-available",
          }}
          onClick={() => history.push("/auth")}
        >
          Login
        </ButtonSimple>
      </div>
    </div>
  );
}
